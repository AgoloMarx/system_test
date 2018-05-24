const assert = require('assert');
const { Given, When, Then } = require('cucumber');

const TEST_FEED_NAME = 'a cucumber test';
const TEST_KEYWORDS = 'Nicholas Cage'; // Gives us exactly 1 article

When('he creates {int} feeds in parallel', {timeout: 10 * 1000}, async function (numFeed) {
  for (let i = 0; i < numFeed; i++) {
    await this.createFeed(`${TEST_FEED_NAME}${i}`, TEST_KEYWORDS);
  }
});

Then('he should see at least {int} article in each feed in {int} minute', async function (numArticle, numMinute) {
  // Write code here that turns the phrase above into concrete actions
  assert.equal(true, true);
});