"use strict";

var _excluded = ["timestamp", "level", "message"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var winston = require('winston');
var path = require('path');
var logDir = path.join(__dirname, '../../../logs');
var createLogger = function createLogger(filename) {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }), winston.format.printf(function (_ref) {
      var timestamp = _ref.timestamp,
        level = _ref.level,
        message = _ref.message,
        meta = _objectWithoutProperties(_ref, _excluded);
      var logMessage = "".concat(timestamp, " ").concat(message);
      if (meta.type && meta.id && meta.user_id) {
        return "".concat(logMessage, ". ").concat(meta.type, ". id:").concat(meta.id, ". user_id:").concat(meta.user_id);
      }
      return logMessage;
    })),
    transports: [new winston.transports.File({
      filename: path.join(logDir, filename)
    })]
  });
};
var getLogger = createLogger('get.log');
var postLogger = createLogger('post.log');
var putLogger = createLogger('put.log');
var deleteLogger = createLogger('delete.log');
var logRequest = function logRequest(type_log, type, role, id, user_id) {
  var meta = {
    role: role,
    id: id,
    user_id: user_id
  };
  if (type_log === 'get') {
    getLogger.info(type, meta);
  } else if (type_log === 'put') {
    putLogger.info(type, meta);
  } else if (type_log === 'post') {
    postLogger.info(type, meta);
  } else {
    deleteLogger.info(type, meta);
  }
};
module.exports = {
  logRequest: logRequest
};