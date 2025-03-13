"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _require = require('@main_schet/db'),
  MainSchetDB = _require.MainSchetDB;
var _require2 = require('@operatsii/db'),
  OperatsiiDB = _require2.OperatsiiDB;
var _require3 = require('@organization/db'),
  OrganizationDB = _require3.OrganizationDB;
var _require4 = require('@contract/db'),
  ContractDB = _require4.ContractDB;
var _require5 = require('@helper/functions'),
  checkSchetsEquality = _require5.checkSchetsEquality,
  tashkentTime = _require5.tashkentTime;
var _require6 = require('../spravochnik/podrazdelenie/db'),
  PodrazdelenieDB = _require6.PodrazdelenieDB;
var _require7 = require('../spravochnik/sostav/db'),
  SostavDB = _require7.SostavDB;
var _require8 = require('../spravochnik/type.operatsii/db'),
  TypeOperatsiiDB = _require8.TypeOperatsiiDB;
var _require9 = require('./db'),
  ShowServiceDB = _require9.ShowServiceDB;
var _require10 = require('@db/index'),
  db = _require10.db;
var _require11 = require('@gazna/service'),
  GaznaService = _require11.GaznaService;
var _require12 = require('@account_number/service'),
  AccountNumberService = _require12.AccountNumberService;
