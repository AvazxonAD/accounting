"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Joi = require('joi');
exports.DocSchema = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "auto",
    value: function auto() {
      return Joi.object({
        query: Joi.object({
          budjet_id: Joi.number().integer().min(1),
          main_schet_id: Joi.number().integer().min(1),
          month: Joi.number().integer().min(1).max(12).required(),
          year: Joi.number().integer().min(1901).required(),
          type_document: Joi.string().trim().valid('jur1', 'jur2', 'jur3', 'jur4', 'jur5', 'jur6', 'jur7', 'jur8', 'start', 'end').required()
        })
      }).options({
        stripUnknown: true
      });
    }
  }]);
}();
exports.createDocSchema = Joi.object({
  body: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1901).required(),
    type_document: Joi.string().trim().valid('jur1', 'jur2', 'jur3', 'jur4', 'jur5', 'jur6', 'jur7', 'jur8', 'start', 'end'),
    childs: Joi.array().required().items(Joi.object({
      spravochnik_main_book_schet_id: Joi.number().required().min(1),
      kredit_sum: Joi.number()["default"](0).min(0),
      debet_sum: Joi.number()["default"](0).min(0)
    }))
  }),
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({
  stripUnknown: true
});
exports.updateDocSchema = Joi.object({
  body: Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1901).required(),
    type_document: Joi.string().trim().valid('jur1', 'jur2', 'jur3', 'jur4', 'jur5', 'jur6', 'jur7', 'jur8', 'start', 'end'),
    childs: Joi.array().required().items(Joi.object({
      spravochnik_main_book_schet_id: Joi.number().required().min(1),
      kredit_sum: Joi.number()["default"](0).min(0),
      debet_sum: Joi.number()["default"](0).min(0)
    }))
  }),
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1901).required(),
    type_document: Joi.string().trim().valid('jur1', 'jur2', 'jur3', 'jur4', 'jur5', 'jur6', 'jur7', 'jur8', 'start', 'end'),
    main_schet_id: Joi.number().integer().min(1).required()
  })
}).options({
  stripUnknown: true
});
exports.getDocSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1),
    month: Joi.number().integer().min(1).max(12),
    year: Joi.number().integer().min(1901),
    type_document: Joi.string().trim().valid('jur1', 'jur2', 'jur3', 'jur4', 'jur5', 'jur6', 'jur7', 'jur8', 'start', 'end')
  })
}).options({
  stripUnknown: true
});
exports.getByIdDocSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1901).required(),
    type_document: Joi.string().trim().valid('jur1', 'jur2', 'jur3', 'jur4', 'jur5', 'jur6', 'jur7', 'jur8', 'start', 'end')
  })
}).options({
  stripUnknown: true
});
exports.deleteDocSchema = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1901).required(),
    type_document: Joi.string().trim().valid('jur1', 'jur2', 'jur3', 'jur4', 'jur5', 'jur6', 'jur7', 'jur8', 'start', 'end')
  })
}).options({
  stripUnknown: true
});
exports.auto = Joi.object({
  query: Joi.object({
    budjet_id: Joi.number().integer().min(1).required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(1901).required()
  })
}).options({
  stripUnknown: true
});