'use strict';

// External imports
const Alexa = require('alexa-sdk');

// Internal imports
const states = require('./constants').states;
const GameManager = require('./helper/gameManager');
let gameList = require('./data/gameList').gameList;
const gameData = require('./data/gameData').gameData;
const Logger = require('./helper/logger');

const gameManager = new GameManager(gameData);
const logger = new Logger();

// Global var
let questNumber;

/**
 * This function lists the quests and ask for a choice.
 * In case the user left a question without an answer the function will prompt a resume message.
 */
const askForQuestHandler = function () {
  logger.log('Starting askForQuestHandler()');
  logger.log(JSON.stringify(this.attributes));
  if (this.attributes.questionId) {
    logger.log(`previous quest present${this.attributes.questionId}`);
    this.handler.state = states.RESUME_QUEST;
    this.emitWithState('askForResumeGameHandler');
  } else {
    this.attributes.speechOutput = this.t('CHOOSE_GAME_MESSAGE');
    if (typeof this.attributes.completedQuest !== 'undefined') {
      gameList = removeCompleted(gameList, this.attributes.completedQuest);
    }
    if (gameList.length === 0) {
      this.emit(':tell', this.t('NO_QUEST_AVAILABLE'));
    } else {
      for (let index = 0; index < gameList.length; ++index) {
        if (index < 1) {
          this.attributes.speechOutput += ' say ';
        }
        this.attributes.speechOutput += `${index + 1} for ${gameList[index].name}. `;
      }
      logger.log(this.attributes.speechOutput);
      this.emit(':ask', this.attributes.speechOutput, this.t('CHOOSE_GAME_REPEAT_MESSAGE'));
    }
  }
  logger.log('Ending askForQuestHandler()');
};

/**
 * This is a helper function that removes user's completed quests from the quest's list
 */
function removeCompleted(list, completed) {
  return list.filter(obj => Object.keys(completed).every(() => !completed.includes(parseInt(obj.id))));
}

/**
 * This intent receives the user's selected quest and starts it.
 */
const GameNumberIntent = function () {
  logger.log('Starting GameNumberIntent()');
  logger.log(this.event.request.intent.slots);
  questNumber = this.event.request.intent.slots.number.value;
  logger.log(`Quest Number: ${questNumber}`);
  this.handler.state = states.GAME_MODE;
  this.emitWithState('startQuestHandler', true);
  logger.log('Ending GameNumberIntent()');
};

/**
 * This is the help handler triggered when someone is choosing a quest.
 */
const chooseQuestHelpHandler = function () {
  logger.log('Starting chooseQuestHelpHandler()');
  this.emit(':ask', this.t('HELP_WHEN_CHOOSING_A_QUEST_MESSAGE') + this.attributes.speechOutput);
  logger.log('Ending chooseQuestHelpHandler()');
};

/**
 * This is the handler called when the session ends.
 */
const sessionEndedRequestHandler = function () {
  logger.log('Starting sessionEndedRequestHandler()');
  saveState(this);
  logger.log('Ending sessionEndedRequestHandler()');
};

/**
 * This is the handler for stopping and canceling actions.
 */
const amazonCancelWhileChooseGameHandler = function () {
  logger.log('Starting amazonCancelHandler()');
  saveState(this);
  this.emit(':tell', this.t('STOP_MESSAGE'));
  logger.log('Ending amazonCancelHandler()');
};

/**
 * This is the handler for the Unhandled event.
 */
const unhandledRequestHandler = function () {
  logger.log('Starting unhandledRequestHandler()');
  saveState(this);
  this.emit(':tell', this.t('UNHANDLED'));
  logger.log('Ending unhandledRequestHandler()');
};

/**
 * This function sets the user's attributes to an initial state.
 */
const saveState = function (ref) {
  logger.log(`reset state ${ref.handler.state}`);
  ref.handler.state = undefined;
  ref.attributes.STATE = undefined;
  ref.attributes.speechOutput = undefined;
};

/**
 * This is the choose a quest state handler.
 * It asks which quest the user would like to play.
 */
const chooseGameHandler = Alexa.CreateStateHandler(states.CHOOSE_GAME, {
  askForQuestHandler,
  GameNumberIntent,
  'AMAZON.RepeatIntent': askForQuestHandler,
  'AMAZON.HelpIntent': chooseQuestHelpHandler,
  'AMAZON.CancelIntent': amazonCancelWhileChooseGameHandler,
  'AMAZON.StopIntent': amazonCancelWhileChooseGameHandler,
  Unhandled: unhandledRequestHandler,
  SessionEndedRequest: sessionEndedRequestHandler,
});

const askForResumeGameHandler = function () {
  logger.log('Starting askForResumeGameHandler()');
  this.emit(':ask', this.t('RESUME_MESSAGE'));
  logger.log('Ending askForResumeGameHandler()');
};

const resumeYesHandler = function () {
  logger.log('Starting resumeYesHandler()');
  this.handler.state = states.GAME_MODE;
  this.emit(':ask', this.attributes.currentQuestion);
  logger.log('Ending resumeYesHandler()');
};

