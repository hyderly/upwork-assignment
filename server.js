const express = require('express');
const { engine } = require('express-handlebars');

require('dotenv').config();

const pool = require('./db/index.js');

const app = express();
const PORT = process.env.PORT;

app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('home', { message: "Hello, World!" });
});

app.get('/listings', async (req, res) => {
  try {
    const queryResult = await pool.query(`
      SELECT 
        id, 
        listing_date, 
        TO_CHAR(listing_date, 'Month') AS listing_month,
        site_id AS broker, 
        revenue
      FROM 
        deals
      WHERE 
        listing_date >= '2020-11-01' AND listing_date <= '2021-11-30'
      ORDER BY 
        listing_date ASC;
    `);
    const listings = queryResult.rows;
    res.render('listings', { listings }); // 'listings' is the name of your Handlebars template
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Function to test the database connection
async function testDbConnection() {
  try {
      const { rows } = await pool.query('SELECT NOW()');
      console.log('Current time from DB:', rows[0].now);
      console.log('Connected to the database successfully!');
  } catch (err) {
      console.error('Database connection error:', err);
  }
}

// Call the function to test the database connection
testDbConnection();

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
