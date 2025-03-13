const winston = require("winston");
const path = require("path");

const logDir = path.join(__dirname, "../../../logs");

const createLogger = (filename) => {
  return winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const logMessage = `${timestamp} ${message}`;
        if (meta.type && meta.id && meta.user_id) {
          return `${logMessage}. ${meta.type}. id:${meta.id}. user_id:${meta.user_id}`;
        }
        return logMessage;
      })
    ),
    transports: [
      new winston.transports.File({ filename: path.join(logDir, filename) }),
    ],
  });
};

const getLogger = createLogger("get.log");
const postLogger = createLogger("post.log");
const putLogger = createLogger("put.log");
const deleteLogger = createLogger("delete.log");

const logRequest = (type_log, type, role, id, user_id) => {
  const meta = { role, id, user_id };

  if (type_log === "get") {
    getLogger.info(type, meta);
  } else if (type_log === "put") {
    putLogger.info(type, meta);
  } else if (type_log === "post") {
    postLogger.info(type, meta);
  } else {
    deleteLogger.info(type, meta);
  }
};

module.exports = { logRequest };
