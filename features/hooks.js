const { BeforeAll, AfterAll } = require('cucumber');
const puppeteer = require('puppeteer');

BeforeAll(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 500,
  })
  this.browser = browser;
});

AfterAll(async () => {
  await this.browser.close();
})