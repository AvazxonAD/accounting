const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Loglar joylashadigan papka yo'li
const logDir = path.join(__dirname, '../../../logs');

// Loggerni yaratish funksiyasi
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

// Har bir log turi uchun loggerlarni yaratish
const getLogger = createLogger('get.log');
const postLogger = createLogger('post.log');
const putLogger = createLogger('put.log');
const deleteLogger = createLogger('delete.log');

// Loggerlarni eksport qilish
module.exports = {
  getLogger,
  postLogger,
  putLogger,
  deleteLogger,
};
