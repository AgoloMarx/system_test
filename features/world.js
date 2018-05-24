// Dependencies
const { setWorldConstructor } = require('cucumber');
const loginSelectors = require('../features/selectors/static/login');
const createFeedSelectors = require('../features/selectors/feed/create');

const URL = 'https://www.agolo.com/';
const LOGIN_PATH = 'login';

const World = function() {
  this.goLoginPage = async function() {
    await this.page.goto(`${URL}${LOGIN_PATH}`);
    await this.page.waitForSelector('div form');
  }
}

setWorldConstructor(World);