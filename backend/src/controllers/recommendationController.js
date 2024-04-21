const searchService = require("../services/searchService");
const otherService = require("../services/otherService");
const asyncHandler = require("express-async-handler");
const scrapeFilter = require("../services/scrape_filers");
const input_filters = require("../services/input_filters");

const getProductList = asyncHandler(async (req, res) => {
  const questionResponses = await req.body;
  const { query } = await req.params;
  const { browser, page, filtersJson } = await scrapeFilter.scrapeFilter(query);

  const otherHandle = await otherService.getOtherLLMResponse(questionResponses);
  const invalidIDs = getInvalidIds(otherHandle);

  if(invalidIDs.length !== 0){
    return res.status(400).json({message: `Invalid other response at ids: ${invalidIDs}`});
  }


  const prompt1 = `TASK: "Your task is to analyze user input provided in JSON format, which includes a series of questions and their answers.
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
  "### questions and Answers ###"\n,
  ${JSON.stringify(questionResponses)},
  \n###FILTERS###\n${JSON.stringify(filtersJson)}
 `;
  let selectedFiltersJSON = null;
  for (let i = 0; i < 5; i++) {
    try {
      const selectedFilters = await searchService.getLLMResponse(prompt1);
      const selectedFiltersProcessed = preprocessJSON(selectedFilters);
      selectedFiltersJSON = JSON.parse(selectedFiltersProcessed);
      if (
        Object.values(selectedFiltersJSON).every((value) =>
          Array.isArray(value)
        )
      ) {
        console.log();
        break;
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  console.log(selectedFiltersJSON);
  const products = await input_filters.input_filters(
    browser,
    page,
    filtersJson,
    selectedFiltersJSON,
    query
  );
  let productsJSON = JSON.parse(products);
  for (let i = 0; i < productsJSON.length; i++) {
    const id = i.toString();
    productsJSON[i]["id"] = id;
  }

  console.log(productsJSON);
  let rankedProductsJSON;
  for (let i = 0; i < 5; i++) {
    try {
      const prompt2 = `### Prompt ###
      Given a list of products with their names, review keywords, product details, average review score, number of reviews, and price from Google Shopping, your task is to rank these products from best to worst based on the following criteria: overall review score (consider the number of reviews), price (considering value for money, lower is better), and the positivity of review keywords. 
      Output the ranked list in JSON format, including the product name, pros, cons, 3 key words about the product as "bullets". Give a max of 4 pros or cons and a min of 1. 
      For pros and cons consider categories and rank the product on that category out of 10. This should only be a string of a number with no other text or chars.
      Give a score out of ten to each product.
      Give only the top 4 ranking in descending order (highest given score being first).

      JSON
      {
        "ranked_products": [
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
      }
      
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
      const rankedProducts = await searchService.getLLMResponse(prompt2);
      const rankedProductsProcessed = preprocessJSON(rankedProducts);
      console.log("ranked products");
      console.log(rankedProducts);
      console.log(i);
      rankedProductsJSON = JSON.parse(rankedProductsProcessed);

      break;
    } catch (error) {
      console.log(error.message);
    }
  }

  const firstArray = rankedProductsJSON.ranked_products;

  productsJSON.forEach((secondObj) => {
    const index = rankedProductsJSON.ranked_products.findIndex(
      (firstObj) => firstObj.id === secondObj.id
    );
    if (index !== -1) {
      mergeProperties(rankedProductsJSON.ranked_products[index], secondObj);
    }
  });
  const ranked_products_merged = {
    ranked_products: rankedProductsJSON.ranked_products,
  };

  console.log(JSON.stringify(rankedProductsJSON.ranked_products, null, 2));

  //console.log(rankedProductsJSON);
  res.json(rankedProductsJSON.ranked_products);
});

const mergeProperties = (obj1, obj2) => {
  obj1.prodLink = obj2.prodLink;
  obj1.imgLink = obj2.imgLink;
  obj1.price = obj2.price;
  obj1.reviews = obj2.reviews;
};

const preprocessJSON = (jsonString) => {
  let lines = jsonString.split("\n");
  lines = lines.filter((line) => !line.includes("```"));
  let string_without_ticks = lines.join("\n");

  return string_without_ticks;
};

const getInvalidIds = (jsonArray) => {
  const invalidIds = [];
  
  jsonArray.forEach(obj => {
    if (obj.valid === false) {
      invalidIds.push(obj.id);
    }
  });
  
  return invalidIds;
};

module.exports = {
  getProductList,
};
