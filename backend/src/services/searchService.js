const productQuestions = require("../dummy/product-questions.json");

const getLLMResponse = (query) => {
  return productQuestions.response;
};

module.exports = {
  getLLMResponse,
};
