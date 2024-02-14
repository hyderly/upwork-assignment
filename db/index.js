const { Pool } = require('pg');


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
}
});

// Event listener for successful connection
pool.on('connect', client => {
  console.log('Connected to the database successfully!');
});

// Event listener for errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  pool.end(() => {
    console.log('Pool has ended');
  });
  process.exit(-1);
});


module.exports = pool;