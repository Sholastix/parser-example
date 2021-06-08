require('dotenv').config()
const express = require('express');
// const fs = require('fs');
const puppeteer = require('puppeteer');

const createDatabase = require('./config/createDatabase');
const database = require('./config/initializeDatabase');

const Overs = require('./models/Overs');

const app = express();
app.use(express.json());

// Parsing the site.
const url = 'https://www.overclockers.ua/';

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: true, devtools: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.setViewport({ width: 1920, height: 1080 });

        // await page.screenshot({ path: 'example.png', fullPage: true });

        const html = await page.evaluate(async () => {
            const arr = [];

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

        for (let i = 0; i < html.length; i++) {
            await page.goto(html[i].link, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('div.article > p');
            console.log(i);

            const article = await page.evaluate(async () => {
                const articleText = document.querySelector('div.article > p').innerText;
                return articleText;
            });

            html[i]['text'] = article;
        };

        // console.log(html, html.length);

        await browser.close();

        for (const item of html) {
            const title = await item.title;
            const link = await item.link;
            const image = await item.image;
            const text = await item.text;

            await Overs.create({
                title: title,
                link: link,
                image: image,
                text: text,
            });
        };

        // // Writing all parsed data in file.
        // fs.writeFile('oversParser.json', JSON.stringify(html), (err) => {
        //     if (err) throw err;
        //     console.log('oversParser.json writed successfully!');
        // });
    } catch (err) {
        await browser.close();
        console.error(err);
    };
})();


// Synchronization with DB, if success -> server starts.
(async () => {
    try {
        await createDatabase();
        await database.sync();
        app.listen(process.env.APP_PORT, () => {
            console.log(`Server listening on port ${process.env.APP_PORT}.`);
        });
    } catch (err) {
        console.error(`Connection failed at port: ${process.env.APP_PORT}`, err);
    };
})();