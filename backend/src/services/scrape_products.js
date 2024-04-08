const puppeteer = require("puppeteer");

const scrapeProductLinks = async (page, browser) => {
  const productHandles = await page.$$(".sh-pr__product-results > div");
  const productLinks = [];
  for (const productHandle of productHandles) {
    try {
      const productHref = await page.evaluate(
        (el) =>
          el.querySelector("div > div > div.sh-dgr__content > span > a").href,
        productHandle
      );
      productLinks.push(productHref);
    } catch (error) {
      console.error("Error retrieving product href:", error);
    }
  }
  //console.log(productLinks);

  productMotherLoad = [];

  if (productLinks.length > 10) {
    for (var i = 0; i < 10; i++) {
      const prod = await scrapeProduct(productLinks[i], browser);
      productMotherLoad.push(prod);
    }
  } else {
    for (var i = 0; i < productLinks.length; i++) {
      const prod = await scrapeProduct(productLinks[i], browser);
      productMotherLoad.push(prod);
    }
  }
  productsJSON = JSON.stringify(productMotherLoad, null, 2);
  await browser.close();
  return productsJSON;
};
const scrapeText = async (page, query) => {
  const output = await page.evaluate((query) => {
    const span = document.querySelector(query);
    return span ? span.textContent : null;
  }, query);
  return output;
};

const scrapeTextMap = async (page, query) => {
  const output = await page.$$eval(query, (spans) => {
    return spans.map((span) => span.textContent.trim());
  });
  return output;
};

const scrapeImageSrc = async (page) => {
  const imageUrl = await page.evaluate(() => {
    var imageElement = document.querySelector(".Xkiaqc.sm3F0e img");
    if (imageElement){
      return imageElement.src
    }
    else {
      imageElement = document.querySelector(".TiQ3Vc main-image");
    }
    return imageElement ? imageElement.src : null;
  });
  return imageUrl;
};

const scrapeProduct = async (link, browser) => {
  const page = await browser.newPage();
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
  const prodImgLink = await scrapeImageSrc(page, "Xkiaqc");

  const prodInfo = {
    title: productTitle,
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
module.exports = { scrapeProductLinks, scrapeProduct };
