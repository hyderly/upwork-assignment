const express = require('express');
const { engine } = require('express-handlebars');

require('dotenv').config();

const pool = require('./db/index.js');

const listingRoute = require("./routes/index.js");


const app = express();
const PORT = process.env.PORT;

app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use("/", listingRoute);



app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
