// Dependencies
const { setWorldConstructor } = require('cucumber');
const loginSelectors = require('../features/selectors/static/login');
const createFeedSelectors = require('../features/selectors/feed/create');

// Selectors
const LOGIN_SELECTORS = require('../features/selectors/static/login');
const DASHBOARD_SELECTORS = require('../features/selectors/feed/dashboard');
const CREATE_SELECTORS = require('../features/selectors/feed/create');

// Paths
const URL = 'https://www.agolo.com/';
const LOGIN_PATH = 'login';


const World = function() {

  // Nav functions
  this.goToLogin = async function() {
    await this.page.goto(`${URL}${LOGIN_PATH}`);
    await this.page.waitForSelector(LOGIN_SELECTORS.LOGIN_FORM);
  }

  this.goToCreateFeed = async function() {
    await this.page.click(DASHBOARD_SELECTORS.CREATE_FEED_BUTTON);
    await this.page.waitForSelector(CREATE_SELECTORS.CREATE_FEED_FORM);
  }
  // Action functions
  this.loginUser = async function() {
    await this.goToLogin();
    await this.page.click(LOGIN_SELECTORS.LOGIN_EMAIL_FORM);
    await this.page.type(LOGIN_SELECTORS.LOGIN_EMAIL_FORM, this.currentUserEmail);
    await this.page.click(LOGIN_SELECTORS.LOGIN_PASSWORD_FORM);
    await this.page.type(LOGIN_SELECTORS.LOGIN_PASSWORD_FORM, this.currentUserPassword);
    await this.page.click(LOGIN_SELECTORS.LOGIN_BUTTON);
    await this.page.waitForSelector(DASHBOARD_SELECTORS.DASH_BOARD);
  }

  this.createFeed = async function(feedName, keywords) {
    await this.goToCreateFeed();
    await this.page.type(CREATE_SELECTORS.KEYWORD_FORM, keywords);
    await this.page.type(CREATE_SELECTORS.FEED_NAME_FORM, feedName);
    await this.page.keyboard.press('Enter');
    await this.page.click(CREATE_SELECTORS.CREATE_FEED_BUTTON);
//    page.hover('selector');

    await this.page.waitForSelector(DASHBOARD_SELECTORS.CREATE_FEED_BUTTON, {visible:true});
  }
}

setWorldConstructor(World);