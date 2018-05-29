const { BeforeAll, Before, AfterAll, After } = require('cucumber');
const api = require('./api');
const puppeteer = require('puppeteer');

// Refer to package.json, "test-prod" & "test-stage"
const PROD_ENV = 'production';
const STAGE_ENV = 'staging';

const PROD_URL = 'https://www.agolo.com/';
const STAGE_URL = 'https://stage.agolo.com/';

Before({timeout: 60 * 1000 }, async function() {
  // const browser = await puppeteer.launch({ headless: false, slowMo: 25 });
  const browser = await puppeteer.launch({ args: ['--no-sandbox, --disable-setuid-sandbox'], headless: true, ignoreHTTPSErrors: true });
  const page = await browser.newPage();
  const environment = process.env.TEST_ENV;
  if (environment === PROD_ENV) {
    this.url = PROD_URL;
  } else if (environment === STAGE_ENV) {
    this.url = STAGE_URL;
  }
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
