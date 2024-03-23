const productQuestions = require("../dummy/product-questions.json");

const getLLMResponse = () => {
  return productQuestions.response;
};

module.exports = {
  getLLMResponse,
};
