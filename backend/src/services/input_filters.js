const puppeteer = require("puppeteer");
const scape_products = require("./scrape_products");
async function input_filters(browser, page, filtersJson, input, query) {
  for (const [filterCategory, filterOption] of Object.entries(input)) {
    let found = false;
    const filterHandles = await page.$$(".sh-dr__restricts > div");
    for (const filterHandle of filterHandles) {
      const categoryText = await page.evaluate(
        //get the text content
        (el) => el.textContent,
        filterHandle
      );
      if (categoryText.includes(filterCategory)) {
        //check if the correct filter list is being iterated through
        const optionSelector = `xpath/.//a[contains(., '${filterOption}')]`; //looks for the correct option
        try {
          await page.waitForSelector(optionSelector, { timeout: 3000 });

          const optionHandles = await filterHandle.$$(optionSelector);

          if (optionHandles.length > 0) {
            await optionHandles[0].click();
            found = true;
            await page.waitForNavigation({ waitUntil: "networkidle0" });
            console.log(`The '${filterCategory}: ${filterOption}' was found.`);
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
  const productsJSON = await scape_products.scrapeProductLinks(page, browser); //call the function to scrape product information
  console.log(productsJSON);
  return productsJSON;
  //return browser;
}

module.exports = { input_filters };
