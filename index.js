const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const CronJob = require("cron").CronJob;
const nodemailer = require("nodemailer");


let il = "/ankara"
let ilce = "/cankaya"
let mahalle = "/isci-bloklari"

const url =
  "https://www.sahibinden.com/kiralik-daire"+il+ilce+mahalle;

const checkPrice = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.reload();
  let html = await page.evaluate(() => document.body.innerHTML);

  const priceArray = [];
  const titleArray = [];
  const linkArray = [];

  const result = {};

  const $ = cheerio.load(html);
  $("td[class=searchResultsPriceValue]").each((i, element) => {
    priceArray.push($(element).prop("innerText").trim().split("TL")[0] + " TL");
  });

  $(".classifiedTitle").each((i, element) => {
    titleArray.push($(element).prop("innerText").trim());
    linkArray.push("https://www.sahibinden.com/" + $(element).attr("href"))
  });

  for (let i = 0; i < priceArray.length; i++) {
    result[titleArray[i]] = priceArray[i];
  }

  console.log(result, titleArray.length);

  for (let i = 0; i < priceArray.length; i++) {
    if (parseFloat(priceArray[i]) < 2) {
      console.log("BUY!", titleArray[i], priceArray[i]);
      console.log(linkArray[i], "\n")
    }
  }
};

checkPrice();

//checks price every 15 seconds
// let job = new CronJob("*/15 * * * * *", () => {
//   checkPrice();
// });

// job.start();
