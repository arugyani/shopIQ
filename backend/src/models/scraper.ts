import { Browser, Page } from "puppeteer";

export interface InputFiltersParams {
  browser: Browser;
  page: Page;
  input: FilterType;
  query: string;
}

export type FilterType = {
  [category: string]: any;
};

export interface Product {
  id: string;
  title: string | null;
  prodLink: string | null;
  imgLink: string | null;
  bullets: string[];
  description: string | null;
  reviews: string[];
  price: string;
  reviewScore: string;
  numReviews: string;
}
