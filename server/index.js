const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const validate = require('./middleware/validate');
const { loginSchema } = require('./schemas/authSchema');
const { createOrderSchema } = require('./schemas/orderSchema');
const dotenv = require('dotenv');
const { createClient } = require('@libsql/client');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { syncOrderToKiotViet } = require('./kiotviet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
const port = process.env.PORT || 3001;

// ─── HTTP Security Headers ────────────────────────────────
app.use(helmet());

// ─── Cross-Origin Resource Sharing (CORS) ─────────────────
const allowedOrigins = [
  'https://daklink.vn', 
  'https://app.daklink.vn', 
  'http://localhost:5173', // For local development
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
// ─── Resource Protection: Limit JSON payload size ─────────
app.use(express.json({ limit: '2mb' }));

// ─── Global Rate Limiter ──────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  message: { error: 'Quá nhiều yêu cầu từ IP này. Vui lòng thử lại sau 15 phút.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Serve uploads directory statically
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/api/uploads', express.static(uploadsDir));

// ─── Multer Config ─────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Chỉ hỗ trợ định dạng ảnh (jpeg, jpg, png, webp)'));
  }
});

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// ─── Database Init ────────────────────────────────────────
async function initDb() {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS landing_products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        sku TEXT DEFAULT '',
        price INTEGER NOT NULL DEFAULT 0,
        image_url TEXT DEFAULT '',
        badge TEXT DEFAULT '',
        category TEXT NOT NULL DEFAULT 'tuoi',
        size TEXT DEFAULT '',
        description TEXT DEFAULT '',
        origin_country TEXT DEFAULT 'Việt Nam',
        origin_region TEXT DEFAULT 'Bình Thuận',
        origin_farmer TEXT DEFAULT '',
        origin_altitude TEXT DEFAULT '',
        origin_farm TEXT DEFAULT '',
        origin_variety TEXT DEFAULT '',
        origin_process TEXT DEFAULT '',
        flavor_notes TEXT DEFAULT '',
        story TEXT DEFAULT '',
        batch_number TEXT DEFAULT '',
        is_published INTEGER NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // --- Order Management Tables (Keep separate with "landing_" prefix) ---
    await client.execute(`
      CREATE TABLE IF NOT EXISTS landing_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_address TEXT NOT NULL,
        customer_note TEXT DEFAULT '',
        subtotal INTEGER NOT NULL DEFAULT 0,
        shipping_fee INTEGER NOT NULL DEFAULT 0,
        total_amount INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'PENDING',
        payment_status TEXT NOT NULL DEFAULT 'UNPAID',
        payment_method TEXT NOT NULL DEFAULT 'COD',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS landing_order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        product_price INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        image_url TEXT DEFAULT '',
        FOREIGN KEY (order_id) REFERENCES landing_orders(id) ON DELETE CASCADE
      )
    `);

    // Safe migration: add columns if they don't exist
    try {
      await client.execute(`ALTER TABLE landing_products ADD COLUMN options TEXT DEFAULT '[]'`);
      console.log('✅ Added options column to landing_products');
    } catch (e) {}
    
    try {
      await client.execute(`ALTER TABLE landing_products ADD COLUMN pairings TEXT DEFAULT '[]'`);
      console.log('✅ Added pairings column to landing_products');
    } catch (e) {}

    console.log('✅ Database initialized (landing tables ready)');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

initDb();

// ─── Auth Middleware ───────────────────────────────────────
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ─── Auth Routes ──────────────────────────────────────────
// ─── Sensitive Route Rate Limiter (Login) ─────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Strictly limit to 5 attempts
  message: { message: 'Thử lại quá nhiều lần. Vui lòng quay lại sau 15 phút.' },
});

