// Seed script: Inserts the 5 original chili products into landing_products table
const { createClient } = require('@libsql/client');
const dotenv = require('dotenv');

dotenv.config();

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const products = [
  {
    slug: 'ot-chi-thien-tuoi',
    name: 'Ớt Chỉ Thiên Tươi',
    price: 45000,
    image_url: '',
    badge: 'Bestseller',
    category: 'tuoi',
    size: '1kg',
    description: 'Ớt Chỉ Thiên tươi nguyên trái, thu hoạch tại vườn Bình Thuận. Trái nhỏ, cuống xanh, màu đỏ tươi bắt mắt, vị cay nồng đặc trưng, thơm lâu.',
    origin_country: 'Việt Nam',
    origin_region: 'Bình Thuận',
    origin_farmer: 'Hợp tác xã Nông nghiệp Bình Thuận',
    origin_altitude: 'Đồng bằng duyên hải',
    origin_farm: 'Vườn ớt chuẩn VietGAP',
    origin_variety: 'Chỉ Thiên',
    origin_process: 'Thu hoạch & Phân loại thủ công',
    flavor_notes: 'Cay nồng, thơm đặc trưng, hậu vị the gắt.',
    story: 'Nắng gió Bình Thuận tạo nên những trái ớt Chỉ Thiên mang vị cay đậm đà, da căng bóng. Sản phẩm được trồng theo tiêu chuẩn an toàn, thu hoạch vào tờ mờ sáng để giữ độ tươi ngon nhất.',
    batch_number: 'BATCH-OT-CT-001',
  },
  {
    slug: 'ot-sung-trau-tuoi',
    name: 'Ớt Sừng Trâu (Ít Cay)',
    price: 35000,
    image_url: '',
    badge: 'Mới',
    category: 'tuoi',
    size: '1kg',
    description: 'Ớt Sừng Trâu với trái to, dài, thịt dày, giòn. Màu đỏ rực rỡ, vị cay nhẹ, hơi ngọt, rất thích hợp để ăn sống, làm salad hoặc trang trí món ăn.',
    origin_country: 'Việt Nam',
    origin_region: 'Bình Thuận',
    origin_farmer: 'Hợp tác xã Nông nghiệp Bình Thuận',
    origin_altitude: 'Đồng bằng duyên hải',
    origin_farm: 'Dự án Nông nghiệp sạch',
    origin_variety: 'Sừng Trâu Vàng/Đỏ',
    origin_process: 'Thu hoạch & Phân loại thủ công',
    flavor_notes: 'Giòn, ngọt dịu, cay nhẹ (Mild).',
    story: 'Giống ớt sừng đặc biệt được canh tác hữu cơ tại vùng đất pha cát Bình Thuận, cho ra những trái ớt to đều, thịt dày và đặc biệt giàu vitamin C, mang lại màu sắc bắt mắt cho mọi mâm cơm.',
    batch_number: 'BATCH-OT-ST-002',
  },
  {
    slug: 'tuong-ot-nguyen-chat',
    name: 'Tương Ớt Nguyên Chất 100%',
    price: 65000,
    image_url: '',
    badge: 'Đặc sản',
    category: 'kho',
    size: 'Chai 500ml',
    description: 'Tương ớt truyền thống Bình Thuận, làm từ 100% ớt Chỉ Thiên tươi, mắm nhĩ và tỏi. Không chất bảo quản, không phẩm màu. Vị cay bùng nổ, hậu ngọt mắm.',
    origin_country: 'Việt Nam',
    origin_region: 'Bình Thuận',
    origin_farmer: 'Lò mắm truyền thống',
    origin_altitude: 'Ven biển',
    origin_farm: 'Thu mua từ các vựa VietGAP',
    origin_variety: 'Chỉ Thiên & Tỏi Phan Thiết',
    origin_process: 'Lên men tự nhiên',
    flavor_notes: 'Cay xé lưỡi, mặn đậm đà, vương vấn mùi tỏi lên men.',
    story: 'Công thức gia truyền kết hợp những trái ớt Chỉ Thiên đỏ au và tỏi Phan Thiết, ủ lên men tự nhiên với nước mắm cá cơm nguyên chất rỉ ra từng giọt, tạo thành loại tương ớt đặc sản không thể thiếu trong bữa ăn.',
    batch_number: 'BATCH-TO-NC-003',
  },
  {
    slug: 'ot-bot-sieu-cay',
    name: 'Ớt Bột Siêu Cay Khô Tự Nhiên',
    price: 85000,
    image_url: '',
    badge: 'HOT',
    category: 'kho',
    size: 'Hũ 200g',
    description: 'Ớt bột 100% nguyên chất, sấy khô bằng năng lượng mặt trời. Giữ nguyên màu đỏ tự nhiên và mức độ cay nồng cực mạnh. Dùng ướp thịt, nấu canh Thái.',
    origin_country: 'Việt Nam',
    origin_region: 'Bình Thuận',
    origin_farmer: 'Hợp tác xã Nông nghiệp Bình Thuận',
    origin_altitude: 'Đồng bằng duyên hải',
    origin_farm: 'Vùng trồng kiểm soát',
    origin_variety: 'Chỉ Thiên lai',
    origin_process: 'Phơi nắng tự nhiên & Xay mịn',
    flavor_notes: 'Rất cay, thơm mùi nắng, có chút dư vị khói.',
    story: 'Để có hũ ớt bột đỏ thắm và thơm nồng, những quả ớt tươi nhất được chọn lọc, bổ đôi và phơi tự nhiên dưới cái nắng giòn tan của Bình Thuận trong 4-5 ngày, hoàn toàn không dùng máy sấy công nghiệp.',
    batch_number: 'BATCH-OB-SC-004',
  },
  {
    slug: 'ot-xiem-xanh-rung',
    name: 'Ớt Xiêm Xanh (Ớt Rừng)',
    price: 95000,
    image_url: '',
    badge: 'Hiếm',
    category: 'tuoi',
    size: '500g',
    description: 'Ớt xiêm xanh (ớt chim ị) quả nhỏ xíu, vỏ mỏng, cực kỳ giòn và cay hiểm, thơm sộc mũi. Đặc sản quý hiếm thu hái từ bìa rừng hoặc trồng bán hoang dã.',
    origin_country: 'Việt Nam',
    origin_region: 'Vùng cao Bình Thuận',
    origin_farmer: 'Người đồng bào bản địa',
    origin_altitude: '500 MASL',
    origin_farm: 'Canh tác dưới tán rừng',
    origin_variety: 'Xiêm rừng',
    origin_process: 'Hái lượm & Giao ngay',
    flavor_notes: 'Gay gắt, thơm nồng đậm, the mát đặc biệt.',
    story: 'Giống ớt bản địa mọc hoang rải rác được thu thuần hóa. Trái rất nhỏ gọn, khi ăn có độ giòn tan, vị cay bùng phát tức thì và đi kèm với mùi thơm nồng nàn không loại ớt nào bì được.',
    batch_number: 'BATCH-OT-XX-005',
  },
];

async function seed() {
  console.log('🌱 Seeding products...');
  
  // Create table first
  await client.execute(`
    CREATE TABLE IF NOT EXISTS landing_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
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

  for (const p of products) {
    try {
      await client.execute({
        sql: `INSERT OR IGNORE INTO landing_products 
              (slug, name, price, image_url, badge, category, size, description,
               origin_country, origin_region, origin_farmer, origin_altitude, origin_farm,
               origin_variety, origin_process, flavor_notes, story, batch_number, is_published)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        args: [p.slug, p.name, p.price, p.image_url, p.badge, p.category, p.size, p.description,
               p.origin_country, p.origin_region, p.origin_farmer, p.origin_altitude, p.origin_farm,
               p.origin_variety, p.origin_process, p.flavor_notes, p.story, p.batch_number],
      });
      console.log(`  ✅ ${p.name}`);
    } catch (err) {
      console.log(`  ⚠️  ${p.name} (already exists or error: ${err.message})`);
    }
  }
  
  console.log('🎉 Seeding complete!');
}

seed().catch(console.error);
