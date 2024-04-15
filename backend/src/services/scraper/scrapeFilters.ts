import puppeteer from "puppeteer";

const scrapeFilters = async (search: string) => {
  console.log(`\n[SCRAPER] Running scraper on search "${search}"`);
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    args: ["--lang=en-US"],
  });

  const page = await browser.newPage();
  await page.goto("https://shopping.google.com/", {
    waitUntil: "networkidle2",
  });

  await page.type('input[type="search"]', search);
  await page.keyboard.press("Enter");
  await page.waitForNavigation({ waitUntil: "networkidle2" });

  const filterHandles = await page.$$(".sh-dr__restricts > div");
  const filters: { [key: string]: any } = {};

  for (const filterHandle of filterHandles) {
    try {
      const groupName = await page.evaluate((el) => {
        const div = el.querySelector("div.ELcVZ > div");
        return div ? div.textContent : null;
      }, filterHandle);

      const filterOptions = await page.evaluate((el) => {
        const options = Array.from(
          el.querySelectorAll("div.RhVG3d > div > div > div > span")
        ).map(
          (option) =>
            option.querySelector("div > a > span.lg3aE > span")?.textContent
        );
        return options;
      }, filterHandle);

      filters[groupName || ""] = filterOptions;
    } catch (error) {
      console.error(`[SCRAPER] [ERROR] ${error}`);
    }
  }

  delete filters["Show only"];
  delete filters["Product rating"];

  const filtersJSON = JSON.stringify(filters, null, 2);
  console.log(filtersJSON);

  return { browser, page, filtersJSON };
};

export default scrapeFilters;
