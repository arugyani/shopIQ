import puppeteer from "puppeteer";
import { FilterType, InputFiltersParams } from "../../models/scraper";

import scrapeFilters from "./scrapeFilters";
import inputFilters from "./inputFilters";
import { scrapeProduct, scrapeProductLinks } from "./scrapeProducts";

export { scrapeFilters, inputFilters, scrapeProduct, scrapeProductLinks };
