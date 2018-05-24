// Dependencies
const { setWorldConstructor } = require('cucumber');
const loginSelectors = require('../features/selectors/static/login');
const createFeedSelectors = require('../features/selectors/feed/create');

// Selectors
const LOGIN_SELECTORS = require('../features/selectors/static/login');

// Paths
const URL = 'https://www.agolo.com/';
const LOGIN_PATH = 'login';

// Others
const TEST_USER_PASSWORD = 'cucumber';

const World = function() {

  this.goToLogin = async function() {
    await this.page.goto(`${URL}${LOGIN_PATH}`);
    await this.page.waitForSelector(LOGIN_SELECTORS.LOGIN_FORM);
  }

  this.loginUser = async function() {
    await this.goToLogin();
    await this.page.click(LOGIN_SELECTORS.LOGIN_EMAIL_FORM);
    await this.page.type(LOGIN_SELECTORS.LOGIN_EMAIL_FORM, this.userEmail);
    await this.page.click(LOGIN_SELECTORS.LOGIN_PASSWORD_FORM);
    await this.page.type(LOGIN_SELECTORS.LOGIN_PASSWORD_FORM, TEST_USER_PASSWORD);
    await this.page.click(LOGIN_SELECTORS.LOGIN_BUTTON);
  }
}

setWorldConstructor(World);