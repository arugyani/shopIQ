const recommendationService = require("../services/recommendationService");

const getProductList = (req, res) => {
  const productList = recommendationService.scrapeProductList();
  res.json(productList);
};

module.exports = {
  getProductList,
};
