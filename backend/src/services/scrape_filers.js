const puppeteer = require("puppeteer");

async function scrapeFilter(search) {
  const browser = await puppeteer.launch({
    headless: true,
    devtools: true,
    args: ["--lang=en-US", '--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto("https://shopping.google.com/", {
    waitUntil: "networkidle2",
  });
  await page.type('input[type="search"]', search);
  await page.keyboard.press("Enter");
  await page.waitForNavigation({ waitUntil: "networkidle2" });

  const filterHandles = await page.$$(".sh-dr__restricts > div");
  const filters = {};

  for (const filterHandle of filterHandles) {
    try {
      const groupName = await page.evaluate(
        (el) => el.querySelector("div.ELcVZ > div").textContent,
        filterHandle
      );

      const filterOptions = await page.evaluate((el) => {
        const options = Array.from(
          el.querySelectorAll("div.RhVG3d > div > div > div > span")
        ).map(
          (option) =>
            option.querySelector("div > a > span.lg3aE > span").textContent
        );
        return options;
      }, filterHandle);
      filters[groupName] = filterOptions;
    } catch (error) {}
  }
  delete filters["Show only"];
  delete filters["Product rating"];
  filtersJson = JSON.stringify(filters, null, 2);
  console.log(filtersJson);
  return { browser, page, filtersJson };
}

module.exports = { scrapeFilter };
