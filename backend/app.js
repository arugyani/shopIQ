/**
 * Filename: app.js
 * Project: ShopIQ
 * Author: Divyam Khatri, Junseok Jang
 * Created: 02/27/2024
 * Description: Entry point for the Express application.
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("cross-fetch");
global.fetch = fetch;

const app = express();
const port = 3000;

const searchRouter = require("./src/routes/searchRoutes");
const recommendationRoute = require("./src/routes/recommendationRoute");
const searchService = require("./src/services/searchService");

const scrapeFilter = require("./src/services/scrape_filers");
const input_filters = require("./src/services/input_filters");
const generate_sample = require("./src/dummy/generate_dummy");

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/search", searchRouter);
app.use("/recommendations", recommendationRoute);

app.listen(port, () => {
  console.log(`shopIQ API listening on port ${port} 😎`);
});
