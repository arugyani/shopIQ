/**
 * Filename: app.js
 * Project: ShopIQ
 * Author: Divyam Khatri, Junseok Jang
 * Created: 02/27/2024
 * Description: Entry point for the Express application.
 */
const express = require("express");
const app = express();
const port = 3000;

const handleFiltersRoute = require('./src/routes/handleFilterRoute');
const recommendationRoute = require('./src/routes/recommendationRoute');

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/handleFilters', handleFiltersRoute);
app.use('/recommendations', recommendationRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
