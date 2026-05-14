const dotenv = require('dotenv');
dotenv.config();

const KV_RETAILER = process.env.KV_RETAILER;
const KV_CLIENT_ID = process.env.KV_CLIENT_ID;
const KV_CLIENT_SECRET = process.env.KV_CLIENT_SECRET;

let cachedToken = null;
let tokenExpiresAt = 0;

let cachedBranchId = null;

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - 5 * 60 * 1000) {
    // Return cached token if valid (buffer of 5 mins)
    return cachedToken;
  }

  console.log('🔄 Fetching new KiotViet Access Token...');
  const params = new URLSearchParams();
  params.append('scopes', 'PublicApi.Access');
  params.append('grant_type', 'client_credentials');
  params.append('client_id', KV_CLIENT_ID);
  params.append('client_secret', KV_CLIENT_SECRET);

  try {
    const response = await fetch('https://id.kiotviet.vn/connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`KiotViet Auth Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    cachedToken = data.access_token;
    tokenExpiresAt = now + (data.expires_in * 1000);
    console.log('✅ KiotViet Token obtained successfully.');
    return cachedToken;
  } catch (error) {
    console.error('❌ Failed to get KiotViet Access Token:', error);
    throw error;
  }
}

async function getDefaultBranchId(token) {
  if (cachedBranchId) return cachedBranchId;

  try {
    const response = await fetch('https://public.kiotapi.com/branches', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Retailer': KV_RETAILER
      }
    });

    if (!response.ok) throw new Error('Failed to fetch branches');
    const data = await response.json();
    
    // Pick the first active branch
    const branch = data.data && data.data.length > 0 ? data.data[0] : null;
    if (branch) {
      cachedBranchId = branch.id;
      console.log(`✅ KiotViet Default Branch ID set to: ${cachedBranchId} (${branch.branchName})`);
      return cachedBranchId;
    }
    throw new Error('No branches found in KiotViet');
  } catch (error) {
    console.error('❌ Failed to get KiotViet branches:', error);
    throw error;
  }
}

async function syncOrderToKiotViet(webOrder, dbClient) {
  try {
    console.log(`🚀 Starting KiotViet Sync for Web Order:`, webOrder.customerName);
    
    // 1. Get Token & Branch
    const token = await getAccessToken();
    const branchId = await getDefaultBranchId(token);

    // 2. Map Items & Resolve SKUs
    // Since webOrder.items only has website product ID/slug, we need to fetch the 'sku' from DB
    const orderDetails = [];
    
    for (const item of webOrder.items) {
       // Find SKU from landing_products using product_id
       const rs = await dbClient.execute({
         sql: 'SELECT sku FROM landing_products WHERE id = ?',
         args: [item.id]
       });
       
       const sku = rs.rows.length > 0 && rs.rows[0].sku ? rs.rows[0].sku : null;
       
       if (!sku) {
          console.warn(`⚠️ Warning: Product "${item.name}" (ID: ${item.id}) is missing KiotViet SKU. It might cause KiotViet sync to fail if it's strictly required.`);
          // KiotViet requires productCode to match exactly. If missing, we still try to pass something (e.g. website slug/id) but it will likely 400.
       }

       orderDetails.push({
         productCode: sku || `WEB_${item.id}`, // fallback to WEB_${id} to avoid immediate null crash, KiotViet will reject if not exist.
         quantity: item.quantity,
         price: item.price,
       });
    }

    // 3. Construct KiotViet Payload
    const kvOrderPayload = {
      branchId: branchId,
      description: `Đơn hàng từ Website Daklink - Nguồn: daklink.vn. Ghi chú của khách: ${webOrder.customerNote || 'Không có'}`,
      totalPayment: 0, // Customer pays nothing yet (COD)
      method: "Chuyển phát", 
      deliveryFee: webOrder.shippingFee, // Shipping fee mapping
      customer: {
        name: webOrder.customerName,
        contactNumber: webOrder.customerPhone,
        address: webOrder.customerAddress
      },
      orderDetails: orderDetails
    };

    // 4. Send Post Request
    const response = await fetch('https://public.kiotapi.com/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Retailer': KV_RETAILER
      },
      body: JSON.stringify(kvOrderPayload)
    });

    const responseData = await response.text();

    if (!response.ok) {
       console.error(`❌ KiotViet Sync Failed: ${response.status} - ${responseData}`);
       // We do not throw to prevent breaking website order creation
       return false;
    }

    console.log('✅ KiotViet Sync Success! Order ID in KiotViet:', JSON.parse(responseData).id);
    return true;

  } catch (error) {
    console.error('❌ Exception during KiotViet Sync:', error);
    return false;
  }
}

module.exports = {
  syncOrderToKiotViet
};
