
const { BeforeAll, AfterAll } = require('cucumber');
const puppeteer = require('puppeteer');

// BeforeAll and AfterAll are run after ALL scenarios. Not each.
BeforeAll(async () => {
  // Set up Puppeteer
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 500,
  })
  this.browser = browser;
});

AfterAll(async () => {
  // Teardown browser
  await this.browser.close();
})

