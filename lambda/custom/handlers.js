'use strict';

// External imports
const Logger = require('./helper/logger');

const logger = new Logger();

/**
 * This class contains all handler function definitions
 * for the various events that we will be registering for.
 * For an understanding of how these Alexa Skill event objects
 * are structured refer to the following documentation:
 * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interface-reference
 */

// Internal imports
const Intents = require('./intents');
const Events = require('./events');
const states = require('./constants').states;

/**
 * This is the handler for the NewSession event.
 * Refer to the  Events.js file for more documentation.
 */
const newSessionRequestHandler = function () {
  logger.log('Starting newSessionRequestHandler()');
  if (this.event.request.type === Events.LAUNCH_REQUEST) {
    logger.log('launch request');
    this.emit(Events.LAUNCH_REQUEST);
  } else if (this.event.request.intent.name === 'ChooseGameIntent') {
    this.emit('ChooseGameIntent');
  } else if (this.event.request.type === 'IntentRequest') {
    logger.log(`Requested: ${this.event.request.intent.name}`);
    if (typeof this.handler.state === 'undefined') {
      this.emit(this.event.request.intent.name);
    } else {
      this.emitWithState(this.event.request.intent.name);
    }
  }

  logger.log('Ending newSessionRequestHandler()');
};

/**
 * This is the handler for the LaunchRequest event. Refer to
 * the Events.js file for more documentation.
 */
const launchRequestHandler = function () {
  logger.log('Starting launchRequestHandler()');
  this.emit(':ask', this.t('WELCOME_MESSAGE', this.t('SKILL_NAME')));
  logger.log('Ending launchRequestHandler()');
};

/**
 * This is the handler for the SessionEnded event. Refer to
 * the Events.js file for more documentation.
 */
const sessionEndedRequestHandler = function () {
  logger.log('Starting sessionEndedRequestHandler()');
  logger.log('Ending sessionEndedRequestHandler()');
};

/**
 * This is the handler for the Unhandled event. Refer to
 * the Events.js file for more documentation.
 */
const unhandledRequestHandler = function () {
  logger.log('Starting unhandledRequestHandler()');
  this.emit(':ask', this.t('UNHANDLED'));
  logger.log('Ending unhandledRequestHandler()');
};

/**
 * This is the handler for the Amazon help built in intent.
 * Refer to the Intents.js file for documentation.
 */
const amazonHelpHandler = function () {
  logger.log('Starting amazonHelpHandler()');
  this.emit(':ask', this.t('HELP_MESSAGE'), this.t('HELP_REPROMPT'));
  logger.log('Ending amazonHelpHandler()');
};

/**
 * This is the handler for the Amazon cancel built in intent.
 * Refer to the Intents.js file for documentation.
 */
const amazonCancelHandler = function () {
  logger.log('Starting amazonCancelHandler()');
  this.emit(':tell', this.t('STOP_MESSAGE'));
  logger.log('Ending amazonCancelHandler()');
};

/**
 * This is the handler for the Amazon stop built in intent.
 * Refer to the Intents.js file for documentation.
 */
const amazonStopHandler = function () {
  logger.log('Starting amazonStopHandler()');
  this.emit(':ask', this.t('STOP_MESSAGE'));
  logger.log('Ending amazonStopHandler()');
};

/**
 * This is the handler which starts the quest choice
 * Refer to the Intents.js file for documentation.
 */
const gotoChooseGameHandler = function () {
  logger.log('Starting gotoChooseGameHandler()');
  this.handler.state = states.CHOOSE_GAME;
  this.emitWithState('askForQuestHandler', true);
  logger.log('Ending gotoChooseGameHandler()');
};

const handlers = {};
// Add event handlers
handlers[Events.NEW_SESSION] = newSessionRequestHandler;
handlers[Events.LAUNCH_REQUEST] = launchRequestHandler;
handlers[Events.SESSION_ENDED] = sessionEndedRequestHandler;
handlers[Events.UNHANDLED] = unhandledRequestHandler;

// Add intent handlers
handlers[Intents.AMAZON_CANCEL] = amazonCancelHandler;
handlers[Intents.AMAZON_STOP] = amazonStopHandler;
handlers[Intents.AMAZON_HELP] = amazonHelpHandler;
handlers[Intents.CHOOSE_GAME] = gotoChooseGameHandler;

module.exports = handlers;
