const recommendationService = require("../services/recommendationService");
const searchService = require("../services/searchService");
const asyncHandler = require("express-async-handler");
const scrapeFilter = require("../services/scrape_filers");
const input_filters = require("../services/input_filters");

const getProductList = asyncHandler(async (req, res) => {
  const questionResponses = req.body;
  const { query } = req.params;
  const { browser, page, filtersJson } = await scrapeFilter.scrapeFilter(query);

  const prompt1 = `TASK: "Your task is to analyze user input provided in JSON format, which includes a series of questions and their answers.
  Based on this information, you will generalize and make selections for product filters that best match the user's criteria.
  If none of the given options are selected, the selected answer is in the other. Always check the “other:” in the answers and if its not blank consider that to be the answer to the question asked.
   If all of the filters should be selected just leave it blank. Focus on interpreting the nuances in the user's responses to select the most appropriate filters. Necessity is not required focus on the responses.
  If a filter is not relevant to the question, leave it blank. Only select a filter if it is relevant to the question and answer. Don't select irrelevant filters! Only select a filter if there is a valid reason to select it given the question and answers.
   Dont assume things that are not in the question and answers. Only select an option that is on the JSON. Make sure that at least three filters are selected but make sure that they are relevant. Select more if needed. Your output will also be structured in JSON, detailing the selected filters that align with the user's preferences.
    Output should be formatted the exact same as the filters just only with the selected filters in a JSON format the key should be the same as the filter and the value should be the selected filter. The value should be the exact same string as the filters JSON. Only output the JSON without the blanks make sure the JSON removed the filters that are blank.",
  "### questions and Answers ###"\n,
  ${JSON.stringify(questionResponses)},
  \n###FILTERS###\n${JSON.stringify(filtersJson)}
  ;
 `;

  const selectedFilters = await searchService.getLLMResponse(prompt1);
  const selectedFiltersJSON = JSON.parse(selectedFilters);
  
  console.log(selectedFiltersJSON);
  const productsJSON = await input_filters.input_filters(
    browser,
    page,
    filtersJson,
    selectedFiltersJSON,
    query
  );


  console.log(productsJSON);

  const prompt2 = `### Prompt ###
  Given a list of products with their names, review keywords, product details, average review score, number of reviews, and price from Google Shopping, your task is to rank these products from best to worst based on the following criteria: overall review score (consider the number of reviews), price (considering value for money, lower is better), and the positivity of review keywords. 
  Output the ranked list in JSON format, including the product name, average review score, number of reviews, price, pros, cons, key review insights as "bullets", and image link for each product. Give a max of 2 pros or cons.
  Give a score out of ten to each product. 
  Give only the top 4 ranking in descending order (highest given score being first).

  JSON
  {
    "ranked_products": [
      {
        "title": "Product Name",
        "Image_link": “Image Link”
        "average_review_score": "Average Review Score",
        "numReviews": "number_of_reviews",
        "price": "Price",
        "bullets": ["Insight 1", "Insight 2"],
        "given_score": "score",
        "pros": "pros"
        "cons": "cons"
      },
      ...
    ]
  }
  
  ### Instruction ###
  Format the ranked list of products in JSON format as follows:Ensure your response adheres to this format, listing products from best to worst as per the criteria outlined. 
  This instruction is specific, leveraging direct command to format the output in JSON, and clearly defines the evaluation criteria, focusing on what to do to achieve the desired outcome. 
  Produce the output in JSON format, containing the product name, average review score, number of reviews price, given score, and key review insights for each product, without any additional text or explanation. 
  Analyze the input in a mostly qualitative manner. Do not solely base the ranking and score based off of a python script.
  When there is a quote in the JSON value add a backslash so the JSON is parseable \n
  
  Product JSON:\n ${productsJSON}`;

  const rankedProducts = await searchService.getLLMResponse(prompt2);
  console.log("ranked products");
  console.log(rankedProducts);
  const rankedProductsJSON = JSON.parse(rankedProducts);

  res.json(rankedProductsJSON);
});

module.exports = {
  getProductList,
};
