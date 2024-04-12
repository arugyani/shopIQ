const express = require("express");
const router = express.Router();

const searchController = require("../controllers/searchController");

router.route("/:query").get(searchController.getQuestions);

module.exports = router;
