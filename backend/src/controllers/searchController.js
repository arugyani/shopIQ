const searchService = require("../services/searchService");
const asyncHandler = require("express-async-handler");


const getQuestions = asyncHandler(async (req, res) => {
  const { query } = req.params;
  console.log(query);

  const prompt = `Given the context of identifying a user's ${query} needs, particularly for beginners, create a simplified questionnaire. The goal is to make the process user-friendly while capturing essential preferences and requirements related to ${query} usage.
  Provide 4 multiple-choice options, each no longer than 5 words, to help the user make their purchasing decision. Indicate whether the user can select multiple answers for the question.
 
 Format the output in JSON as follows:
 [
 { 
     "question": "Your question here", 
     "questionInfo": "Informational blurb about the question and options, if needed", 
     "multipleAnswers": true, 
     "options": [ 
         { "label": "A", "text": "Option 1, max 5 words" }, 
         { "label": "B", "text": "Option 2, max 5 words" }, 
         { "label": "C", "text": "Option 3, max 5 words" }, 
         { "label": "D", "text": "Option 4, max 5 words" } 
     ] 
 }
 ...
 ]
 
 - Continue this JSON format for up 4-6 questions in total,
 - each question based on the user's previous response.
 - ensure that nothing is null
 - Keep the question on the general side
 - Set "multipleAnswers" to true or false for each question to indicate whether multiple answer selections are allowed. 
 - Include the "questionInfo" field with an informational blurb if the question and options require technical knowledge or information not widely known to the general public.
 - Ensure sure that the options have a max of 4 options
 - Ensure that only the JSON is being outputted
 - Dont include an other option
 - Make sure that the questions are generated in a way that gives you as much information as you can
 - Include a none option if necessary`;

  const llmResponse = await searchService.getLLMResponse(prompt);
  llmResponseJSON = JSON.parse(llmResponse);
  res.json(llmResponseJSON);
});


module.exports = {
  getQuestions,
};
