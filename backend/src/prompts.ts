import { Question } from "./models/questions";
import { Product } from "./models/scraper";

export interface QuestionsPromptParams {
  query: string;
}

export const questionsPrompt = ({
  query,
}: QuestionsPromptParams) => `Given the context of identifying a user's ${query} needs, particularly for beginners, create a simplified questionnaire. The goal is to make the process user-friendly while capturing essential preferences and requirements related to ${query} usage.
  Provide 4 multiple-choice options, each no longer than 5 words, to help the user make their purchasing decision. Indicate whether the user can select multiple answers for the question.
 Make a boolean selected which is set to false. Add QuestionInfo that is an informational blurb about the specifics of the question and answers
 
 Format the output in JSON as follows:
 Do not put a comma following the last element of an array or group. Only put commas if an element is not the last of its kind.

 [
 {   
    "question": "Your question here", 
    "questionInfo": "Informational blurb about the question and options, if needed", 
    "multipleAnswers": true, 
    "answers": [ 
      { "text": "max 5 words" }, 
      { "text": "max 5 words" }, 
      { "text": "max 5 words" }, 
      { "text": "max 5 words" }
    ]
 },
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
 - Ensure that only the JSON is being output. The JSON should be able to be parsed without any preprocessing
 - Dont include an other option
 - Make sure that the questions are generated in a way that gives you as much information as you can
 - Include a none option if necessary`;

export interface FiltersPromptParams {
  questionResponses: Question[];
  filtersJSON: any;
}

export const filtersPrompt = ({
  questionResponses,
  filtersJSON,
}: FiltersPromptParams) => `TASK: "Your task is to analyze user input provided in JSON format, which includes a series of questions and their answers.
  Based on this information, you will generalize and make selections for product filters that best match the user's criteria.
  If none of the given options are selected, the selected answer is in the other. Always check the “other:” in the answers and if its not blank consider that to be the answer to the question asked.
   If all of the filters should be selected just leave it blank. Focus on interpreting the nuances in the user's responses to select the most appropriate filters. Necessity is not required focus on the responses.
  If a filter is not relevant to the question, leave it blank. Only select a filter if it is relevant to the question and answer. Don't select irrelevant filters! Only select a filter if there is a valid reason to select it given the question and answers.
   Dont assume things that are not in the question and answers. Only select an option that is on the JSON. Make sure that at least three filters are selected but make sure that they are relevant. Select more if needed. Your output will also be structured in JSON, detailing the selected filters that align with the user's preferences.
    Output should be formatted the exact same as the filters just only with the selected filters in a JSON format the key should be the same as the filter and the value should be the selected filter. The value should be the exact same string as the filters JSON. Only output the JSON without the blanks make sure the JSON removed the filters that are blank.
    Output format:
    {
      'Filter Category': ['Selected value'],
      'Filter Category': ['Selected value'],
      ...
    }
  
    ### QUESTIONS AND ANSWERS ###
    ${JSON.stringify(questionResponses)}

    ### FILTERS ###
    ${JSON.stringify(filtersJSON)}
 `;

export const rankingPrompt = (productsJSON: Product[]) => `### Prompt ###
      Given a list of products with their names, review keywords, product details, average review score, number of reviews, and price from Google Shopping, your task is to rank these products from best to worst based on the following criteria: overall review score (consider the number of reviews), price (considering value for money, lower is better), and the positivity of review keywords. 
      Output the ranked list in JSON format, including the product name, pros, cons, 3 key words about the product as "bullets". Give a max of 4 pros or cons and a min of 1. 
      For pros and cons consider categories and rank the product on that category out of 10. This should only be a string of a number with no other text or chars.
      Give a score out of ten to each product.
      Give only the top 4 ranking in descending order (highest given score being first).

      JSON
        [
          {
            "id" : "id (id of the product in the products list)"
            "title": "Product Name (name of product in the given JSON)",
            "bullets": ["Key word 1", "Key word 2"],
            "given_score": "score",
            "pros": {"category": "number",
                    "category": "number"}
            "cons": {"category": "number",
                    "category": "number"}
          },
          ...
        ]
      
      ### Instruction ###
      Format the ranked list of products in JSON format as follows:Ensure your response adheres to this format, listing products from best to worst as per the criteria outlined. 
      This instruction is specific, leveraging direct command to format the output in JSON, and clearly defines the evaluation criteria, focusing on what to do to achieve the desired outcome. 
      Produce the output in JSON format, containing the product name, average review score, number of reviews price, given score, and key review insights for each product, without any additional text or explanation. 
      Analyze the input in a mostly qualitative manner. 
      Do not solely base the ranking and score based off of a python script.
      The pros and cons should be a category then a ranking.
      Give no more than 3 bullets.
      All values should be strings.
      All keys should have corresponding non-null values.
      Follow the output format JSON exactly. Do not leave any trailing commas at the end of and values in each key.
      When there is a quote in the JSON value add a backslash so the JSON is parseable. \n
      
      Product JSON:\n ${JSON.stringify(productsJSON)}`;
