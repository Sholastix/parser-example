// const fs = require('fs');

const puppeteer = require('puppeteer');

const Article = require('../models/Article');

// Parsing the site.
const url = 'https://www.overclockers.ua/';

module.exports = async () => {
    try {
        const browser = await puppeteer.launch({ headless: true, devtools: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.setViewport({ width: 1920, height: 1080 });

        // await page.screenshot({ path: 'example.png', fullPage: true });

        const html = await page.evaluate(async () => {
            // Creating array as temporary storage for parsed data.
            const arr = [];

            // Creating container which contains all recent articles from site 'overclockers.ua'.
            const container = document.querySelectorAll('div.review');

            // VARIANT 1.
            container.forEach((item) => {
                const title = item.querySelector('.review > ul > li > a').innerText;
                const link = item.querySelector('.review > .review_image > a').href;
                const image = item.querySelector('.review > .review_image > a > img').src;

                arr.push({
                    title,
                    link,
                    image,
                });
            });

            // // VARIANT 2.
            // for (const item of container) {
            //     const title = await item.querySelector('.review > ul > li > a').innerText;
            //     const link = await item.querySelector('.review > .review_image > a').href;
            //     const image = await item.querySelector('.review > .review_image > a > img').src;

            //     arr.push({
            //         title,
            //         link,
            //         image,
            //     });
            // };

            return arr;
        });

        // Clicking on all articles links in 'html' array.
        for (let i = 0; i < html.length; i++) {
            await page.goto(html[i].link, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('div.article > p');
            console.log(i);

            // Retrieving text content from articles.
            const article = await page.evaluate(async () => {
                const articleText = document.querySelector('div.article > p').innerText;
                return articleText;
            });

            // In 'html' array for each index [i] creating new field 'text' and inserting in this field corresponding 'article' text.
            html[i]['text'] = article;
        };

        // console.log(html, html.length);
        await browser.close();

        // Retrieving all parsed data from 'html' array.
        for (const item of html) {
            const title = await item.title;
            const link = await item.link;
            const image = await item.image;
            const text = await item.text;

            // Writing that data in MySQL database.
            await Article.create({
                title: title,
                link: link,
                image: image,
                text: text,
            });
        };

        // // Writing all parsed data in file.
        // fs.writeFile('overclockers.json', JSON.stringify(html), (err) => {
        //     if (err) throw err;
        //     console.log('overclockers.json writed successfully!');
        // });
    } catch (err) {
        await browser.close();
        console.error(err);
    };
};