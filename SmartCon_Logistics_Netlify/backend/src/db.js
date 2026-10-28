const { Pool } = require('pg');
const ssl = process.env.DB_SSL === 'true'
  ? (process.env.DB_SSL_CA ? { ca: process.env.DB_SSL_CA.replace(/\\n/g, '\n') } : { rejectUnauthorized: true })
  : undefined;
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'smartcon',
  user: process.env.DB_USER || 'smartcon',
  password: process.env.DB_PASSWORD || '',
  max: Number(process.env.DB_POOL_MAX || 3),
  connectionTimeoutMillis: 10000,
  ssl
});
module.exports = { query: (text, params) => pool.query(text, params), pool };
