const express = require('express');
const http = require('http');
const circleciRouter = require('./controllers/circleci');
const axios = require('axios');
const moment = require('moment-timezone');
const { RTMClient, WebClient } = require('@slack/client');

// For local runs. Gives us access to the local .env file
if (!process.env.NODE_ENV) {
  require('dotenv').config();
}

// Server Initialization
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

// Slack initialization
const SLACK_TOKEN = process.env.SLACK_TOKEN;
const rtm = new RTMClient(SLACK_TOKEN);
const web = new WebClient(SLACK_TOKEN);
rtm.start(); // starts websocket


rtm.on('message', async (event) => {

  // console.log('> event:', event);
  // Skip bot's own message.
  if (event.subtype === 'bot_message') {
    return;
  }

  // Find all members.
  const slackUsers = await web.users.list();
  const slackUserList = slackUsers.members;
  // Find user of Message.
  const user = slackUserList.find((user) => user.id === event.user);
  if (!user) {
    return;
  }
  const userDisplayName = user.profile.display_name;

  // Someone joins the channel, welcome him/her.
  if (event.subtype === 'channel_join' && event.channel === process.env.CHANNEL_ID) {
    rtm.sendMessage(`Hello ${userDisplayName}, welcome to the Acceptance Test channel. I am Teolo and I'm watching you...`, process.env.CHANNEL_ID);
  }

  // Someone asks for most recent build status.
  // TODO: upgrade to regex
  if (event.text === 'Get latest build') {
    rtm.sendMessage(`Hold on. I am retrieving the latest build status...`, process.env.CHANNEL_ID);
    const url = `https://circleci.com/api/v1.1/project/github/AgoloMarx/system_test/tree/master?circle-token=${process.env.CIRCLECI_TOKEN}`;
    const response = await axios.get(url);
    const responseData = response.data[0];
    // Unwrap data
    const start_time = moment(responseData.start_time).tz('America/New_York').format('LLLL');
    console.log('> Response data:', responseData);
    const outcome = responseData.outcome ? responseData.outcome : 'In progress...';
    const build_num = responseData.build_num;
    const build_url = responseData.build_url;
    const last_commit = responseData.all_commit_details[0].committer_name;
    const last_commit_email = responseData.all_commit_details[0].author_email;
    const last_commit_url = responseData.all_commit_details[0].commit_url;

    const formattedText = `@${userDisplayName}. I have Successfully retrieved latest build status info: \n\n
    *Build outcome ${build_num}*: ${outcome}\n
    *Build start time (GMT -4)*: ${start_time}\n
    *Build Url*: ${build_url}\n
    *Last committed by*: @${last_commit} | ${last_commit_email}\n
    *Last commit url*: ${last_commit_url} \n
    `
    rtm.sendMessage(formattedText, process.env.CHANNEL_ID);
  }

  if (event.text === 'Run tests') {
    const formattedTextJson = {
      channel: process.env.CHANNEL_ID,
      text: `Ok @${userDisplayName} where do you want to run your tests?`,
      attachments: [
        {
          "text": "Choose the test environment",
          "fallback": "You are unable to run tests",
          "callback_id": "wopr_game",
          "color": "#3AA3E3",
          "attachment_type": "default",
          "actions": [
            {
              "name": "test",
              "text": "Staging",
              "type": "button",
              "value": "Staging"
            },
            {
              "name": "test",
              "text": "Production",
              "style": "danger",
              "type": "button",
              "value": "Production",
              "confirm": {
                "title": "Are you sure?",
                "text": "This may potentially affect the production site. www.agolo.com",
                "ok_text": "Yes",
                "dismiss_text": "No"
              }
            }
          ]
        }
      ]
    };
    web.chat.postMessage(formattedTextJson);
  }
});


// Single point of entry for Slack to hit.
app.post('/', async (req, res) => {
  try {
    console.log('> Request:', req);
    console.log('> Payload:', req.payload);
    // const url = `https://circleci.com/api/v1.1/project/github/AgoloMarx/system_test/tree/master?circle-token=${process.env.CIRCLECI_TOKEN}`;
    // const response = await axios.post(url, {
    //   build_parameters: {
    //     TEST_ENV: '',
    //   }
    // });
    // const payload = response.data;
    // const formattedText = `Rebuild successfully triggered at \`Staging Envrionment\`. \n\n
    // *Build Url*: ${payload.build_url} \n
    // *Build number*: ${payload.build_num} \n
    // `;
    // rtm.sendMessage(formattedText, process.env.CHANNEL_ID);
  } catch (error) {
    rtm.sendMessage(`I am having errors rebuilding. Here's the error message: \n\n ${error.message}`, process.env.CHANNEL_ID);
  }

});


// Initialize server
server.listen(port, async (error) => {
  if (error) {
    console.log(`Error initializing server: ${error}`);
    server.close();
  }
  console.log(`Server is ready on http://localhost:${port}`);
});

