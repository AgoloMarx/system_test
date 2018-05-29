const { BeforeAll, Before, AfterAll, After } = require('cucumber');
const api = require('./api');
const puppeteer = require('puppeteer');

// Refer to package.json, "test-prod" & "test-stage"
const PROD_ENV = 'production';
const STAGE_ENV = 'staging';

const PROD_URL = 'https://www.agolo.com/';
const STAGE_URL = 'https://stage.agolo.com/';
const LOCAL_URL = 'localhost:8080/';

Before({timeout: 60 * 1000 }, async function() {
  // const browser = await puppeteer.launch({ headless: false, slowMo: 25 });
  console.log('\n~~~~~~~~~~~ Starting Acceptance Test - Goodluck! ~~~~~~~~~~~');
  const browser = await puppeteer.launch({ args: ['--no-sandbox, --disable-setuid-sandbox'], headless: true, ignoreHTTPSErrors: true });
  const page = await browser.newPage();
  const environment = process.env.TEST_ENV ? process.env.TEST_ENV : 'local' ;
  if (environment === PROD_ENV) {
    this.url = PROD_URL;
  } else if (environment === STAGE_ENV) {
    this.url = STAGE_URL;
  } else {
    this.url = LOCAL_URL;
  }
  this.browser = browser;
  this.page = page;
  console.log(`> Environment: ${environment}`);
  console.log(`> URL: ${this.url}`);
})

After({timeout: 60 * 1000 }, async function() {
  console.log('\n\n~~~~~~~~~~~ Ending Acceptance Test ~~~~~~~~~~~');
  // Teardown browser
  if (this.browser) {
    console.log('> Closing browser...');
    await this.browser.close();
  }
  // Remove Created Feeds
  this.createdFeeds.forEach(function(createdFeedId) {
    // console.log('> Feed ID:', createdFeedId);
    // console.log('> APi:', api.deleteFeed);
  });
})
