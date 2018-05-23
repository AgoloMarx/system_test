// Dependencies
const { setWorldConstructor } = require('cucumber');

const World = function() {
};

setWorldConstructor(World);