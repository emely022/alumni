const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'alumni',
});

const testDbConnection = async (retries = 5, delay = 2000) => {
  for (let i = 1; i <= retries; i++) {
    try {
      const client = await pool.connect();
      console.log('Successfully connected to PostgreSQL database');
      client.release();
      return true;
    } catch (err) {
      console.warn(`PostgreSQL connection attempt ${i}/${retries} failed: ${err.message}`);
      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  console.error('Failed to connect to PostgreSQL database after retries');
  return false;
};

module.exports = {
  pool,
  testDbConnection,
};
