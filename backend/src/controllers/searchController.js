const searchService = require("../services/searchService");
const asyncHandler = require("express-async-handler");
const scrapeFilter = require("../services/scrape_filers");
const input_filters = require("../services/input_filters");
const getQuestions = asyncHandler(async (req, res) => {
  const { query } = req.params;
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
         {"text": "Option 1, max 5 words",  "selected": false}, 
         {"text": "Option 1, max 5 words",  "selected": false}, 
         {"text": "Option 1, max 5 words",  "selected": false}, 
         {"text": "Option 1, max 5 words",  "selected": false}
     ]
 }
 ...
 ]
 
 - Continue this JSON format for up 4-6 questions in total,
 - each question based on the user's previous response.
 - ensure that question info is not null
 - Keep the question on the general side
 - Set "multipleAnswers" to true or false for each question to indicate whether multiple answer selections are allowed. 
 - Include the "questionInfo" field with an informational blurb if the question and options require technical knowledge or information not widely known to the general public.
 - Ensure sure that the options have a max of 4 options
 - Ensure that only the JSON is being outputted. The JSON should be able to be parsed without any preprocessing
 - Dont include an other option
 - Make sure that the questions are generated in a way that gives you as much information as you can
 - Include a none option if necessary`;

  const llmResponse = await searchService.getLLMResponse(prompt);
  const processedllmResponse = removeticks(llmResponse);
  let llmResponseJSON = JSON.parse(processedllmResponse);
  for (let i = 0; i < llmResponseJSON.length; i++) {
    const id = i.toString();
    const newObj = { id, ...llmResponseJSON[i] };
    delete newObj["id"];
    llmResponseJSON[i] = { id, ...newObj };
    llmResponseJSON[i]["other"] = "";
  }
  const emojiChar = await getEmoji(query);
  resObj = {emoji: emojiChar, qs: llmResponseJSON}
  console.log(resObj);
  res.json(resObj);
});

const removeticks = (inputString) => {
  let lines = inputString.split("\n");
  lines = lines.filter((line) => !line.includes("```"));
  let modifiedString = lines.join("\n");

  return modifiedString;
};

const getEmoji = async (query) => {
  const prompt = `Please provide the HTML decimal code for an emoji that best represents the concept '${query}'. Format the response as &#(decimalcode); with only the ampersand, hash, and semicolon included, and no additional text or explanation.`
  console.log(prompt);
  return await searchService.getLLMResponse(prompt);
}

module.exports = {
  getQuestions,
};
