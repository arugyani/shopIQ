const searchService = require("../services/searchService");
const asyncHandler = require("express-async-handler");
const scrapeFilter = require("../services/scrape_filers");
const input_filters = require("../services/input_filters");
const getQuestions = asyncHandler(async (req, res) => {
  try {
  const { query } = await req.params;
  console.log(query);

  const prompt = `Given the context of identifying a user's ${query} needs, particularly for beginners, create a simplified questionnaire. The goal is to make the process user-friendly while capturing essential preferences and requirements related to ${query} usage.
  Provide 4 multiple-choice options, each no longer than 5 words, to help the user make their purchasing decision. Indicate whether the user can select multiple answers for the question.
 Make a boolean selected which is set to false. Add QuestionInfo that is an informational blurb about the specifics of the question and answers
 Format the output in JSON as follows:
 [
 {   "question": "Your question here", 
     "questionInfo": "Informational blurb about the question and options, if needed", 
     "multipleAnswers": true, 
     "answers": [ 
         {"text": "Option 1, max 5 words"}, 
         {"text": "Option 1, max 5 words"}, 
         {"text": "Option 1, max 5 words"}, 
         {"text": "Option 1, max 5 words"}
     ]
 }
 ...
 ]
 
 - Continue this JSON format for up 4-6 questions in total,
 - each question based on the user's previous response.
 - Add quesionInfo if there is any chance that someone may be confused with the quesion or answer choice. Explain the specific answer choices as well as the quesion if necessary.
 - Include the "questionInfo" field with an informational blurb if the question and options require technical knowledge or information not widely known to the general public.
 - ensure that question info is not null
 - Keep the question on the general side
 - Set "multipleAnswers" to true or false for each question to indicate whether multiple answer selections are allowed. 
 - Ensure sure that the options have a max of 4 options
 - Ensure that only the JSON is being outputted. The JSON should be able to be parsed without any preprocessing
 - Dont include an other option
 - Make sure that the questions are generated in a way that gives you as much information as you can
 - Include a none option if necessary`;
  let attempts = 0;
  let llmResponseJSON = null;

  while (attempts < 20) {
    try {
      const llmResponse = await searchService.getLLMResponse(prompt);
      const processedllmResponse = removeticks(llmResponse);
      llmResponseJSON = JSON.parse(processedllmResponse);
      console.log("success");
      break;
    } catch (error) {
      console.error("Error: ", error);
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 500)); // 500 milliseconds delay
      console.log("trying again");
    }
  }

  if (attempts === 20) {
    console.error("Failed after 10 attempts.");
  }

  for (let i = 0; i < llmResponseJSON.length; i++) {
    const id = i.toString();
    const newObj = { id, ...llmResponseJSON[i] };
    delete newObj["id"];
    llmResponseJSON[i] = { id, ...newObj };
    llmResponseJSON[i]["other"] = "";
  }
  addSelectedField(llmResponseJSON);
  res.json(llmResponseJSON);
} catch (e) {
  return { statusCode: 500, error: e.message };
}
});

const removeticks = (inputString) => {
  let lines = inputString.split("\n");
  lines = lines.filter((line) => !line.includes("```"));
  let modifiedString = lines.join("\n");

  return modifiedString;
};

function addSelectedField(jsonData) {
  for (const question of jsonData) {
    for (const answer of question.answers) {
      answer.selected = false;
    }
  }
}

module.exports = {
  getQuestions,
};