app.post('/api/admin/login', loginLimiter, validate(loginSchema), (req, res) => {
  const { password } = req.body;
  
  if (password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

// ─── Admin: Upload Multiple Images ────────────────────────
app.post('/api/admin/upload', authenticateToken, upload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Vui lòng chọn ít nhất một ảnh' });
  }
  
  const urls = req.files.map(file => `/api/uploads/${file.filename}`);
  res.json({ success: true, urls: urls });
});

// ─── Admin: Get all batches from farmers (DISTINCT to fix duplicates) ───
app.get('/api/admin/batches', authenticateToken, async (req, res) => {
  try {
    const result = await client.execute({
      sql: `
        SELECT DISTINCT
          t.batch_number as batchNumber,
          t.harvest_date as harvestDate,
          c.name as productName,
          a.name as areaName,
          u.email as farmerEmail
        FROM traceability t
        LEFT JOIN crops c ON t.crop_id = c.id
        LEFT JOIN areas a ON c.area_id = a.id
        JOIN users u ON t.user_id = u.id
        WHERE t.status = 'APPROVED'
        GROUP BY t.batch_number
        ORDER BY t.created_at DESC
      `,
      args: [],
    });

    const batches = result.rows.map(row => ({
      batchNumber: row.batchNumber,
      productName: row.productName || "Sản phẩm nông nghiệp",
      areaName: row.areaName || "Khu vực sản xuất",
      harvestDate: row.harvestDate,
      farmerEmail: row.farmerEmail,
    }));

    res.json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ message: 'Error fetching batches' });
  }
});

// ─── Admin: Get all Traceability logs ─────────────────────
app.get('/api/admin/traceability', authenticateToken, async (req, res) => {
  try {
    const result = await client.execute({
      sql: `
        SELECT 
          t.id,
          t.batch_number as batchNumber,
          t.harvest_date as harvestDate,
          t.status,
          t.created_at as createdAt,
          c.name as productName,
          a.name as areaName,
          u.email as farmerEmail
        FROM traceability t
        LEFT JOIN crops c ON t.crop_id = c.id
        LEFT JOIN areas a ON c.area_id = a.id
        JOIN users u ON t.user_id = u.id
        ORDER BY t.created_at DESC
      `,
      args: [],
    });

    const traces = result.rows.map(row => ({
      id: row.id,
      batchNumber: row.batchNumber,
      productName: row.productName || "Sản phẩm nông nghiệp",
      areaName: row.areaName || "Khu vực sản xuất",
      harvestDate: row.harvestDate,
      farmerEmail: row.farmerEmail,
      status: row.status,
      createdAt: row.createdAt
    }));

    res.json(traces);
  } catch (error) {
    console.error('Error fetching traceability logs:', error);
    res.status(500).json({ message: 'Error fetching traceability logs' });
  }
});

// ─── Admin: Proxy PATCH to Core system for Traceability ────
app.patch('/api/admin/traceability/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const result = await client.execute({
      sql: 'UPDATE traceability SET status = ? WHERE id = ?',
      args: [status, id]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi để cập nhật' });
    }

    res.json({ success: true, message: `Status updated to ${status}` });
  } catch (error) {
    console.error('Error updating traceability in DB:', error);
    res.status(500).json({ message: 'Error updating traceability: ' + error.message });
  }
});

