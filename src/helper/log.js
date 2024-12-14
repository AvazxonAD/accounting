const winston = require('winston');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');

const createLogger = (filename) => {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let logMessage = `${timestamp}. ${meta.type || 'unknown'}.`; // Type ni tekshirib qo'shamiz
        if (meta.id && meta.user_id) {
          logMessage += ` id:${meta.id}. user_id:${meta.user_id}`;
        }
        return logMessage;
      })
    ),
    transports: [
      new winston.transports.File({ filename: path.join(logDir, filename) })
    ],
  });
};

const getLogger = createLogger('get.log');
const postLogger = createLogger('post.log');
const putLogger = createLogger('put.log');
const deleteLogger = createLogger('delete.log');

const logRequest = (type_log, meta) => {
  if (type_log === 'get') {
    getLogger.info('', meta); // meta ni to'g'ri uzatish
  } else if (type_log === 'put') {
    putLogger.info('', meta);
  } else if (type_log === 'post') {
    postLogger.info('', meta);
  } else {
    deleteLogger.info('', meta);
  }
};

module.exports = { logRequest };
