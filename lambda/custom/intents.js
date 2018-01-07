'use strict';

/**
 * This file contains constant definitions of intents that we're
 * interested in for our skill.
 *
 * Refer to the following link for a list of built-in intents,
 * and what those intents do.
 * https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/built-in-intent-ref/standard-intents
 */

/**
 * Amazon built-in intents.
 */
const AMAZON_HELP = 'AMAZON.HelpIntent';
const AMAZON_CANCEL = 'AMAZON.CancelIntent';
const AMAZON_YES = 'AMAZON.YesIntent';
const AMAZON_NO = 'AMAZON.NoIntent';
const AMAZON_REPEAT = 'AMAZON.RepeatIntent';

/**
 * Custom intents.
 */
const CHOOSE_GAME = 'ChooseGameIntent';
const QUEST_NUMBER = 'GameNumberIntent';

module.exports = {
  AMAZON_HELP,
  AMAZON_CANCEL,
  AMAZON_YES,
  AMAZON_NO,
  AMAZON_REPEAT,
  CHOOSE_GAME,
  QUEST_NUMBER,
};
