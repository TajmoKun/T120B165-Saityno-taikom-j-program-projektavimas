const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: String(process.env.DB_USER),
  password: String(process.env.DB_PASSWORD),
  host: String(process.env.DB_HOST),
  port: Number(process.env.DB_PORT),
  database: String(process.env.DB_NAME)
});


// pool.query(`
//   CREATE TABLE IF NOT EXISTS users (
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(50) UNIQUE NOT NULL,
//     email VARCHAR(255) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
//   )
// `).then(() => {
//   console.log('Users table created or already exists');
// }).catch(err => {
//   console.error('Error creating users table:', err);
// });

module.exports = {
  query: (text, params) => pool.query(text, params),
};