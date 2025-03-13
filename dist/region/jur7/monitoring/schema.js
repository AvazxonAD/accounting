"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Joi = require('joi');
exports.Schema = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "getObrotkaSchema",
    value: function getObrotkaSchema() {
      return Joi.object({
        query: Joi.object({
          month: Joi.number().integer().min(1).required().max(12),
          year: Joi.number().integer().min(1901).required(),
          main_schet_id: Joi.number().integer().min(1).required()
        })
      }).options({
        stripUnknown: true
      });
    }
  }, {
    key: "getMaterialSchema",
    value: function getMaterialSchema() {
      return Joi.object({
        query: Joi.object({
          month: Joi.number().integer().min(1).required().max(12),
          year: Joi.number().integer().min(1901).required(),
          main_schet_id: Joi.number().integer().min(1).required()
        })
      }).options({
        stripUnknown: true
      });
    }
  }, {
    key: "capSchema",
    value: function capSchema() {
      return Joi.object({
        query: Joi.object({
          budjet_id: Joi.number().integer().min(1).required(),
          from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
          to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
          excel: Joi.string().trim().valid('true', 'false')
        })
      }).options({
        stripUnknown: true
      });
    }
  }, {
    key: "backCapSchema",
    value: function backCapSchema() {
      return Joi.object({
        query: Joi.object({
          budjet_id: Joi.number().integer().min(1).required(),
          from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
          to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
          excel: Joi.string().trim().valid('true', 'false')
        })
      }).options({
        stripUnknown: true
      });
    }
  }, {
    key: "getSaldoSchema",
    value: function getSaldoSchema() {
      return Joi.object({
        query: Joi.object({
          responsible_id: Joi.number().integer().min(1).required(),
          page: Joi.number().integer().min(1)["default"](1),
          limit: Joi.number().integer().min(1)["default"](10),
          to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
          from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
          search: Joi.string().trim().allow(null, ''),
          product_id: Joi.number().integer().min(1)
        })
      }).options({
        stripUnknown: true
      });
    }
  }]);
}();