const assert = require('assert');
const { Given, When, Then } = require('cucumber');

const TEST_FEED_NAME = ' - a cucumber test';
const TEST_KEYWORDS = 'Nicholas Cage'; // Gives us exactly 1 article

When('he creates {int} feeds in parallel', {timeout: 10 * 1000}, async function (numFeed) {
  this.createdFeeds = [ ];
  for (let i = 0; i < 1; i++) {
    await this.createFeed(`${TEST_FEED_NAME} ${i}`, TEST_KEYWORDS);
  }
});

Then('he should see at least {int} article in each feed in a minute', {timeout: 60 * 1000}, async function (numArticle) {
  await this.checkManyFeedsForArticle(this.createdFeeds, numArticle)
});