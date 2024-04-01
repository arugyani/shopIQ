const productQuestions = require("../dummy/product-questions.json");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getDummyLLMResponse = () => {
  return productQuestions.response;
};

const getLLMResponse = async (prompt) => {
  /*
    API key is stored in .env file.
    .env file can be found in discord/backend-notes
    env file should be placed in backend folder
  */
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;

}
module.exports = {
  getLLMResponse,
  getDummyLLMResponse
};
