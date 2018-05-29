const express = require('express');
const http = require('http');
const circleciRouter = require('./controllers/circleci');
const axios = require('axios');
const moment = require('moment-timezone');

const app = express();
const port = process.env.PORT || 3000;
const TOKEN = '4ed2c8b78e37f8eafb76d1837a1985d0388c1eb1'; // TOOD: REMOVE THIS DANGEROUS!

// Create server and web socket
const server = http.createServer(app);

// Say Hello
app.get('/hello', (req, res) => {
  const userName = req.body.user_name;
  if (userName !== 'slackbot') {
    const payload = { text: `Hello ${userName}, Welcome to the Acceptance Test Slack Channel. I am Teolo, talk to me to run some tests.`}
    res.status(200).json(payload);
  } else {
    return res.status(200).end();
  }
});

// CircleCi build infos
app.get('/build-latest-status', async (req, res) => {
  try {
    const url = `https://circleci.com/api/v1.1/project/github/AgoloMarx/system_test/tree/master?circle-token=${TOKEN}`;
    const response = await axios.get(url);
    const responseData = response.data[0];
    const payload = {
      start_time: moment(responseData.start_time).tz('America/New_York').format('LLLL'),
      outcome: responseData.outcome,
      last_commit: responseData.all_commit_details[0].committer_name,
      last_commit_email: responseData.all_commit_details[0].author_email,
      last_commit_url: responseData.all_commit_details[0].commit_url,
    };
    res.status(200).send(payload);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


// Initialize server
server.listen(port, async(error) => {
  if (error) {
    console.log(`Error initializing server: ${error}`);
  }
  console.log(`Server is ready on http://localhost:${port}`);
});

