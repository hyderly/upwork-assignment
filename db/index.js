const { Pool } = require('pg');


const pool = new Pool({
  user: process.env.DB_USER || 'yourUsername',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'yourDatabaseName',
  password: process.env.DB_PASSWORD || 'yourPassword',
  port: process.env.DB_PORT || 5432,
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