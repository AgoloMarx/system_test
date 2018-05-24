const { Given, When, Then } = require('cucumber');

const TESTING_PREPEND = '_system_test@cucumber.com';

Given('a registered Agolo user named {string}', function (userName) {
  this.userEmail = `${userName}${TESTING_PREPEND}`;
});

// 10 seconds to login
// TODO: We are NOT running headless & we are using delays. Remove timeout to use default 5s when switching to headless.
When('he logins', {timeout: 10 * 1000}, async function () {
  // Write code here that turns the phrase above into concrete actions
  await this.loginUser();
  this.login = true;
});
