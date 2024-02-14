const express = require('express');
const { engine } = require('express-handlebars');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('home', { message: "Hello, World!" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
