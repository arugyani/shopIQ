const productQuestions = require("../dummy/product-questions.json");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getDummyLLMResponse = () => {
  return productQuestions.response;
};


const getLLMResponse = async (prompt, inpModel) => {
  /*
    API key is stored in .env file.
    .env file can be found in discord/backend-notes
    env file should be placed in backend folder
  */
  const availableModels = await genAI.ListModels();
  console.log(availableModels); // Inspect the output to find suitable models
  console.log(genAI.ListModels());
  var model;
  if (inpModel == 1.5) {
    model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

  }
  else {
    model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

  }
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
};
module.exports = {
  getLLMResponse,
  getDummyLLMResponse,
};
