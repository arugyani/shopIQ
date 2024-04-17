const puppeteer = require("puppeteer");
const scape_products = require("./scrape_products");
async function input_filters(browser, page, filtersJson, input, query) {
  concatenatedString = await concatValuesWithNumbers(input);
  if (concatenatedString.trim().length !== 0) {
    concatenatedString = query + " " + concatenatedString;
  }
  //await page.type('input[type="search"]', concatenatedString);
  const inputElement = await page.$(
    "#sh-h-input__root > input.sh-h-input__search-form"
  );
  if (concatenatedString !== null && concatenatedString !== query) {
    //console.log(concatenatedString);
    await inputElement.type(concatenatedString);
    await inputElement.press("Enter");
    await page.waitForNavigation({ waitUntil: "networkidle0" });
  }
  for (const [filterCategory, filterOptions] of Object.entries(input)) {
    //console.log("filter options");
    for (const filterOption of filterOptions) {
      let found = false;
      const filterHandles = await page.$$(".sh-dr__restricts > div");
      //console.log("filterHandles");
      for (const filterHandle of filterHandles) {
        const categoryText = await page.evaluate(
          //get the text content
          (el) => el.textContent,
          filterHandle
        );
        //console.log("filterHandle");
        if (categoryText.includes(filterCategory)) {
          //check if the correct filter list is being iterated through
          const optionSelector = `xpath/.//a[contains(., '${filterOption}')]`; //looks for the correct option
          try {
            await page.waitForSelector(optionSelector, {
              visible: true,
              timeout: 2000,
            });

            const optionHandles = await filterHandle.$$(optionSelector);
            //console.log("optionHandles");
            if (optionHandles.length > 0) {
              await optionHandles[0].click();
              found = true;
              //console.log("prenav");
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
  }
  const productsJSON = await scape_products.scrapeProductLinks(page, browser); //call the function to scrape product information
  return productsJSON;
  //return browser;
}

async function concatValuesWithNumbers(filters) {
  let concatenatedString = "";
  for (const key in filters) {
    if (filters.hasOwnProperty(key)) {
      const values = filters[key];
      for (const value of values) {
        if (typeof value === "string") {
          const numbersInValue = value.match(/\d+/g);
          if (numbersInValue) {
            concatenatedString += ` ${key}: ${value}`;
          }
        }
      }
    }
  }
  return concatenatedString;
}

module.exports = { input_filters };
