const express = require("express");
const router = express.Router();

const recommendationController = require("../controllers/recommendationController");

router.post("/", recommendationController.getProductList);

module.exports = router;
