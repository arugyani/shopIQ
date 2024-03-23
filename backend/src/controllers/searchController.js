const searchService = require("../services/searchService");

const getLLMResponse = (req, res) => {
  const llmResponse = searchService.getLLMResponse();
  res.json(llmResponse);
};

module.exports = {
  getLLMResponse,
};
