const searchService = require("../services/searchService");

const getLLMResponse = (req, res) => {
  const llmResponse = searchService.getDummyLLMResponse();
  res.json(llmResponse);
};

module.exports = {
  getLLMResponse,
};
