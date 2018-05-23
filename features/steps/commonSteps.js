const { Given, When, Then } = require('cucumber');

Given('a valid user', function () {
  // Write code here that turns the phrase above into concrete actions
  this.user = 'marx.low@agolo.com';
});

Given('he logins', function () {
  // Write code here that turns the phrase above into concrete actions
  this.login = true;
});
