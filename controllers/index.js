
const pool = require('../db/index.js');

const listings = async (req, res) => {
  try {
    const queryResult = await pool.query(`
      SELECT 
        d.id, 
        d.listing_date, 
        TO_CHAR(d.listing_date, 'Month') AS listing_month,
        s.title AS broker,  -- Joining with the sites table to get the title
        d.revenue
      FROM 
        deals d
      INNER JOIN 
        sites s ON d.site_id = s.id  -- This joins the deals table with the sites table
      WHERE 
        d.listing_date >= '2020-11-01' AND d.listing_date <= '2021-11-30'
      ORDER BY 
        d.listing_date ASC;
    `);
    const listings = queryResult.rows.map(row => ({
      ...row,
      listing_date: row.listing_date.toISOString().split('T')[0], // Format listing_date as YYYY-MM-DD
      listing_month: row.listing_month.trim() // Ensure the month name does not have trailing spaces
    }));
    res.render('listings', { listings }); // 'listings' is the name of your Handlebars template
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


const listingSummary = async (req, res) => {
  try {
    const queryText = `
      SELECT 
        d.site_id AS site,
        s.title AS site_title,
        TO_CHAR(d.listing_date, 'FMMonth YYYY') AS listing_month,
        COUNT(d.id) AS total_listings,
        AVG(d.revenue)::numeric AS average_revenue
      FROM 
        deals d
      INNER JOIN 
        sites s ON s.id = d.site_id
      WHERE 
        d.listing_date BETWEEN '2020-11-01' AND '2021-11-30'
      GROUP BY 
        d.site_id, s.title, listing_month
      ORDER BY 
        d.site_id, listing_month;
    `;

    const result = await pool.query(queryText);



        // Continue from above...
        const listingsSummary = result.rows.reduce((acc, { site, site_title, listing_month, total_listings, average_revenue }) => {
          if (!acc[site]) {
            acc[site] = { siteTitle: site_title, months: [], totalListings: [], averageRevenue: [] };
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
};

module.exports = {listings, listingSummary}