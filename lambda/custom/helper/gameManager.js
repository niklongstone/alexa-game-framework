const QuestManager = function (game) {
  this.game = game;
  this.end = 'END';
};


QuestManager.prototype.getFirstQuestionData = function (gameId) {
  const gameData = this.game.filter(elem => parseInt(elem.gameId) === parseInt(gameId));
  const elem = gameData.reduce((prev, curr) => (prev.id < curr.id ? prev : curr));

  return elem;
};

QuestManager.prototype.isCorrectAnswer = function (id, answer) {
  const index = this.game.findIndex(findById, id);

  return parseInt(this.game[index].answer) === parseInt(answer);
};

QuestManager.prototype.getNextQuestionData = function (id, answer) {
  let index = this.game.findIndex(findById, id);
  let nextQuestion;
  if (this.isCorrectAnswer(id, answer)) {
    nextQuestion = this.game[index].ifCorrectGoTo;
  } else {
    nextQuestion = this.game[index].ifWrongGoTo;
  }
  if (nextQuestion === this.end) {
    return this.end;
  }
  index = this.game.findIndex(findById, nextQuestion);

  return this.game[index];
};

function findById(element) {
  return element.id === parseInt(this);
}

module.exports = QuestManager;
