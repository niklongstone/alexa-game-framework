const assert = require('assert');
const GameManager = require('../../custom/helper/gameManager');


describe('GameManager', () => {
  const quest = [{
    id: 'id',
    gameId: 'gameId',
    question: 'question',
    answer: 'answer',
    ifCorrectGoTo: 'ifCorrectGoTo',
    ifWrongGoTo: 'ifWrongGoTo',
  },
  {
    id: 30,
    gameId: '1',
    question: 'Choose a letter, 1) A, 2) B, 3) C',
    answer: '2',
    ifCorrectGoTo: 'END',
    ifWrongGoTo: 'END',
  },
  {
    id: 10,
    gameId: '1',
    question: 'Choose a color, 1) blue, 2) yellow, 3) red',
    answer: '1',
    ifCorrectGoTo: '30',
    ifWrongGoTo: '20',
  },
  {
    id: 20,
    gameId: '1',
    question: 'Choose a number, 1) one, 2) two, 3) three',
    answer: '1',
    ifCorrectGoTo: 'END',
    ifWrongGoTo: 'END',
  }];

  describe('getQuestion', () => {
    it('should return the correct question', () => {
      const gameManager = new GameManager(quest);
      const expected = quest[2].question;
      const actual = gameManager.getFirstQuestionData(1).question;

      assert.deepEqual(actual, expected);
    });
  });

  describe('isCorrectAnswer', () => {
    it('should return true if the answer is correct', () => {
      const gameManager = new GameManager(quest);
      const isCorrectAnswer = gameManager.isCorrectAnswer(30, 2);

      assert.deepEqual(isCorrectAnswer, true);
    });
  });

  describe('isCorrectAnswer', () => {
    it('should return false if the answer is wrong', () => {
      const gameManager = new GameManager(quest);
      const isCorrectAnswer = gameManager.isCorrectAnswer(30, 1);

      assert.deepEqual(isCorrectAnswer, false);
    });
  });

  describe('getFirstQuestionData', () => {
    it('should return the next question data for correct answer', () => {
      const gameManager = new GameManager(quest);
      const nextQuestion = gameManager.getFirstQuestionData(1);
      const expected = quest[2];

      assert.deepEqual(nextQuestion, expected);
    });
  });

  describe('getNextQuestionData', () => {
    it('should return the next question data for wrong answer', () => {
      const gameManager = new GameManager(quest);
      const nextQuestion = gameManager.getNextQuestionData(10, 4);
      const expected = quest[3];

      assert.deepEqual(nextQuestion, expected);
    });
  });

  describe('getNextQuestionData', () => {
    it('should return END if the next question data leads to the end', () => {
      const gameManager = new GameManager(quest);
      const nextQuestion = gameManager.getNextQuestionData(20, 1);

      assert.deepEqual(nextQuestion, 'END');
    });
  });
});
