/**
 * Filename: app.js
 * Project: ShopIQ
 * Author: Divyam Khatri, Junseok Jang
 * Created: 02/27/2024
 * Description: Entry point for the Express application.
 */
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

const searchRouter = require("./src/routes/searchRoutes");
const recommendationRoute = require("./src/routes/recommendationRoute");
const productScraper = require("./src/services/scrape_products");

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/search", searchRouter);
app.use("/recommendations", recommendationRoute);

app.listen(port, () => {
  console.log(`shopIQ API listening on port ${port} 😎`);
});

// productScraper.scrapeProductLinks("tv");
