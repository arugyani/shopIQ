/**
 * Filename: app.js
 * Project: ShopIQ
 * Author: Divyam Khatri, Junseok Jang
 * Created: 02/27/2024
 * Description: Entry point for the Express application.
 */
//require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("cross-fetch");
global.fetch = fetch;

const app = express();
const port = process.env.PORT || 3000;

const searchRouter = require("./src/routes/searchRoutes");
const recommendationRoute = require("./src/routes/recommendationRoute");

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/search", searchRouter);
app.use("/recommendations", recommendationRoute);

app.listen(port, () => {
  console.log(`shopIQ API listening on port ${port} 😎`);
});
