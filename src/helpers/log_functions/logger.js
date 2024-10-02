const winston = require('winston');
const path = require('path');

const logDir = path.join(__dirname, '../../../logs');

const createLogger = (filename) => {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
      })
    ),
    transports: [
      new winston.transports.File({ filename: path.join(logDir, filename) }),
    ],
  });
};

const getLogger = createLogger('get.log');
const postLogger = createLogger('post.log');
const putLogger = createLogger('put.log');
const deleteLogger = createLogger('delete.log');

module.exports = {
  getLogger,
  postLogger,
  putLogger,
  deleteLogger,
};
