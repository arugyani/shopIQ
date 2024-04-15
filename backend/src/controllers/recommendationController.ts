import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { v4 as uuid } from "uuid";
import { Question } from "../models/questions";
import { filtersPrompt, rankingPrompt } from "../prompts";
import { inputFilters, scrapeFilters } from "../services/scraper/scrapeService";
import { getLLMResponse } from "../services/llmService";
import { removeTicks } from "../utils";
import { jsonrepair } from "jsonrepair";
import { FilterType, Product } from "../models/scraper";

export const getProductList = async (
  req: Request,
  res: Response
): Promise<void> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const query = await req.body.query;
  const questionResponses: Question[] = await req.body.responses;
  const { browser, page, filtersJSON } = await scrapeFilters(query);

  const filtersSelectionPrompt = filtersPrompt({
    questionResponses,
    filtersJSON,
  });

  console.log("\n[LLM] Querying LLM for filter selections...");
  const llmResponse = await getLLMResponse(filtersSelectionPrompt);
  const processedResponse = removeTicks(llmResponse);

  // Parse LLM Response
  try {
    const repairedJSON = jsonrepair(processedResponse);
    const parsedJSON: FilterType = JSON.parse(repairedJSON);
    console.log("\n[LLM] Successfully received filter selections.");
    console.log(parsedJSON);

    if (!Object.values(parsedJSON).every((value) => Array.isArray(value)))
      throw new Error("Invalid filter selection response.");

    const products = await inputFilters({
      browser,
      page,
      input: parsedJSON,
      query,
    });

    const productsJSON: Product[] = JSON.parse(products);
    productsJSON.forEach((product) => {
      product.id = uuid();
    });

    const rankedProductPrompt = rankingPrompt(productsJSON);
    const rankedProducts = await getLLMResponse(rankedProductPrompt);
    const processedProductsResponse = removeTicks(rankedProducts);

    try {
      const repairedProductJSON = jsonrepair(processedProductsResponse);
      const rankedProductsJSON: Product[] = JSON.parse(repairedProductJSON);
      console.log("[LLM] Ranked products received...");

      rankedProductsJSON.forEach((product) => {
        const index = productsJSON.findIndex(
          (firstObj) => firstObj.id === product.id
        );

        if (index !== -1) {
          mergeProperties(product, productsJSON[index]);
        }
      });
      console.log(rankedProductsJSON);

      res.status(200).json(rankedProductsJSON);
    } catch (error) {
      console.error(`[ERROR] ${error}`);
      res.status(500).json({
        error,
      });
    }
  } catch (error) {
    console.error(`[LLM FILTER ERROR] ${error}`);
    console.log(llmResponse);
    res.status(500).json({
      error: "Received invalid LLM filter selection response.",
    });
  }
};

const mergeProperties = (obj1: Product, obj2: Product) => {
  obj1.prodLink = obj2.prodLink;
  obj1.imgLink = obj2.imgLink;
  obj1.price = obj2.price;
  obj1.reviews = obj2.reviews;
};
