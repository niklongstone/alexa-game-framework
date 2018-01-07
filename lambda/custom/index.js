'use strict';

// External imports
const Alexa = require('alexa-sdk');

// Local imports
const Handlers = require('./handlers');
const StateHandlers = require('./stateHandlers');
const Messages = require('./translation/languageStrings');
const Logger = require('./helper/logger');

const logger = new Logger();

// Constants
const constants = require('./constants');

exports.handler = function (event, context, callback) {
  const alexa = Alexa.handler(event, context, callback);

  alexa.appId = constants.appId;
  alexa.registerHandlers(Handlers, StateHandlers.chooseGameHandler, StateHandlers.gameModeHandler, StateHandlers.resumeGameHandler);
  alexa.resources = Messages;
  /*
   * Uncomment the below line if you want to store the state into a DynamoDB table
   */
  // alexa.dynamoDBTableName = constants.dynamoDBTableName;

  logger.log(`Beginning execution for skill with APP_ID=${alexa.appId}`);
  alexa.execute();
  logger.log(`Ending execution  for skill with APP_ID=${alexa.appId}`);
};
