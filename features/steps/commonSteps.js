const { Given, When, Then } = require('cucumber');

const TEST_USER_EMAIL_PREPEND = '_system_test@cucumber.com';
const TEST_USER_PASSWORD = 'cucumber';

Given('a registered Agolo user named {string}', function (userName) {
  this.currentUserEmail = `${userName}${TEST_USER_EMAIL_PREPEND}`;
  this.currentUserPassword = TEST_USER_PASSWORD;
});

// 10 seconds to login
// TODO: We are NOT running headless & we are using delays. Remove timeout to use default 5s when switching to headless.
When('he logins', {timeout: 10 * 1000}, async function () {
  await this.loginUser();
});