const resumeNoHandler = function () {
  logger.log('Starting resumeNoHandler()');
  saveState(this);
  this.attributes.questionId = undefined;
  this.handler.state = states.CHOOSE_GAME;
  this.emitWithState('askForQuestHandler', true);
  logger.log('Ending resumeNoHandler()');
};

/**
 * This is the choose a quest state handler.
 * It asks which quest the user would like to play.
 */
const resumeGameHandler = Alexa.CreateStateHandler(states.RESUME_QUEST, {
  askForResumeGameHandler,
  'AMAZON.YesIntent': resumeYesHandler,
  'AMAZON.NoIntent': resumeNoHandler,
  'AMAZON.CancelIntent': amazonCancelWhileChooseGameHandler,
  'AMAZON.StopIntent': amazonCancelWhileChooseGameHandler,
  Unhandled: unhandledRequestHandler,
  SessionEndedRequest: sessionEndedRequestHandler,
});

/**
 * This is the handler which starts the quest and asks the first question.
 * Refer to the Intents.js file for documentation.
 */
const startQuestHandler = function () {
  logger.log('Starting startQuestHandler()');
  const quest = gameList[questNumber - 1];
  logger.log(gameList);
  logger.log(quest);
  this.attributes.gameId = quest.id;
  const introSpeech = this.t('QUEST_NUMBER_CHOICE_BEGIN', quest.name);
  const questIntro = '';
  const firstQuestion = gameManager.getFirstQuestionData(quest.id);
  logger.log(firstQuestion);
  this.attributes.questionId = firstQuestion.id;
  const speechOutput = introSpeech + questIntro + firstQuestion.question;
  logger.log(speechOutput);
  this.handler.state = states.GAME_MODE;
  this.attributes.currentQuestion = firstQuestion.question;
  this.emit(':ask', speechOutput, firstQuestion.question);
  logger.log('Ending startQuestHandler()');
};

/**
 * This is the handler which manges the answeres for the quest's choice.
 * Refer to the Intents.js file for documentation.
 */
const answerNumberIntent = function () {
  logger.log('Starting answerNumberIntent()');
  let speechOutput;
  this.choiceNumber = this.event.request.intent.slots.number.value;
  logger.log(this.attributes.questionId);
  if (gameManager.isCorrectAnswer(this.attributes.questionId, this.choiceNumber)) {
    speechOutput = this.t('CORRECT_ANSWER_MESSAGE');
  } else {
    speechOutput = this.t('WRONG_ANSWER_MESSAGE');
  }
  const nextQuestionData = gameManager.getNextQuestionData(this.attributes.questionId, this.choiceNumber);
  if (nextQuestionData !== 'END') {
    this.attributes.questionId = nextQuestionData.id;
    this.attributes.currentQuestion = nextQuestionData.question;
    speechOutput += nextQuestionData.question;
    logger.log(speechOutput);
    this.emit(':ask', speechOutput);
  } else {
    const completedQuest = this.attributes.completedQuest;
    completedQuest.push(parseInt(this.attributes.gameId));
    this.attributes.completedQuest = completedQuest;
    logger.log(`completedQuest ${this.attributes.completedQuest}`);
    this.attributes.questionId = undefined;
    this.emit(':tell', this.t('END_OF_QUEST_MESSAGE'));
  }
  logger.log('Ending answerNumberIntent()');
};

/**
 * This is the handler that repeats last question.
 */
const amazonRepeatHandler = function () {
  logger.log('Starting amazonRepeatHandler()');
  this.emit(':ask', this.attributes.currentQuestion);
  logger.log('Ending amazonRepeatHandler()');
};

/**
 * This is the handler for stopping and canceling actions.
 */
const amazonCancelWhileInQuest = function () {
  logger.log('Starting amazonCancelWhileInQuest()');
  saveState(this);
  this.emit(':tell', this.t('STOP_MESSAGE'));
  logger.log('Ending amazonCancelWhileInQuest()');
};

/**
 * This is the help handler triggered when inside a quest.
 */
const amazonHelpHandler = function () {
  logger.log('Starting amazonHelpHandler()');
  this.emit(':ask', this.t('HELP_WHEN_IN_QUEST_MESSAGE') + this.attributes.currentQuestion);
  logger.log('Ending amazonHelpHandler()');
};

/**
 * This is the state handler to manage the quest's questions/answers journey.
 */
const gameModeHandler = Alexa.CreateStateHandler(states.GAME_MODE, {
  startQuestHandler,
  GameNumberIntent: answerNumberIntent,
  'AMAZON.RepeatIntent': amazonRepeatHandler,
  'AMAZON.HelpIntent': amazonHelpHandler,
  'AMAZON.CancelIntent': amazonCancelWhileInQuest,
  'AMAZON.StopIntent': amazonCancelWhileInQuest,
  Unhandled: unhandledRequestHandler,
  SessionEndedRequest: sessionEndedRequestHandler,
});

const handlers = {};

// Add event handlers
handlers.chooseGameHandler = chooseGameHandler;
handlers.gameModeHandler = gameModeHandler;
handlers.resumeGameHandler = resumeGameHandler;

module.exports = handlers;
