const Logger = function () {
};

/**
 * This is a helper function which handles the log messages.
 */
Logger.prototype.log = function (message) {
  const noLog = process.env.NO_LOG || false;
  if (!noLog) {
    console.info(message);
  }
};

module.exports = Logger;
