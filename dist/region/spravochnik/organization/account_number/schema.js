"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Joi = require('joi');
exports.AccountNumberSchema = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "import",
    value: function _import() {
      return Joi.object({
        file: Joi.object({
          path: Joi.string().trim().required()
        })
      });
    }
  }, {
    key: "create",
    value: function create() {
      return Joi.object({
        body: Joi.object({
          raschet_schet: Joi.string().trim().required(),
          spravochnik_organization_id: Joi.number().min(1).integer().required()
        })
      }).options({
        stripUnknown: true
      });
    }
  }, {
    key: "update",
    value: function update() {
      return Joi.object({
        body: Joi.object({
          raschet_schet: Joi.string().trim().required(),
          spravochnik_organization_id: Joi.number().min(1).integer().required()
        }),
        params: Joi.object({
          id: Joi.number().integer().min(1).required()
        })
      }).options({
        stripUnknown: true
      });
    }
  }, {
    key: "delette",
    value: function delette() {
      return Joi.object({
        params: Joi.object({
          id: Joi.number().integer().min(1).required()
        })
      });
    }
  }, {
    key: "getById",
    value: function getById() {
      return Joi.object({
        params: Joi.object({
          id: Joi.number().integer().min(1).required()
        })
      });
    }
  }, {
    key: "get",
    value: function get() {
      return Joi.object({
        query: Joi.object({
          page: Joi.number().min(1)["default"](1),
          limit: Joi.number().min(1)["default"](10),
          organ_id: Joi.number().integer().min(1),
          search: Joi.string()
        })
      }).options({
        stripUnknown: true
      });
    }
  }]);
}();