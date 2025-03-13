"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Joi = require('joi');
exports.AktSchema = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "create",
    value: function create() {
      return Joi.object({
        body: Joi.object({
          spravochnik_operatsii_own_id: Joi.number().required().min(1).integer(),
          doc_num: Joi.string().trim(),
          doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
          opisanie: Joi.string().trim(),
          id_spravochnik_organization: Joi.number().required().min(1).integer(),
          shartnomalar_organization_id: Joi.number().allow(null).min(1).integer(),
          organization_by_raschet_schet_id: Joi.number().min(1).integer().allow(null),
          organization_by_raschet_schet_gazna_id: Joi.number().min(1).integer().allow(null),
          shartnoma_grafik_id: Joi.number().min(1).integer().allow(null),
          childs: Joi.array().items(Joi.object({
            kol: Joi.number().min(1).required(),
            sena: Joi.number().min(1).required(),
            nds_foiz: Joi.number().min(1).allow(0).max(99)["default"](0),
            spravochnik_operatsii_id: Joi.number().required().min(1).integer(),
            id_spravochnik_podrazdelenie: Joi.number().min(1).integer().allow(null),
            id_spravochnik_sostav: Joi.number().min(1).integer().allow(null),
            id_spravochnik_type_operatsii: Joi.number().min(1).integer().allow(null)
          })).min(1).required()
        }),
        query: Joi.object({
          main_schet_id: Joi.number().min(1).integer().required()
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
          spravochnik_operatsii_own_id: Joi.number().required().min(1).integer(),
          doc_num: Joi.string().trim(),
          doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
          opisanie: Joi.string().trim(),
          id_spravochnik_organization: Joi.number().required().min(1).integer(),
          shartnomalar_organization_id: Joi.number().allow(null).min(1).integer(),
          organization_by_raschet_schet_id: Joi.number().min(1).integer().allow(null),
          organization_by_raschet_schet_gazna_id: Joi.number().min(1).integer().allow(null),
          shartnoma_grafik_id: Joi.number().min(1).integer().allow(null),
          childs: Joi.array().items(Joi.object({
            kol: Joi.number().min(1).required(),
            sena: Joi.number().min(1).required(),
            nds_foiz: Joi.number().min(1).allow(0).max(99)["default"](0),
            spravochnik_operatsii_id: Joi.number().required().min(1).integer(),
            id_spravochnik_podrazdelenie: Joi.number().min(1).integer().allow(null),
            id_spravochnik_sostav: Joi.number().min(1).integer().allow(null),
            id_spravochnik_type_operatsii: Joi.number().min(1).integer().allow(null)
          })).min(1).required()
        }),
        query: Joi.object({
          main_schet_id: Joi.number().min(1).integer().required()
        }),
        params: Joi.object({
          id: Joi.number().min(1).integer().required()
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
          main_schet_id: Joi.number().required().min(1).integer(),
          limit: Joi.number().min(1)["default"](10),
          page: Joi.number().min(1)["default"](1),
          from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
          search: Joi.string().trim().allow(null, ''),
          to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required()
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
          id: Joi.number().min(1).integer().required()
        }),
        query: Joi.object({
          main_schet_id: Joi.number().min(1).integer().required()
        })
      }).options({
        stripUnknown: true
      });
    }
  }, {
    key: "delete",
    value: function _delete() {
      Joi.object({
        params: Joi.object({
          id: Joi.number().min(1).integer().required()
        }),
        query: Joi.object({
          main_schet_id: Joi.number().min(1).integer().required()
        })
      }).options({
        stripUnknown: true
      });
    }
  }, {
    key: "cap",
    value: function cap() {
      return Joi.object({
        query: Joi.object({
          main_schet_id: Joi.number().required().min(1).integer(),
          from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required(),
          to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).required()
        })
      }).options({
        stripUnknown: true
      });
    }
  }]);
}();