"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Joi = require('joi');
exports.GroupSchema = /*#__PURE__*/function () {
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
    key: "importData",
    value: function importData(lang) {
      return Joi.array().items(Joi.object({
        name: Joi.string().trim().messages({
          '*': lang.t('validation.groupName')
        }),
        schet: Joi.any().messages({
          '*': lang.t('validation.schet')
        }),
        iznos_foiz: Joi.number()["default"](0).messages({
          '*': lang.t('validation.iznosFoiz')
        }),
        provodka_debet: Joi.any().messages({
          '*': lang.t('validation.provodkaDebet')
        }),
        group_number: Joi.any().messages({
          '*': lang.t('validation.groupNumber')
        }),
        provodka_kredit: Joi.any().messages({
          '*': lang.t('validation.provodkaKredit')
        }),
        provodka_subschet: Joi.any().messages({
          '*': lang.t('validation.provodkaSubschet')
        }),
        roman_numeral: Joi.any().messages({
          '*': lang.t('validation.romanNumeral')
        }),
        pod_group: Joi.any().messages({
          '*': lang.t('validation.podGroup')
        })
      })).min(1).required().messages({
        '*': lang.t('validation.groupMinError')
      });
    }
  }]);
}();
exports.createSchema = Joi.object({
  body: Joi.object({
    smeta_id: Joi.number().min(1).integer().required(),
    name: Joi.string().trim(),
    schet: Joi.string().trim(),
    iznos_foiz: Joi.number(),
    provodka_debet: Joi.string().trim(),
    group_number: Joi.string().trim(),
    provodka_kredit: Joi.string().trim(),
    provodka_subschet: Joi.string().trim(),
    roman_numeral: Joi.string().trim(),
    pod_group: Joi.string().trim()
  })
}).options({
  stripUnknown: true
});
exports.updateSchema = Joi.object({
  body: Joi.object({
    smeta_id: Joi.number().required().min(1).integer(),
    name: Joi.string().trim(),
    schet: Joi.string().trim(),
    iznos_foiz: Joi.number(),
    provodka_debet: Joi.string().trim(),
    group_number: Joi.string().trim(),
    provodka_kredit: Joi.string().trim(),
    provodka_subschet: Joi.string().trim(),
    roman_numeral: Joi.string().trim(),
    pod_group: Joi.string().trim()
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
});
exports.getSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().integer().min(1)["default"](1),
    limit: Joi.number().integer().min(1)["default"](10),
    search: Joi.string().trim()
  })
}).options({
  stripUnknown: true
});
exports.getByIdGroupSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({
  stripUnknown: true
});
exports.deleteSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({
  stripUnknown: true
});