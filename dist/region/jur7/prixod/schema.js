"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Joi = require('joi');
exports.PrixodJur7Schema = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "readFile",
    value: function readFile() {
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
          doc_num: Joi.string().trim(),
          doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
          j_o_num: Joi.string().trim(),
          opisanie: Joi.string().trim(),
          doverennost: Joi.string().trim(),
          kimdan_id: Joi.number().integer().min(1).required(),
          kimdan_name: Joi.string().trim().allow(null),
          kimga_id: Joi.number().integer().min(1).required(),
          kimga_name: Joi.string().trim().allow(null),
          id_shartnomalar_organization: Joi.number().min(1).integer().allow(null),
          organization_by_raschet_schet_id: Joi.number().min(1).integer().allow(null),
          organization_by_raschet_schet_gazna_id: Joi.number().min(1).integer().allow(null),
          shartnoma_grafik_id: Joi.number().min(1).integer().allow(null),
          childs: Joi.array().required().items(Joi.object({
            group_jur7_id: Joi.number().required(),
            iznos_start: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
            kol: Joi.number().min(1).required(),
            sena: Joi.number().min(1).required(),
            nds_foiz: Joi.number().min(1).allow(0).max(99)["default"](0),
            debet_schet: Joi.string().trim(),
            debet_sub_schet: Joi.string().trim(),
            kredit_schet: Joi.string().trim(),
            kredit_sub_schet: Joi.string().trim(),
            data_pereotsenka: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
            iznos: Joi["boolean"]().required(),
            name: Joi.string().trim().required(),
            edin: Joi.string().trim().required(),
            inventar_num: Joi.string().trim(),
            serial_num: Joi.string().trim(),
            eski_iznos_summa: Joi.number().min(0)["default"](0),
            iznos_schet: Joi.string().trim().allow(''),
            iznos_sub_schet: Joi.string().trim().allow('')
          }))
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
    key: "update",
    value: function update() {
      return Joi.object({
        body: Joi.object({
          doc_num: Joi.string().trim(),
          doc_date: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
          j_o_num: Joi.string().trim(),
          opisanie: Joi.string().trim(),
          doverennost: Joi.string().trim(),
          kimdan_id: Joi.number().integer().min(1).required(),
          kimdan_name: Joi.string().trim().allow(null),
          kimga_id: Joi.number().integer().min(1).required(),
          kimga_name: Joi.string().trim().allow(null),
          id_shartnomalar_organization: Joi.number().min(1).integer().allow(null),
          organization_by_raschet_schet_id: Joi.number().min(1).integer().allow(null),
          organization_by_raschet_schet_gazna_id: Joi.number().min(1).integer().allow(null),
          shartnoma_grafik_id: Joi.number().min(1).integer().allow(null),
          childs: Joi.array().required().items(Joi.object({
            group_jur7_id: Joi.number().required(),
            iznos_start: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
            kol: Joi.number().min(1).required(),
            sena: Joi.number().min(1).required(),
            nds_foiz: Joi.number().min(1).allow(0).max(99)["default"](0),
            debet_schet: Joi.string().trim(),
            debet_sub_schet: Joi.string().trim(),
            kredit_schet: Joi.string().trim(),
            kredit_sub_schet: Joi.string().trim(),
            data_pereotsenka: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
            iznos: Joi["boolean"]().required(),
            name: Joi.string().trim().required(),
            edin: Joi.string().trim().required(),
            inventar_num: Joi.string().trim(),
            serial_num: Joi.string().trim(),
            eski_iznos_summa: Joi.number().min(0)["default"](0),
            iznos_schet: Joi.string().trim().allow(''),
            iznos_sub_schet: Joi.string().trim().allow('')
          }))
        }),
        params: Joi.object({
          id: Joi.number().integer().min(1).required()
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
    key: "get",
    value: function get() {
      return Joi.object({
        query: Joi.object({
          page: Joi.number().integer().min(1)["default"](1),
          limit: Joi.number().integer().min(1)["default"](10),
          search: Joi.string().trim().allow(null, ''),
          from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
          to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
          main_schet_id: Joi.number().integer().min(1).required(),
          orderBy: Joi.string().trim()["default"]('DESC').valid('ASC', 'DESC'),
          orderType: Joi.string().trim()["default"]('doc_num').valid('doc_num', 'doc_date')
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
          id: Joi.number().integer().min(1).required()
        }),
        query: Joi.object({
          main_schet_id: Joi.number().integer().min(1).required()
        })
      }).options({
        stripUnknown: true
      });
    }
  }, {
    key: "rasxodDocs",
    value: function rasxodDocs() {
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
        params: Joi.object({
          id: Joi.number().integer().min(1).required()
        }),
        query: Joi.object({
          main_schet_id: Joi.number().integer().min(1).required()
        })
      }).options({
        stripUnknown: true
      });
    }
  }, {
    key: "report",
    value: function report() {
      return Joi.object({
        query: Joi.object({
          from: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
          to: Joi.string().trim().pattern(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
          main_schet_id: Joi.number().integer().min(1).required()
        })
      }).options({
        stripUnknown: true
      });
    }
  }, {
    key: "import",
    value: function _import(lang) {
      return Joi.object(_defineProperty(_defineProperty({
        nds_foiz: Joi.number().min(1).required().messages({
          '*': lang.t('validation.ndsFoiz')
        }),
        group_jur7_id: Joi.number().required().messages({
          '*': lang.t('validation.groupId')
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
        inventar_num: Joi.any().messages({
          '*': lang.t('validation.inventarNum')
        }),
        serial_num: Joi.any().messages({
          '*': lang.t('validation.serialNum')
        }),
        iznos: Joi.any().messages({
          '*': lang.t('validation.iznos')
        })
      }, "nds_foiz", Joi.number().min(0).max(99).messages({
        '*': lang.t('validation.ndsFoiz')
      })), "eski_iznos_summa", Joi.number().min(0)["default"](0).messages({
        '*': lang.t('validation.eskiIznosSumma')
      }))).options({
        stripUnknown: true
      });
    }
  }, {
    key: "importSchema2",
    value: function importSchema2() {
      return Joi.object({
        query: Joi.object({
          main_schet_id: Joi.number().integer().min(1).required(),
          budjet_id: Joi.number().integer().min(1).required()
        })
      });
    }
  }]);
}();