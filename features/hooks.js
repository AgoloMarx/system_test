const { BeforeAll, Before, AfterAll, After } = require('cucumber');
const puppeteer = require('puppeteer');

Before(async function() {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
})

After(async function() {
  // Teardown browser
  if (this.browser) {
    await this.browser.close();
  }
  // Cleanup DB
})