require('dotenv').config();
const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
  try {
    console.log('Adding sku column to landing_products...');
    await client.execute('ALTER TABLE landing_products ADD COLUMN sku TEXT DEFAULT "";');
    console.log('✅ SKU column added successfully.');
  } catch (err) {
    if (err.message && err.message.includes('duplicate column name')) {
      console.log('ℹ️ SKU column already exists. Skipping.');
    } else {
      console.error('❌ Error adding column:', err);
    }
  }
}

run();
