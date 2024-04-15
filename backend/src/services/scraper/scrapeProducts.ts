import { Page, Browser } from "puppeteer";

const scrapeProductLinks = async (page: Page, browser: Browser) => {
  const productHandles = await page.$$(".sh-pr__product-results > div");
  const productLinks: string[] = [];
  for (const productHandle of productHandles) {
    try {
      const productHref: string | null = await page.evaluate((el) => {
        const div: HTMLAnchorElement | null = el.querySelector(
          "div > div > div.sh-dgr__content > span > a"
        );
        return div ? div.href : null;
      }, productHandle);

      if (productHref) {
        productLinks.push(productHref);
      }
    } catch (error) {
      console.error("Error retrieving product href:", error);
    }
  }
  //console.log(productLinks);

  let productMotherLoad = [];

  const scrapeLimit = Math.min(productLinks.length, 10);
  for (let i = 0; i < scrapeLimit; i++) {
    try {
      const prod = await scrapeProduct(productLinks[i], browser);
      productMotherLoad.push(prod);
    } catch (error) {
      console.error(`Error scraping product at ${productLinks[i]}:`, error);
    }
  }

  const productsJSON = JSON.stringify(productMotherLoad, null, 2);
  await browser.close();
  return productsJSON;
};

const scrapeText = async (page: Page, query: any) => {
  const output = await page.evaluate((query) => {
    const span = document.querySelector(query);
    return span ? span.textContent : null;
  }, query);
  return output;
};

const scrapeTextMap = async (page: Page, query: any) => {
  const output = await page.$$eval(query, (spans) => {
    return spans.map((span) => span.textContent.trim());
  });
  return output;
};

const scrapeImageSrc = async (page: Page) => {
  const imageUrl = await page.evaluate(() => {
    var imageElement: HTMLImageElement | null =
      document.querySelector(".Xkiaqc.sm3F0e img");
    if (imageElement) {
      return imageElement.src;
    } else {
      imageElement = document.querySelector(".TiQ3Vc main-image");
    }
    return imageElement ? imageElement.src : null;
  });
  return imageUrl;
};

const scrapeProduct = async (link: string, browser: Browser) => {
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(5000); // 2 seconds timeout
  await page.goto(link, {
    waitUntil: "networkidle2",
  });

  const productTitle = await scrapeText(page, ".sh-t__title");
  const prodBullets = await scrapeTextMap(page, ".KgL16d");
  const prodDesc = await scrapeText(page, ".sh-ds__full-txt");
  const prodReviews = await scrapeTextMap(page, ".qWf3pf > a > span");
  const prodPrice = await scrapeText(page, ".g9WBQb");
  const prodReviewScore = await scrapeText(page, ".uYNZm");
  const prodNumReviews = await scrapeText(page, ".qIEPib");
  const prodImgLink = await scrapeImageSrc(page);

  const prodInfo = {
    title: productTitle,
    prodLink: link,
    imgLink: prodImgLink,
    bullets: prodBullets,
    description: prodDesc,
    reviews: prodReviews,
    price: prodPrice,
    reviewScore: prodReviewScore,
    numReviews: prodNumReviews,
  };

  return prodInfo;
};

export { scrapeProductLinks, scrapeProduct };