// ─── Admin: Create a new product ──────────────────────────
app.post('/api/admin/products', authenticateToken, async (req, res) => {
  const { slug, name, sku, price, images, badge, category, size, description,
          originCountry, originRegion, originFarmer, originAltitude, originFarm,
          originVariety, originProcess, flavorNotes, story, batchNumber, options, pairings } = req.body;
  try {
    const imageUrlJson = Array.isArray(images) ? JSON.stringify(images) : '[]';
    const optionsJson = Array.isArray(options) ? JSON.stringify(options) : '[]';
    const pairingsJson = Array.isArray(pairings) ? JSON.stringify(pairings) : '[]';
    
    await client.execute({
      sql: `INSERT INTO landing_products 
            (slug, name, sku, price, image_url, badge, category, size, description,
             origin_country, origin_region, origin_farmer, origin_altitude, origin_farm,
             origin_variety, origin_process, flavor_notes, story, batch_number, options, pairings, is_published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      args: [slug, name, sku || '', price || 0, imageUrlJson, badge || '', category || 'tuoi', size || '',
             description || '', originCountry || 'Việt Nam', originRegion || 'Bình Thuận',
             originFarmer || '', originAltitude || '', originFarm || '',
             originVariety || '', originProcess || '', flavorNotes || '', story || '', batchNumber || '', optionsJson, pairingsJson],
    });
    res.json({ success: true, message: 'Product created successfully' });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product: ' + error.message });
  }
});

// ─── Admin: Update a product ──────────────────────────────
app.put('/api/admin/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { slug, name, sku, price, images, badge, category, size, description,
          originCountry, originRegion, originFarmer, originAltitude, originFarm,
          originVariety, originProcess, flavorNotes, story, batchNumber, isPublished, options, pairings } = req.body;
  try {
    const imageUrlJson = Array.isArray(images) ? JSON.stringify(images) : '[]';
    const optionsJson = Array.isArray(options) ? JSON.stringify(options) : '[]';
    const pairingsJson = Array.isArray(pairings) ? JSON.stringify(pairings) : '[]';

    await client.execute({
      sql: `UPDATE landing_products SET 
            slug=?, name=?, sku=?, price=?, image_url=?, badge=?, category=?, size=?, description=?,
            origin_country=?, origin_region=?, origin_farmer=?, origin_altitude=?, origin_farm=?,
            origin_variety=?, origin_process=?, flavor_notes=?, story=?, batch_number=?, options=?, pairings=?, is_published=?
            WHERE id=?`,
      args: [slug, name, sku || '', price || 0, imageUrlJson, badge || '', category || 'tuoi', size || '',
             description || '', originCountry || 'Việt Nam', originRegion || 'Bình Thuận',
             originFarmer || '', originAltitude || '', originFarm || '',
             originVariety || '', originProcess || '', flavorNotes || '', story || '', batchNumber || '', optionsJson, pairingsJson,
             isPublished !== undefined ? (isPublished ? 1 : 0) : 1, id],
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// ─── Admin: Delete a product ──────────────────────────────
app.delete('/api/admin/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await client.execute({ sql: 'DELETE FROM landing_products WHERE id=?', args: [id] });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// ─── Admin: Get all products (including unpublished) ──────
app.get('/api/admin/products', authenticateToken, async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM landing_products ORDER BY created_at DESC');
    res.json(result.rows.map(mapRowToProduct));
  } catch (error) {
    console.error('Error fetching admin products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// ─── Public: Get all published products ───────────────────
app.get('/api/products', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM landing_products WHERE is_published = 1 ORDER BY created_at DESC');
    res.json(result.rows.map(mapRowToProduct));
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// ─── Public: Get single product by slug ───────────────────
app.get('/api/products/:slug', async (req, res) => {
  try {
    const result = await client.execute({
      sql: 'SELECT * FROM landing_products WHERE slug = ? AND is_published = 1',
      args: [req.params.slug],
    });
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(mapRowToProduct(result.rows[0]));
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// ─── Public: Featured products for homepage ───────────────
app.get('/api/featured-products', async (req, res) => {
  try {
    const result = await client.execute({
      sql: `
        SELECT DISTINCT
          t.batch_number as batchNumber,
          t.harvest_date as harvestDate,
          c.name as productName,
          a.name as areaName
        FROM featured_batches fb
        JOIN traceability t ON fb.batch_number = t.batch_number
        LEFT JOIN crops c ON t.crop_id = c.id
        LEFT JOIN areas a ON c.area_id = a.id
        GROUP BY t.batch_number
        ORDER BY fb.created_at DESC
      `,
    });
    res.json(result.rows.map(row => ({
      batchNumber: row.batchNumber,
      productName: row.productName || "Sản phẩm nông nghiệp",
      areaName: row.areaName || "Khu vực sản xuất",
      harvestDate: row.harvestDate,
    })));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// ─── Helper ───────────────────────────────────────────────
// ─── Order Creation Rate Limiter ──────────────────────────
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Limit 5 orders per 15 minutes per IP
  message: { message: 'Tạo đơn hàng quá nhanh. Vui lòng thử lại sau 15 phút.' },
});

// ─── Orders: Public Create ────────────────────────────────
app.post('/api/orders', orderLimiter, validate(createOrderSchema), async (req, res) => {
  const { customerName, customerPhone, customerAddress, customerNote, subtotal, shippingFee, totalAmount, items } = req.body;
  
  // ⚡ GUARANTEE: If execution reaches here, req.body is 100% typed and validated by Zod!

  try {
    // Start transaction (serial execution since libsql-client doesn't have native multi-statement transactions in one go easily)
    const orderResult = await client.execute({
      sql: `INSERT INTO landing_orders 
            (customer_name, customer_phone, customer_address, customer_note, subtotal, shipping_fee, total_amount, status, payment_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', 'UNPAID')`,
      args: [customerName, customerPhone, customerAddress, customerNote || '', subtotal, shippingFee, totalAmount]
    });

    const orderId = orderResult.lastInsertRowid;

    // Insert items one by one (or batch if possible)
    for (const item of items) {
      await client.execute({
        sql: `INSERT INTO landing_order_items 
              (order_id, product_id, product_name, product_price, quantity, image_url)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [orderId, item.id, item.name, item.price, item.quantity, item.image || '']
      });
    }

    // --- KiotViet Async Sync ---
    // We don't await this or wait for its result so the user checkout is fast and never fails if KV is down.
    syncOrderToKiotViet({ customerName, customerPhone, customerAddress, customerNote, subtotal, shippingFee, totalAmount, items }, client)
      .catch(err => console.error("Unhandled KiotViet wrapper error:", err));

    res.json({ success: true, orderId: String(orderId) });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Lỗi khi lưu đơn hàng: ' + error.message });
  }
});

// ─── Admin: Get all Orders ────────────────────────────────
app.get('/api/admin/orders', authenticateToken, async (req, res) => {
  try {
    const ordersResult = await client.execute('SELECT * FROM landing_orders ORDER BY created_at DESC');
    const orders = ordersResult.rows;

    // Fetch items for each order (In a real app, optimize this with a JOIN)
    const fullOrders = await Promise.all(orders.map(async (order) => {
      const itemsResult = await client.execute({
        sql: 'SELECT * FROM landing_order_items WHERE order_id = ?',
        args: [order.id]
      });
      return {
        ...order,
        items: itemsResult.rows
      };
    }));

    res.json(fullOrders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// ─── Admin: Update Order Status ───────────────────────────
app.patch('/api/admin/orders/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status, payment_status } = req.body;
  
  try {
    const updates = [];
    const args = [];
    
    if (status) {
      updates.push('status = ?');
      args.push(status);
    }
    if (payment_status) {
      updates.push('payment_status = ?');
      args.push(payment_status);
    }
    
    if (updates.length === 0) return res.status(400).json({ message: 'Nothing to update' });
    
    args.push(id);
    
    const result = await client.execute({
      sql: `UPDATE landing_orders SET ${updates.join(', ')} WHERE id = ?`,
      args: args
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Error updating order' });
  }
});

// ─── Admin: Delete Order ──────────────────────────────────
app.delete('/api/admin/orders/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    // Delete items first due to foreign key (if any, though usually we just delete)
    await client.execute({
      sql: 'DELETE FROM landing_order_items WHERE order_id = ?',
      args: [id]
    });
    
    const result = await client.execute({
      sql: 'DELETE FROM landing_orders WHERE id = ?',
      args: [id]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Error deleting order' });
  }
});

function mapRowToProduct(row) {
  let images = [];
  try {
    // Try to parse as JSON array
    const parsed = JSON.parse(row.image_url);
    images = Array.isArray(parsed) ? parsed : [row.image_url];
  } catch (e) {
    // Fallback if it's just a single URL string
    images = row.image_url ? [row.image_url] : [];
  }

  return {
    id: String(row.id),
    slug: row.slug,
    name: row.name,
    sku: row.sku || '',
    price: row.price,
    images: images,
    image: images[0] || '', // Maintain legacy single 'image' field for thumbnails
    badge: row.badge || '',
    category: row.category,
    size: row.size || '',
    description: row.description || '',
    origin: {
      country: row.origin_country || 'Việt Nam',
      region: row.origin_region || 'Bình Thuận',
      farmer: row.origin_farmer || '',
      altitude: row.origin_altitude || '',
      farm: row.origin_farm || '',
      variety: row.origin_variety || '',
      process: row.origin_process || '',
    },
    flavorNotes: row.flavor_notes || '',
    story: row.story || '',
    batchNumber: row.batch_number || '',
    isPublished: row.is_published === 1,
    options: (() => {
      try { return JSON.parse(row.options || '[]'); } catch (e) { return []; }
    })(),
    pairings: (() => {
      try { return JSON.parse(row.pairings || '[]'); } catch (e) { return []; }
    })(),
  };
}

// ─── AI Chatbot RAG Route ─────────────────────────────────
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { error: 'Bạn đã gửi tin nhắn quá nhanh. Vui lòng thử lại sau 1 phút.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.post('/api/chat', chatLimiter, async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    // 1. Fetch current context from DB
    const rs = await client.execute("SELECT * FROM landing_products WHERE is_published = 1");
    const products = rs.rows.map(mapRowToProduct);

    // Prepare context
    const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
    const productsContext = products.map(p => 
      `- Tên: ${p.name}\n  Giá: ${p.price > 0 ? currencyFormatter.format(p.price) : 'Liên hệ'}\n  Phân loại: ${p.category}\n  Mã lô: ${p.batchNumber || 'N/A'}\n  Mô tả: ${p.description}`
    ).join('\n\n');

    const systemInstruction = `
Bạn là **Daklink** – đại diện bán hàng chuyên nghiệp và tinh tế. 
Tên gọi: **Daklink**.

### QUY TẮC EMOJI (QUAN TRỌNG):
- **CỰC KỲ TIẾT CHẾ**: Chỉ sử dụng tối đa **1 emoji** trong toàn bộ một lần phản hồi. Có những lúc không cần dùng nếu thấy không cần thiết.
- **LINH HOẠT**: Không đặt emoji mặc định ở cuối mỗi câu/đoạn. Hãy đặt nó một cách tự nhiên (VD: chào hỏi hoặc kết thúc đơn hàng).
- **CHỈ DÙNG MẶT CƯỜI**: Chỉ dùng các mặt cười nhẹ nhàng (😊, 🙂). Tuyệt đối **KHÔNG** dùng icon rau củ, đồ vật.

### PHONG CÁCH TƯ VẤN:
- **Tự nhiên & Chuyên nghiệp**: Nói chuyện như một người tư vấn thật thụ.
- **Minh bạch & Truy xuất**: Khi khách hỏi về nguồn gốc hoặc sự an tâm, hãy nhắc đến Nhật ký canh tác. Nếu sản phẩm có "Mã lô" (Batch Number), hãy chèn một nút bấm bằng cú pháp: \`[BUTTON:Xem Nhật Ký|https://app.daklink.vn/trace/MÃ_LÔ]\`.
- **Sản phẩm**: Chỉ nói về sản phẩm khi khách hỏi. Sử dụng dữ liệu:
${productsContext}

### KỊCH BẢN:
- **Chào hỏi**: Ngắn gọn, lịch sự, sẵn sàng lắng nghe.
- **Hỏi sản phẩm**: Tập trung vào giá và sự an tâm. Nếu có mã lô, đừng quên chèn nút Xem Nhật Ký ngay sau câu trả lời.
    `;

    // Initialize model with system prompt
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: systemInstruction,
    });

    // Filter history: Gemini requires first message to be 'user' role
    // Drop any leading 'model' messages (e.g. the greeting)
    const filteredHistory = conversationHistory
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }))
      .filter((msg, idx, arr) => {
        // Remove leading model messages
        if (idx === 0 && msg.role === 'model') return false;
        return true;
      });

    const chat = model.startChat({
      history: filteredHistory,
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.json({ reply: responseText });
  } catch (error) {
    console.error('Chat AI Error:', error);
    res.status(500).json({ error: 'Failed to process AI chat' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Admin Server running on port ${port}`);
});
