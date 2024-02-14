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

app.get('/listings-summary', async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT 
        site_id AS site,
        TO_CHAR(listing_date, 'FMMonth YYYY') AS listing_month,
        COUNT(id) AS total_listings,
        AVG(revenue)::numeric AS average_revenue  -- Removed ROUND, cast to numeric for precision
      FROM 
        deals
      WHERE 
        listing_date BETWEEN '2020-11-01' AND '2021-11-30'
      GROUP BY 
        site, listing_month
      ORDER BY 
        site, listing_month;
    `);

    // Structure data for the front end
    const listingsSummary = result.rows.reduce((acc, { site, listing_month, total_listings, average_revenue }) => {
      if (!acc[site]) {
        acc[site] = { months: [], totalListings: [], averageRevenue: [] };
      }
      acc[site].months.push(listing_month);
      acc[site].totalListings.push(total_listings);
      acc[site].averageRevenue.push(average_revenue);
      return acc;
    }, {});

    res.render('listings-summary', { listingsSummary: JSON.stringify(listingsSummary) });
  } catch (err) {
    console.error('Error executing listings summary query', err.stack);
    res.status(500).send('Internal Server Error');
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
