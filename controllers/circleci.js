// Our Circleci router
const express = require('express');
const axios = require('axios');

const circleciRouter = express.Router();
const TOKEN = '4ed2c8b78e37f8eafb76d1837a1985d0388c1eb1'; // TOOD: REMOVE THIS DANGEROUS!

circleciRouter.post('/build-latest', async (req, res) => {
  try {
    const url = `https://circleci.com/api/v1.1/project/github/AgoloMarx/system_test/tree/master?circle-token=${TOKEN}`;
    const response = await axios.post(url);
    // const response = await axios.post(url, {
    //   build_parameters: {
    //     TEST_ENV: "staging",
    //   }
    // });
    console.log('> Your response:', response);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

circleciRouter.get('/build-latest-status', async (req, res) => {
  try {
    const url = `https://circleci.com/api/v1.1/project/github/AgoloMarx/system_test/tree/master?circle-token=${TOKEN}`;
    const response = await axios.get(url);
    console.log('> Your response:', response);
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = {
  circleciRouter,
}