const { BeforeAll, Before, AfterAll, After } = require('cucumber');
const api = require('./api');
const puppeteer = require('puppeteer');

Before({timeout: 60 * 1000 }, async function() {
  // const browser = await puppeteer.launch({ headless: false, slowMo: 25 });
  const browser = await puppeteer.launch({ args: ['--no-sandbox, --disable-setuid-sandbox'], headless: true, ignoreHTTPSErrors: true });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
})

After({timeout: 60 * 1000 }, async function() {
  // Teardown browser
  if (this.browser) {
    await this.browser.close();
  }
  // Remove Created Feeds
  this.createdFeeds.forEach(function(createdFeedId) {
    // console.log('> Feed ID:', createdFeedId);
    // console.log('> APi:', api.deleteFeed);
  });
})
