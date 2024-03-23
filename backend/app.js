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

const { scrapeProductLinks, scrapeProduct } = require('./src/services/scrape_products');

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

scrapeProductLinks("tv")
// scrapeProduct("https://www.google.com/shopping/product/12870805098227573802?hl=en-US&psb=1&q=tv&oq=tv&gs_lp=Egtwcm9kdWN0cy1jYyICdHZIAFAAWABwAHgAkAEAmAEAoAEAqgEAuAEDyAEAmAIAoAIAmAMAkgcAoAcA&sclient=products-cc&prds=eto:15914214088846665757_0,pid:8470684023529092748,rsk:PC_2336790187625922960&sa=X&ved=0ahUKEwiC5sDw5YmFAxWSLtAFHczSCXAQ8wIIzRk")