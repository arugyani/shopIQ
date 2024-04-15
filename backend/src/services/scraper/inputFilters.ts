import { InputFiltersParams, FilterType } from "../../models/scraper";
import { scrapeProductLinks } from "./scrapeService";

const inputFilters = async ({
  browser,
  page,
  input,
  query,
}: InputFiltersParams) => {
  const concatenatedString = `${query} ${concatValuesWithNumbers(input)}`;

  const inputElement = await page.$(
    "#sh-h-input__root > input.sh-h-input__search-form"
  );

  if (inputElement) {
    await inputElement.type(concatenatedString);
    await inputElement.press("Enter");
    await page.waitForNavigation({ waitUntil: "networkidle0" });

    for (const [filterCategory, filterOption] of Object.entries(input)) {
      let found = false;
      const filterHandles = await page.$$(".sh-dr__restricts > div");
      for (const filterHandle of filterHandles) {
        const categoryText = await page.evaluate(
          //get the text content
          (el) => el.textContent,
          filterHandle
        );

        if (categoryText && categoryText.includes(filterCategory)) {
          //check if the correct filter list is being iterated through
          const optionSelector = `xpath/.//a[contains(., '${filterOption}')]`; //looks for the correct option
          try {
            await page.waitForSelector(optionSelector, { timeout: 1800 });

            const optionHandles = await filterHandle.$$(optionSelector);

            if (optionHandles.length > 0) {
              await optionHandles[0].click();
              found = true;
              await page.waitForNavigation({ waitUntil: "networkidle0" });
              console.log(
                `The '${filterCategory}: ${filterOption}' was found.`
              );
              break; //since found break the loop and move on
            }
          } catch (error) {
            console.log(
              `The '${filterCategory}: ${filterOption}' was not found within the timeout period.`
            );
          }
        }
      }
      if (!found) {
        // Handle the case where the filter option is not found
        console.log(
          `Filter option '${filterCategory}: ${filterOption}' not found.`
        );
      }
    }

    const productsJSON = await scrapeProductLinks(page, browser); //call the function to scrape product information
    return productsJSON;
  } else {
    console.error(
      "[SCRAPER ERROR] Input Filters -- Input element was not found."
    );
    return "";
  }
};

function concatValuesWithNumbers(filters: FilterType) {
  //fumction for getting the number filters and concatenating them
  let concatenatedString = "";
  for (const key in filters) {
    if (filters.hasOwnProperty(key)) {
      const values = filters[key];

      values.forEach((value: any) => {
        if (typeof value === "string") {
          const numbersInValue = value.match(/\d+/g);
          if (numbersInValue) {
            concatenatedString += ` ${key}: ${value}`;
          }
        }
      });
    }
  }

  return concatenatedString;
}

export default inputFilters;
