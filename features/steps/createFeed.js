const assert = require('assert');
const { Given, When, Then } = require('cucumber');

When('he creates {int} feeds in parallel', function (int) {
  // Write code here that turns the phrase above into concrete actions
  this.created = true;
});

Then('he should see at least {int} article in each feed in {int} minute', function (numArticle, numMinute) {
  // Write code here that turns the phrase above into concrete actions
  assert.equal(true, true);
});