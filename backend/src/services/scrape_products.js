const puppeteer = require("puppeteer")

const scrapeProductLinks = async (search) => {
    const browser = await puppeteer.launch({
        headless: true,
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


    const productHandles = await page.$$(".sh-pr__product-results > div")
    const productLinks = []
    for (const productHandle of productHandles) {
        try {
            const productHref = await page.evaluate(
                (el) => el.querySelector("div > div > div.sh-dgr__content > span > a").href,
                productHandle
            );
            productLinks.push(productHref);
        } catch (error) {
            console.error("Error retrieving product href:", error);
        }
    }

    await browser.close()

    productMotherLoad = {};

    for (var i = 0; i < 10; i++) {
        const prod = await scrapeProduct(productLinks[i])
        productMotherLoad[prod.title] = prod
    }

    console.log(JSON.stringify(productMotherLoad, null, 2));

}
const scrapeText = async (page, query) => {
    const output = await page.evaluate((query) => {
        const span = document.querySelector(query);
        return span ? span.textContent : null;
    }, query);
    return output;
}

const scrapeTextMap = async (page, query) => { 
    const output = await page.$$eval(query, spans => {
        return spans.map(span => span.textContent.trim());
    });
    return output
}

const scrapeImageSrc = async (page) => {
    const imageUrl = await page.evaluate(() => {
        const imageElement = document.querySelector('.Xkiaqc.sm3F0e img');
        return imageElement ? imageElement.src : null;
    });
    return imageUrl;
}

const scrapeProduct = async (link) => {
    const browser = await puppeteer.launch({
        headless: true,
        devtools: true,
        args: ["--lang=en-US"],
    });

    const page = await browser.newPage();
    await page.goto(link, {
        waitUntil: "networkidle2",
    });

    const productTitle = await scrapeText(page, '.sh-t__title');
    const prodBullets = await scrapeTextMap(page, '.KgL16d');
    const prodDesc = await scrapeText(page, '.sh-ds__full-txt');
    const prodReviews = await scrapeTextMap(page, '.qWf3pf > a > span');
    const prodPrice = await scrapeText(page, '.g9WBQb');
    const prodReviewScore = await scrapeText(page, '.uYNZm');
    const prodNumReviews = await scrapeText(page, '.qIEPib');
    const prodImgLink = await scrapeImageSrc(page, 'Xkiaqc')


    await browser.close()

    const prodInfo = {
        title: productTitle,
        bullets: prodBullets,
        description: prodDesc,
        reviews: prodReviews,
        price: prodPrice,
        reviewScore: prodReviewScore,
        numReviews: prodNumReviews,
        imgLink: prodImgLink
    };

    return prodInfo


}
module.exports = { scrapeProductLinks, scrapeProduct };