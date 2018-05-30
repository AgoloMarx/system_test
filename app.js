const express = require('express');
const http = require('http');
const circleciRouter = require('./controllers/circleci');
const axios = require('axios');
const moment = require('moment-timezone');
const { RTMClient, WebClient } = require('@slack/client');
const bodyParser = require('body-parser');

// For local runs. Gives us access to the local .env file
if (!process.env.NODE_ENV) {
  require('dotenv').config();
}

// Server Initialization
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT || 3000;
const server = http.createServer(app);

// Slack initialization
const SLACK_TOKEN = process.env.SLACK_TOKEN;
const rtm = new RTMClient(SLACK_TOKEN);
const web = new WebClient(SLACK_TOKEN);
rtm.start(); // starts websocket to receive events from slack

// Envrionment constants. As per "config.yml", TEST_ENV values
const PRODUCTION = 'production';
const STAGING = 'staging';

// Scripts
const WELCOME = `Welcome to the \`Acceptance Test Channel\`. I am Teolo and I'm watching you...`
const SPEAK_MY_LANGUAGE = `Speak my *case-sensitive* language! Try: \n \`Get latest build\`\n \`Run tests\`\n`;
const SMALL_TALKS_WARN = `No small-talks. Only tests.`;

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
    rtm.sendMessage(`Hello ${userDisplayName}. ${WELCOME}\n\n${SPEAK_MY_LANGUAGE}`, process.env.CHANNEL_ID);
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

  } else if (event.text === 'Run tests') {
    const formattedTextJson = {
      channel: process.env.CHANNEL_ID,
      text: `Ok @${userDisplayName} where do you want to run your tests?`,
      attachments: [
        {
          "text": "Choose the test environment",
          "fallback": "You are unable to run tests",
          "callback_id": "acceptance_test",
          "color": "#3AA3E3",
          "attachment_type": "default",
          "actions": [
            {
              "name": "test",
              "text": STAGING,
              "type": "button",
              "value": STAGING
            },
            {
              "name": "test",
              "text": PRODUCTION,
              "style": "danger",
              "type": "button",
              "value": PRODUCTION,
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
  } else {
    rtm.sendMessage(`${SMALL_TALKS_WARN} \n\n${SPEAK_MY_LANGUAGE}`, process.env.CHANNEL_ID);
  }
});


// Single point of entry for Slack to hit.
app.post('/slack/actions', async (req, res) => {
  try {
    if (!req.body) {
      throw new Error('No request body');
    }
    const payload = req.body.payload;
    console.log('> Payload:', payload);
    console.log('> Payload actions:', payload.actions);
    const environment = payload.actions[0].value.toLowerCase();

    const url = `https://circleci.com/api/v1.1/project/github/AgoloMarx/system_test/tree/master?circle-token=${process.env.CIRCLECI_TOKEN}`;
    const response = await axios.post(url, {
      build_parameters: {
        TEST_ENV: environment,
      }
    });
    const result = response.data;
    const formattedText = `Rebuild successfully triggered at \`${envrionment} Envrionment\`. \n\n
    *Build Url*: ${result.build_url} \n
    *Build number*: ${result.build_num} \n
    `;
    rtm.sendMessage(formattedText, process.env.CHANNEL_ID);
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

