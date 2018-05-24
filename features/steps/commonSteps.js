const { Given, When, Then } = require('cucumber');

const TESTING_PREPEND = '_system_test@cucumber.com';

Given('a registered Agolo user named {string}', function (userName) {
  this.userEmail = `${userName}${TESTING_PREPEND}`;
});

When('he logins', async function () {
  // Write code here that turns the phrase above into concrete actions
  await this.goLoginPage();
  this.login = true;
});
