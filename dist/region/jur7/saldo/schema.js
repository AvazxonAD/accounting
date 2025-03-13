"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Joi = require('joi');
exports.SaldoSchema = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "import",
    value: function _import() {
      return Joi.object({
        query: Joi.object({
          main_schet_id: Joi.number().integer().min(1).required(),
          budjet_id: Joi.number().integer().min(1).required()
        }),
        file: Joi.object({
          path: Joi.string().trim().required()
        })
      }).options({
        stripUnknown: true
      });
    }
  }, {
    key: "importData",
    value: function importData(lang) {
      return Joi.object({
        responsible_id: Joi.number().min(1).required().messages({
          '*': lang.t('validation.responsibleId')
        }),
        group_jur7_id: Joi.number().required().messages({
          '*': lang.t('validation.groupId')
        }),
        doc_date: Joi.string().trim().pattern(/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/).messages({
          '*': lang.t('validation.importDocDate')
        }),
        iznos_start: Joi.string().trim().pattern(/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/).messages({
          '*': lang.t('validation.iznosStart')
        }),
        doc_num: Joi.string().messages({
          '*': lang.t('validation.docNum')
        }),
        name: Joi.string().trim().required().messages({
          '*': lang.t('validation.productName')
        }),
        edin: Joi.string().trim().required().messages({
          '*': lang.t('validation.edin')
        }),
        kol: Joi.number().min(1).required().messages({
          '*': lang.t('validation.kol')
        }),
        summa: Joi.number().min(1).required().messages({
          '*': lang.t('validation.summa')
        }),
        year: Joi.number().min(1901).required().messages({
          '*': lang.t('validation.year')
        }),
        month: Joi.number().min(1).max(12).required().messages({
          '*': lang.t('validation.month')
        }),
        inventar_num: Joi.any().messages({
          '*': lang.t('validation.inventarNum')
        }),
        serial_num: Joi.any().messages({
          '*': lang.t('validation.serialNum')
        }),
        iznos: Joi.any().messages({
          '*': lang.t('validation.iznos')
        }),
        eski_iznos_summa: Joi.number().min(0)["default"](0).messages({
          '*': lang.t('validation.eskiIznosSumma')
        })
      }).options({
        stripUnknown: true
      });
    }
  }, {
    key: "get",
    value: function get() {
      return Joi.object({
        query: Joi.object({
          kimning_buynida: Joi.number().integer().min(1),
          group_id: Joi.number().integer().min(1),
          page: Joi.number().integer().min(1)["default"](1),
          limit: Joi.number().integer().min(1)["default"](99999),
          search: Joi.string().trim().allow(null, ''),
          type: Joi.string().trim().valid('responsible', 'group', 'product')["default"]('responsible'),
          to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
          iznos: Joi.string().trim()
        })
      }).options({
        stripUnknown: true
      });
    }
  }, {
    key: "create",
    value: function create() {
      return Joi.object({
        body: Joi.object({
          year: Joi.number().min(1901).max(2099).required().integer(),
          month: Joi.number().min(1).max(12).required().integer()
        }),
        query: Joi.object({
          main_schet_id: Joi.number().integer().min(1).required(),
          budjet_id: Joi.number().integer().min(1).required()
        })
      }).options({
        stripUnknown: true
      });
    }
  }, {
    key: "updateIznosSumma",
    value: function updateIznosSumma() {
      return Joi.object({
        body: Joi.object({
          iznos_summa: Joi.number().min(1).required()
        }),
        params: Joi.object({
          id: Joi.number().integer().min(1).required()
        })
      }).options({
        stripUnknown: true
      });
    }
  }, {
    key: "deleteById",
    value: function deleteById() {
      return Joi.object({
        params: Joi.object({
          id: Joi.number().integer().min(1).required()
        })
      }).options({
        stripUnknown: true
      });
    }
  }, {
    key: "delete",
    value: function _delete() {
      return Joi.object({
        body: Joi.object({
          ids: Joi.array().items(Joi.object({
            id: Joi.number().integer().min(1).required()
          })).min(1).required(),
          year: Joi.number().min(1901).max(2099).required().integer(),
          month: Joi.number().min(1).max(12).required().integer()
        })
      }).options({
        stripUnknown: true
      });
    }
  }, {
    key: "check",
    value: function check() {
      return Joi.object({
        query: Joi.object({
          year: Joi.number().min(1901).max(2099).required().integer(),
          month: Joi.number().min(1).max(12).required().integer()
        })
      }).options({
        stripUnknown: true
      });
    }
  }, {
    key: "getById",
    value: function getById() {
      return Joi.object({
        params: Joi.object({
          id: Joi.number().min(1).required().integer()
        })
      }).options({
        stripUnknown: true
      });
    }
  }]);
}();