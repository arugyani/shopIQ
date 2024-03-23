const puppeteer = require("puppeteer")

const scrapeProductLinks = async (search) => {
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

const scrapeProduct = async (link) => {
    const browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        args: ["--lang=en-US"],
    });

    const page = await browser.newPage();
    await page.goto(link, {
        waitUntil: "networkidle2",
    });

    const productTitle = await page.evaluate(() => {
        const span = document.querySelector('.sh-t__title');
        return span ? span.textContent : null;
    });

    const prodBullets = await page.$$eval('.KgL16d', spans => {
        return spans.map(span => span.textContent.trim());
    });

    const prodDesc = await page.evaluate(() => {
        const span = document.querySelector('.sh-ds__full-txt');
        return span ? span.textContent : null;
    });

    const prodReviews = await page.$$eval('.qWf3pf > a > span', spans => {
        return spans.map(span => span.textContent.trim());
    });

    const prodPrice = await page.evaluate(() => {
        const span = document.querySelector('.g9WBQb');
        return span ? span.textContent : null;
    });

    const prodReviewScore = await page.evaluate(() => {
        const span = document.querySelector('.uYNZm');
        return span ? span.textContent : null;
    });

    const prodNumReviews = await page.evaluate(() => {
        const span = document.querySelector('.qIEPib');
        return span ? span.textContent : null;
    });

    await browser.close()

    const prodInfo = {
        title: productTitle,
        bullets: prodBullets,
        description: prodDesc,
        reviews: prodReviews,
        price: prodPrice,
        reviewScore: prodReviewScore,
        numReviews: prodNumReviews,
    };

    return prodInfo
}
module.exports = { scrapeProductLinks, scrapeProduct };