exports.Controller = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "createShowService",
    value: function () {
      var _createShowService = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
        var _req$body, doc_num, doc_date, opisanie, id_spravochnik_organization, shartnomalar_organization_id, spravochnik_operatsii_own_id, organization_by_raschet_schet_id, organization_by_raschet_schet_gazna_id, shartnoma_grafik_id, childs, region_id, user_id, main_schet_id, main_schet, operatsii, organization, contract, grafik, account_number, gazna, _iterator, _step, child, _operatsii, podrazdelenie, sostav, type_operatsii, operatsiis, summa, _iterator2, _step2, _child, doc;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _req$body = req.body, doc_num = _req$body.doc_num, doc_date = _req$body.doc_date, opisanie = _req$body.opisanie, id_spravochnik_organization = _req$body.id_spravochnik_organization, shartnomalar_organization_id = _req$body.shartnomalar_organization_id, spravochnik_operatsii_own_id = _req$body.spravochnik_operatsii_own_id, organization_by_raschet_schet_id = _req$body.organization_by_raschet_schet_id, organization_by_raschet_schet_gazna_id = _req$body.organization_by_raschet_schet_gazna_id, shartnoma_grafik_id = _req$body.shartnoma_grafik_id, childs = _req$body.childs;
              region_id = req.user.region_id;
              user_id = req.user.id;
              main_schet_id = req.query.main_schet_id;
              _context2.next = 6;
              return MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
            case 6:
              main_schet = _context2.sent;
              if (main_schet) {
                _context2.next = 9;
                break;
              }
              return _context2.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 9:
              _context2.next = 11;
              return OperatsiiDB.getById([spravochnik_operatsii_own_id], "general");
            case 11:
              operatsii = _context2.sent;
              if (operatsii) {
                _context2.next = 14;
                break;
              }
              return _context2.abrupt("return", res.error(req.i18n.t('operatsiiNotFound'), 404));
            case 14:
              _context2.next = 16;
              return OrganizationDB.getById([region_id, id_spravochnik_organization]);
            case 16:
              organization = _context2.sent;
              if (organization) {
                _context2.next = 19;
                break;
              }
              return _context2.abrupt("return", res.error(req.i18n.t('organizationNotFound'), 404));
            case 19:
              if (!(!shartnomalar_organization_id && shartnoma_grafik_id)) {
                _context2.next = 21;
                break;
              }
              return _context2.abrupt("return", res.error(req.i18n.t('contractNotFound'), 404));
            case 21:
              if (!shartnomalar_organization_id) {
                _context2.next = 31;
                break;
              }
              _context2.next = 24;
              return ContractDB.getById([region_id, shartnomalar_organization_id], false, main_schet.spravochnik_budjet_name_id, id_spravochnik_organization);
            case 24:
              contract = _context2.sent;
              if (!(!contract || contract.pudratchi_bool)) {
                _context2.next = 27;
                break;
              }
              return _context2.abrupt("return", res.error(req.i18n.t('contractNotFound'), 404));
            case 27:
              if (!shartnoma_grafik_id) {
                _context2.next = 31;
                break;
              }
              grafik = contract.grafiks.find(function (item) {
                return item.id === shartnoma_grafik_id;
              });
              if (grafik) {
                _context2.next = 31;
                break;
              }
              return _context2.abrupt("return", res.error(req.i18n.t('grafikNotFound'), 404));
            case 31:
              if (!organization_by_raschet_schet_id) {
                _context2.next = 37;
                break;
              }
              _context2.next = 34;
              return AccountNumberService.getById({
                organ_id: id_spravochnik_organization,
                id: organization_by_raschet_schet_id
              });
            case 34:
              account_number = _context2.sent;
              if (account_number) {
                _context2.next = 37;
                break;
              }
              return _context2.abrupt("return", res.error(req.i18n.t('account_number_not_found'), 404));
            case 37:
              if (!organization_by_raschet_schet_gazna_id) {
                _context2.next = 43;
                break;
              }
              _context2.next = 40;
              return GaznaService.getById({
                organ_id: id_spravochnik_organization,
                id: organization_by_raschet_schet_gazna_id
              });
            case 40:
              gazna = _context2.sent;
              if (gazna) {
                _context2.next = 43;
                break;
              }
              return _context2.abrupt("return", res.error(req.i18n.t('gazna_not_found'), 404));
            case 43:
              _iterator = _createForOfIteratorHelper(childs);
              _context2.prev = 44;
              _iterator.s();
            case 46:
              if ((_step = _iterator.n()).done) {
                _context2.next = 73;
                break;
              }
              child = _step.value;
              _context2.next = 50;
              return OperatsiiDB.getById([child.spravochnik_operatsii_id], "show_service", req.query.budjet_id);
            case 50:
              _operatsii = _context2.sent;
              if (_operatsii) {
                _context2.next = 53;
                break;
              }
              return _context2.abrupt("return", res.error(req.i18n.t('operatsiiNotFound'), 404));
            case 53:
              if (!child.id_spravochnik_podrazdelenie) {
                _context2.next = 59;
                break;
              }
              _context2.next = 56;
              return PodrazdelenieDB.getByIdPodrazdelenie([region_id, child.id_spravochnik_podrazdelenie]);
            case 56:
              podrazdelenie = _context2.sent;
              if (podrazdelenie) {
                _context2.next = 59;
                break;
              }
              return _context2.abrupt("return", res.error(req.i18n.t('podrazNotFound'), 404));
            case 59:
              if (!child.id_spravochnik_sostav) {
                _context2.next = 65;
                break;
              }
              _context2.next = 62;
              return SostavDB.getById([region_id, child.id_spravochnik_sostav]);
            case 62:
              sostav = _context2.sent;
              if (sostav) {
                _context2.next = 65;
                break;
              }
              return _context2.abrupt("return", res.error(req.i18n.t('sostavNotFound'), 404));
            case 65:
              if (!child.id_spravochnik_type_operatsii) {
                _context2.next = 71;
                break;
              }
              _context2.next = 68;
              return TypeOperatsiiDB.getById([region_id, child.id_spravochnik_type_operatsii]);
            case 68:
              type_operatsii = _context2.sent;
              if (type_operatsii) {
                _context2.next = 71;
                break;
              }
              return _context2.abrupt("return", res.error(req.i18n.t('typeOperatsiiNotFound'), 404));
            case 71:
              _context2.next = 46;
              break;
            case 73:
              _context2.next = 78;
              break;
            case 75:
              _context2.prev = 75;
              _context2.t0 = _context2["catch"](44);
              _iterator.e(_context2.t0);
            case 78:
              _context2.prev = 78;
              _iterator.f();
              return _context2.finish(78);
            case 81:
              _context2.next = 83;
              return OperatsiiDB.getOperatsiiByChildArray(childs, 'show_service');
            case 83:
              operatsiis = _context2.sent;
              if (checkSchetsEquality(operatsiis)) {
                _context2.next = 86;
                break;
              }
              return _context2.abrupt("return", res.error(req.i18n.t('schetDifferentError'), 400));
            case 86:
              summa = 0;
              _iterator2 = _createForOfIteratorHelper(childs);
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  _child = _step2.value;
                  summa += _child.kol * _child.sena;
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
              _context2.next = 91;
              return db.transaction(/*#__PURE__*/function () {
                var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(client) {
                  var result_childs, items;
                  return _regeneratorRuntime().wrap(function _callee$(_context) {
                    while (1) switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return ShowServiceDB.createShowService([user_id, spravochnik_operatsii_own_id, doc_num, doc_date, summa, opisanie, id_spravochnik_organization, shartnomalar_organization_id, main_schet_id, organization_by_raschet_schet_id, organization_by_raschet_schet_gazna_id, shartnoma_grafik_id, tashkentTime(), tashkentTime()], client);
                      case 2:
                        doc = _context.sent;
                        result_childs = childs.map(function (item) {
                          item.summa = item.kol * item.sena;
                          if (item.nds_foiz) {
                            item.nds_summa = item.nds_foiz / 100 * item.summa;
                          } else {
                            item.nds_summa = 0;
                          }
                          item.summa_s_nds = item.summa + item.nds_summa;
                          item.created_at = tashkentTime();
                          item.updated_at = tashkentTime();
                          item.main_schet_id = main_schet_id;
                          item.user_id = user_id;
                          item.spravochnik_operatsii_own_id = spravochnik_operatsii_own_id;
                          item.kursatilgan_hizmatlar_jur152_id = doc.id;
                          return item;
                        });
                        _context.next = 6;
                        return ShowServiceDB.createShowServiceChild(result_childs, client);
                      case 6:
                        items = _context.sent;
                        doc.childs = items;
                      case 8:
                      case "end":
                        return _context.stop();
                    }
                  }, _callee);
                }));
                return function (_x3) {
                  return _ref.apply(this, arguments);
                };
              }());
            case 91:
              return _context2.abrupt("return", res.success(req.i18n.t('createSuccess'), 201, null, doc));
            case 92:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[44, 75, 78, 81]]);
      }));
      function createShowService(_x, _x2) {
        return _createShowService.apply(this, arguments);
      }
      return createShowService;
    }()
  }, {
    key: "getShowService",
    value: function () {
      var _getShowService = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
        var region_id, _req$query, page, limit, from, to, main_schet_id, search, main_schet, offset, _yield$ShowServiceDB$, data, summa, total_count, page_summa, pageCount, meta;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              region_id = req.user.region_id;
              _req$query = req.query, page = _req$query.page, limit = _req$query.limit, from = _req$query.from, to = _req$query.to, main_schet_id = _req$query.main_schet_id, search = _req$query.search;
              _context3.next = 4;
              return MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
            case 4:
              main_schet = _context3.sent;
              if (main_schet) {
                _context3.next = 7;
                break;
              }
              return _context3.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 7:
              offset = (page - 1) * limit;
              _context3.next = 10;
              return ShowServiceDB.getShowService([region_id, from, to, main_schet_id, offset, limit], search);
            case 10:
              _yield$ShowServiceDB$ = _context3.sent;
              data = _yield$ShowServiceDB$.data;
              summa = _yield$ShowServiceDB$.summa;
              total_count = _yield$ShowServiceDB$.total_count;
              page_summa = 0;
              data.forEach(function (item) {
                page_summa += item.summa;
              });
              pageCount = Math.ceil(total_count / limit);
              meta = {
                pageCount: pageCount,
                count: total_count,
                currentPage: page,
                nextPage: page >= pageCount ? null : page + 1,
                backPage: page === 1 ? null : page - 1,
                summa: summa,
                page_summa: page_summa
              };
              return _context3.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, meta, data));
            case 19:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function getShowService(_x4, _x5) {
        return _getShowService.apply(this, arguments);
      }
      return getShowService;
    }()
  }, {
    key: "getByIdShowService",
    value: function () {
      var _getByIdShowService = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
        var main_schet_id, region_id, id, main_schet, result;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              main_schet_id = req.query.main_schet_id;
              region_id = req.user.region_id;
              id = req.params.id;
              _context4.next = 5;
              return MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
            case 5:
              main_schet = _context4.sent;
              if (main_schet) {
                _context4.next = 8;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 8:
              _context4.next = 10;
              return ShowServiceDB.getByIdShowService([region_id, id, main_schet_id], true);
            case 10:
              result = _context4.sent;
              if (result) {
                _context4.next = 13;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('docNotFound'), 404));
            case 13:
              return _context4.abrupt("return", res.error(req.i18n.t('getSuccess'), 200, null, result));
            case 14:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function getByIdShowService(_x6, _x7) {
        return _getByIdShowService.apply(this, arguments);
      }
      return getByIdShowService;
    }()
  }, {
    key: "updateShowService",
    value: function () {
      var _updateShowService = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
        var _req$body2, doc_num, doc_date, opisanie, id_spravochnik_organization, shartnomalar_organization_id, spravochnik_operatsii_own_id, childs, organization_by_raschet_schet_id, organization_by_raschet_schet_gazna_id, shartnoma_grafik_id, region_id, user_id, main_schet_id, id, old_data, main_schet, operatsii, organization, contract, grafik, account_number, gazna, _iterator3, _step3, child, _operatsii2, podrazdelenie, sostav, type_operatsii, operatsiis, summa, _iterator4, _step4, _child2, doc;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _req$body2 = req.body, doc_num = _req$body2.doc_num, doc_date = _req$body2.doc_date, opisanie = _req$body2.opisanie, id_spravochnik_organization = _req$body2.id_spravochnik_organization, shartnomalar_organization_id = _req$body2.shartnomalar_organization_id, spravochnik_operatsii_own_id = _req$body2.spravochnik_operatsii_own_id, childs = _req$body2.childs, organization_by_raschet_schet_id = _req$body2.organization_by_raschet_schet_id, organization_by_raschet_schet_gazna_id = _req$body2.organization_by_raschet_schet_gazna_id, shartnoma_grafik_id = _req$body2.shartnoma_grafik_id;
              region_id = req.user.region_id;
              user_id = req.user.id;
              main_schet_id = req.query.main_schet_id;
              id = req.params.id;
              _context6.next = 7;
              return ShowServiceDB.getByIdShowService([region_id, id, main_schet_id]);
            case 7:
              old_data = _context6.sent;
              if (old_data) {
                _context6.next = 10;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('docNotFound'), 404));
            case 10:
              _context6.next = 12;
              return MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
            case 12:
              main_schet = _context6.sent;
              if (main_schet) {
                _context6.next = 15;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 15:
              _context6.next = 17;
              return OperatsiiDB.getById([spravochnik_operatsii_own_id], "general");
            case 17:
              operatsii = _context6.sent;
              if (operatsii) {
                _context6.next = 20;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('operatsiiNotFound'), 404));
            case 20:
              _context6.next = 22;
              return OrganizationDB.getById([region_id, id_spravochnik_organization]);
            case 22:
              organization = _context6.sent;
              if (organization) {
                _context6.next = 25;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('organizationNotFound'), 404));
            case 25:
              if (!(!shartnomalar_organization_id && shartnoma_grafik_id)) {
                _context6.next = 27;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('contractNotFound'), 404));
            case 27:
              if (!shartnomalar_organization_id) {
                _context6.next = 37;
                break;
              }
              _context6.next = 30;
              return ContractDB.getById([region_id, shartnomalar_organization_id], false, main_schet.spravochnik_budjet_name_id, id_spravochnik_organization);
            case 30:
              contract = _context6.sent;
              if (!(!contract || contract.pudratchi_bool)) {
                _context6.next = 33;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('contractNotFound'), 404));
            case 33:
              if (!shartnoma_grafik_id) {
                _context6.next = 37;
                break;
              }
              grafik = contract.grafiks.find(function (item) {
                return item.id === shartnoma_grafik_id;
              });
              if (grafik) {
                _context6.next = 37;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('grafikNotFound'), 404));
            case 37:
              if (!organization_by_raschet_schet_id) {
                _context6.next = 43;
                break;
              }
              _context6.next = 40;
              return AccountNumberService.getById({
                organ_id: id_spravochnik_organization,
                id: organization_by_raschet_schet_id
              });
            case 40:
              account_number = _context6.sent;
              if (account_number) {
                _context6.next = 43;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('account_number_not_found'), 404));
            case 43:
              if (!organization_by_raschet_schet_gazna_id) {
                _context6.next = 49;
                break;
              }
              _context6.next = 46;
              return GaznaService.getById({
                organ_id: id_spravochnik_organization,
                id: organization_by_raschet_schet_gazna_id
              });
            case 46:
              gazna = _context6.sent;
              if (gazna) {
                _context6.next = 49;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('gazna_not_found'), 404));
            case 49:
              _iterator3 = _createForOfIteratorHelper(childs);
              _context6.prev = 50;
              _iterator3.s();
            case 52:
              if ((_step3 = _iterator3.n()).done) {
                _context6.next = 79;
                break;
              }
              child = _step3.value;
              _context6.next = 56;
              return OperatsiiDB.getById([child.spravochnik_operatsii_id], "show_service", req.query.budjet_id);
            case 56:
              _operatsii2 = _context6.sent;
              if (_operatsii2) {
                _context6.next = 59;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('operatsiiNotFound'), 404));
            case 59:
              if (!child.id_spravochnik_podrazdelenie) {
                _context6.next = 65;
                break;
              }
              _context6.next = 62;
              return PodrazdelenieDB.getByIdPodrazdelenie([region_id, child.id_spravochnik_podrazdelenie]);
            case 62:
              podrazdelenie = _context6.sent;
              if (podrazdelenie) {
                _context6.next = 65;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('podrazNotFound'), 404));
            case 65:
              if (!child.id_spravochnik_sostav) {
                _context6.next = 71;
                break;
              }
              _context6.next = 68;
              return SostavDB.getById([region_id, child.id_spravochnik_sostav]);
            case 68:
              sostav = _context6.sent;
              if (sostav) {
                _context6.next = 71;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('sostavNotFound'), 404));
            case 71:
              if (!child.id_spravochnik_type_operatsii) {
                _context6.next = 77;
                break;
              }
              _context6.next = 74;
              return TypeOperatsiiDB.getById([region_id, child.id_spravochnik_type_operatsii]);
            case 74:
              type_operatsii = _context6.sent;
              if (type_operatsii) {
                _context6.next = 77;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('typeOperatsiiNotFound'), 404));
            case 77:
              _context6.next = 52;
              break;
            case 79:
              _context6.next = 84;
              break;
            case 81:
              _context6.prev = 81;
              _context6.t0 = _context6["catch"](50);
              _iterator3.e(_context6.t0);
            case 84:
              _context6.prev = 84;
              _iterator3.f();
              return _context6.finish(84);
            case 87:
              _context6.next = 89;
              return OperatsiiDB.getOperatsiiByChildArray(childs, 'show_service');
            case 89:
              operatsiis = _context6.sent;
              if (checkSchetsEquality(operatsiis)) {
                _context6.next = 92;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('schetDifferentError'), 400));
            case 92:
              summa = 0;
              _iterator4 = _createForOfIteratorHelper(childs);
              try {
                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                  _child2 = _step4.value;
                  summa += _child2.kol * _child2.sena;
                }
              } catch (err) {
                _iterator4.e(err);
              } finally {
                _iterator4.f();
              }
              _context6.next = 97;
              return db.transaction(/*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(client) {
                  var result_childs, items;
                  return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                    while (1) switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return ShowServiceDB.updateShowService([doc_num, doc_date, opisanie, summa, id_spravochnik_organization, shartnomalar_organization_id, spravochnik_operatsii_own_id, tashkentTime(), organization_by_raschet_schet_id, organization_by_raschet_schet_gazna_id, shartnoma_grafik_id, id], client);
                      case 2:
                        doc = _context5.sent;
                        _context5.next = 5;
                        return ShowServiceDB.deleteShowServiceChild([id], client);
                      case 5:
                        result_childs = childs.map(function (item) {
                          item.summa = item.kol * item.sena;
                          if (item.nds_foiz) {
                            item.nds_summa = item.nds_foiz / 100 * item.summa;
                          } else {
                            item.nds_summa = 0;
                          }
                          item.summa_s_nds = item.summa + item.nds_summa;
                          item.created_at = tashkentTime();
                          item.updated_at = tashkentTime();
                          item.main_schet_id = main_schet_id;
                          item.user_id = user_id;
                          item.spravochnik_operatsii_own_id = spravochnik_operatsii_own_id;
                          item.kursatilgan_hizmatlar_jur152_id = doc.id;
                          return item;
                        });
                        _context5.next = 8;
                        return ShowServiceDB.createShowServiceChild(result_childs, client);
                      case 8:
                        items = _context5.sent;
                        doc.childs = items;
                      case 10:
                      case "end":
                        return _context5.stop();
                    }
                  }, _callee5);
                }));
                return function (_x10) {
                  return _ref2.apply(this, arguments);
                };
              }());
            case 97:
              return _context6.abrupt("return", res.success(req.i18n.t('createSuccess'), 201, null, doc));
            case 98:
            case "end":
              return _context6.stop();
          }
        }, _callee6, null, [[50, 81, 84, 87]]);
      }));
      function updateShowService(_x8, _x9) {
        return _updateShowService.apply(this, arguments);
      }
      return updateShowService;
    }()
  }, {
    key: "deleteShowService",
    value: function () {
      var _deleteShowService = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
        var main_schet_id, region_id, id, main_schet, result, data;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              main_schet_id = req.query.main_schet_id;
              region_id = req.user.region_id;
              id = req.params.id;
              _context8.next = 5;
              return MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
            case 5:
              main_schet = _context8.sent;
              if (main_schet) {
                _context8.next = 8;
                break;
              }
              return _context8.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 8:
              _context8.next = 10;
              return ShowServiceDB.getByIdShowService([region_id, id, main_schet_id]);
            case 10:
              result = _context8.sent;
              if (result) {
                _context8.next = 13;
                break;
              }
              return _context8.abrupt("return", res.error(req.i18n.t('docNotFound'), 404));
            case 13:
              _context8.next = 15;
              return db.transaction(/*#__PURE__*/function () {
                var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(client) {
                  var docId;
                  return _regeneratorRuntime().wrap(function _callee7$(_context7) {
                    while (1) switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return ShowServiceDB.deleteShowService([id], client);
                      case 2:
                        docId = _context7.sent;
                        return _context7.abrupt("return", docId);
                      case 4:
                      case "end":
                        return _context7.stop();
                    }
                  }, _callee7);
                }));
                return function (_x13) {
                  return _ref3.apply(this, arguments);
                };
              }());
            case 15:
              data = _context8.sent;
              return _context8.abrupt("return", res.success(req.i18n.t('deleteSuccess'), 200, null, data));
            case 17:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      }));
      function deleteShowService(_x11, _x12) {
        return _deleteShowService.apply(this, arguments);
      }
      return deleteShowService;
    }()
  }]);
}();