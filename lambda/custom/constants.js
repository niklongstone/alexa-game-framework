'use strict';

module.exports = Object.freeze({

  // App-ID. Set to your own Skill App ID from the developer portal.
  appId: 'amzn1.ask.skill.123',

  //  DynamoDB Table name to save the user's state.
  dynamoDBTableName: 'Alexa-Skill-State',

  /*
   *  States:
   *  MANAGE_PROFILE : Manages the user profile.
   *  CHOOSE_GAME : When the user wants to choose a quest.
   *  GAME_MODE : When the user is answering the quest's questions.
   *  RESUME_QUEST : When the user left some questions not answered and left the game.
   */
  states: {
    MANAGE_PROFILE: '_MANAGE_PROFILE',
    CHOOSE_GAME: '_CHOOSE_GAME',
    GAME_MODE: '_GAME_MODE',
    RESUME_QUEST: '_RESUME_QUEST',
  },
});
