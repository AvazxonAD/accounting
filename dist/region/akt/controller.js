"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
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
var _require = require('@helper/functions'),
  checkSchetsEquality = _require.checkSchetsEquality;
var _require2 = require('../spravochnik/podrazdelenie/service'),
  PodrazdelenieService = _require2.PodrazdelenieService;
var _require3 = require('@main_schet/service'),
  MainSchetService = _require3.MainSchetService;
var _require4 = require('./service'),
  AktService = _require4.AktService;
var _require5 = require('@contract/service'),
  ContractService = _require5.ContractService;
var _require6 = require('@operatsii/service'),
  OperatsiiService = _require6.OperatsiiService;
var _require7 = require('@organization/service'),
  OrganizationService = _require7.OrganizationService;
var _require8 = require('../spravochnik/sostav/service'),
  SostavService = _require8.SostavService;
var _require9 = require('../spravochnik/type.operatsii/service'),
  TypeOperatsiiService = _require9.TypeOperatsiiService;
var _require10 = require('@gazna/service'),
  GaznaService = _require10.GaznaService;
var _require11 = require('@account_number/service'),
  AccountNumberService = _require11.AccountNumberService;
var _require12 = require('@region/service'),
  RegionService = _require12.RegionService;
exports.Controller = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "create",
    value: function () {
      var _create = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
        var _req$body, id_spravochnik_organization, shartnomalar_organization_id, spravochnik_operatsii_own_id, childs, organization_by_raschet_schet_id, organization_by_raschet_schet_gazna_id, shartnoma_grafik_id, region_id, user_id, main_schet_id, main_schet, operatsii, organization, contract, grafik, account_number, gazna, operatsiis, _iterator, _step, child, _operatsii, podraz, sostav, _operatsii2, result;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _req$body = req.body, id_spravochnik_organization = _req$body.id_spravochnik_organization, shartnomalar_organization_id = _req$body.shartnomalar_organization_id, spravochnik_operatsii_own_id = _req$body.spravochnik_operatsii_own_id, childs = _req$body.childs, organization_by_raschet_schet_id = _req$body.organization_by_raschet_schet_id, organization_by_raschet_schet_gazna_id = _req$body.organization_by_raschet_schet_gazna_id, shartnoma_grafik_id = _req$body.shartnoma_grafik_id;
              region_id = req.user.region_id;
              user_id = req.user.id;
              main_schet_id = req.query.main_schet_id;
              _context.next = 6;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 6:
              main_schet = _context.sent;
              if (main_schet) {
                _context.next = 9;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 9:
              _context.next = 11;
              return OperatsiiService.getById({
                id: spravochnik_operatsii_own_id,
                type: "general"
              });
            case 11:
              operatsii = _context.sent;
              if (operatsii) {
                _context.next = 14;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('operatsiiNotFound'), 404));
            case 14:
              _context.next = 16;
              return OrganizationService.getById({
                region_id: region_id,
                id: id_spravochnik_organization
              });
            case 16:
              organization = _context.sent;
              if (organization) {
                _context.next = 19;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('organizationNotFound'), 404));
            case 19:
              if (!(!shartnomalar_organization_id && shartnoma_grafik_id)) {
                _context.next = 21;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('contractNotFound'), 404));
            case 21:
              if (!shartnomalar_organization_id) {
                _context.next = 31;
                break;
              }
              _context.next = 24;
              return ContractService.getById({
                region_id: region_id,
                id: shartnomalar_organization_id
              });
            case 24:
              contract = _context.sent;
              if (!(!contract || !contract.pudratchi_bool)) {
                _context.next = 27;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('contractNotFound'), 404));
            case 27:
              if (!shartnoma_grafik_id) {
                _context.next = 31;
                break;
              }
              grafik = contract.grafiks.find(function (item) {
                return item.id === shartnoma_grafik_id;
              });
              if (grafik) {
                _context.next = 31;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('grafikNotFound'), 404));
            case 31:
              if (!organization_by_raschet_schet_id) {
                _context.next = 37;
                break;
              }
              _context.next = 34;
              return AccountNumberService.getById({
                organ_id: id_spravochnik_organization,
                id: organization_by_raschet_schet_id
              });
            case 34:
              account_number = _context.sent;
              if (account_number) {
                _context.next = 37;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('account_number_not_found'), 404));
            case 37:
              if (!organization_by_raschet_schet_gazna_id) {
                _context.next = 43;
                break;
              }
              _context.next = 40;
              return GaznaService.getById({
                organ_id: id_spravochnik_organization,
                id: organization_by_raschet_schet_gazna_id
              });
            case 40:
              gazna = _context.sent;
              if (gazna) {
                _context.next = 43;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('gazna_not_found'), 404));
            case 43:
              operatsiis = [];
              _iterator = _createForOfIteratorHelper(childs);
              _context.prev = 45;
              _iterator.s();
            case 47:
              if ((_step = _iterator.n()).done) {
                _context.next = 76;
                break;
              }
              child = _step.value;
              _context.next = 51;
              return OperatsiiService.getById({
                id: child.spravochnik_operatsii_id,
                type: "akt"
              });
            case 51:
              _operatsii = _context.sent;
              if (_operatsii) {
                _context.next = 54;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('operatsiiNotFound'), 404));
            case 54:
              operatsiis.push(_operatsii);
              if (!child.id_spravochnik_podrazdelenie) {
                _context.next = 61;
                break;
              }
              _context.next = 58;
              return PodrazdelenieService.getById({
                region_id: region_id,
                id: child.id_spravochnik_podrazdelenie
              });
            case 58:
              podraz = _context.sent;
              if (podraz) {
                _context.next = 61;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('podrazNotFound'), 404));
            case 61:
              if (!child.id_spravochnik_sostav) {
                _context.next = 67;
                break;
              }
              _context.next = 64;
              return SostavService.getById({
                region_id: region_id,
                id: child.id_spravochnik_sostav
              });
            case 64:
              sostav = _context.sent;
              if (sostav) {
                _context.next = 67;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('sostavNotFound'), 404));
            case 67:
              if (!child.id_spravochnik_type_operatsii) {
                _context.next = 73;
                break;
              }
              _context.next = 70;
              return TypeOperatsiiService.getById({
                id: child.id_spravochnik_type_operatsii,
                region_id: region_id
              });
            case 70:
              _operatsii2 = _context.sent;
              if (_operatsii2) {
                _context.next = 73;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('typeOperatsiiNotFound'), 404));
            case 73:
              child.summa = child.kol * child.sena;
            case 74:
              _context.next = 47;
              break;
            case 76:
              _context.next = 81;
              break;
            case 78:
              _context.prev = 78;
              _context.t0 = _context["catch"](45);
              _iterator.e(_context.t0);
            case 81:
              _context.prev = 81;
              _iterator.f();
              return _context.finish(81);
            case 84:
              if (checkSchetsEquality(operatsiis)) {
                _context.next = 86;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('schetDifferentError'), 400));
            case 86:
              _context.next = 88;
              return AktService.create(_objectSpread(_objectSpread({}, req.body), {}, {
                user_id: user_id,
                main_schet_id: main_schet_id
              }));
            case 88:
              result = _context.sent;
              return _context.abrupt("return", res.success(req.i18n.t('createSuccess'), 201, null, result));
            case 90:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[45, 78, 81, 84]]);
      }));
      function create(_x, _x2) {
        return _create.apply(this, arguments);
      }
      return create;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
        var region_id, _req$query, page, limit, from, to, main_schet_id, search, main_schet, offset, _yield$AktService$get, summa, total, data, page_summa, pageCount, meta;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              region_id = req.user.region_id;
              _req$query = req.query, page = _req$query.page, limit = _req$query.limit, from = _req$query.from, to = _req$query.to, main_schet_id = _req$query.main_schet_id, search = _req$query.search;
              _context2.next = 4;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 4:
              main_schet = _context2.sent;
              if (main_schet) {
                _context2.next = 7;
                break;
              }
              return _context2.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 7:
              offset = (page - 1) * limit;
              _context2.next = 10;
              return AktService.get({
                region_id: region_id,
                main_schet_id: main_schet_id,
                from: from,
                to: to,
                offset: offset,
                limit: limit,
                search: search
              });
            case 10:
              _yield$AktService$get = _context2.sent;
              summa = _yield$AktService$get.summa;
              total = _yield$AktService$get.total;
              data = _yield$AktService$get.data;
              page_summa = _yield$AktService$get.page_summa;
              pageCount = Math.ceil(total / limit);
              meta = {
                pageCount: pageCount,
                count: total,
                currentPage: page,
                nextPage: page >= pageCount ? null : page + 1,
                backPage: page === 1 ? null : page - 1,
                summa: summa,
                page_summa: page_summa
              };
              return _context2.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, meta, data));
            case 18:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function get(_x3, _x4) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
  }, {
    key: "getById",
    value: function () {
      var _getById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
        var main_schet_id, region_id, id, main_schet, result;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              main_schet_id = req.query.main_schet_id;
              region_id = req.user.region_id;
              id = req.params.id;
              _context3.next = 5;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 5:
              main_schet = _context3.sent;
              if (main_schet) {
                _context3.next = 8;
                break;
              }
              return _context3.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 8:
              _context3.next = 10;
              return AktService.getById({
                region_id: region_id,
                main_schet_id: main_schet_id,
                id: id
              });
            case 10:
              result = _context3.sent;
              if (result) {
                _context3.next = 13;
                break;
              }
              return _context3.abrupt("return", res.error(req.i18n.t('docNotFound'), 404));
            case 13:
              return _context3.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, null, result));
            case 14:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function getById(_x5, _x6) {
        return _getById.apply(this, arguments);
      }
      return getById;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
        var _req$body2, id_spravochnik_organization, shartnomalar_organization_id, spravochnik_operatsii_own_id, childs, organization_by_raschet_schet_id, organization_by_raschet_schet_gazna_id, shartnoma_grafik_id, region_id, user_id, main_schet_id, id, old_data, main_schet, operatsii, organization, contract, grafik, account_number, gazna, operatsiis, _iterator2, _step2, child, _operatsii3, podraz, sostav, _operatsii4, result;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _req$body2 = req.body, id_spravochnik_organization = _req$body2.id_spravochnik_organization, shartnomalar_organization_id = _req$body2.shartnomalar_organization_id, spravochnik_operatsii_own_id = _req$body2.spravochnik_operatsii_own_id, childs = _req$body2.childs, organization_by_raschet_schet_id = _req$body2.organization_by_raschet_schet_id, organization_by_raschet_schet_gazna_id = _req$body2.organization_by_raschet_schet_gazna_id, shartnoma_grafik_id = _req$body2.shartnoma_grafik_id;
              region_id = req.user.region_id;
              user_id = req.user.id;
              main_schet_id = req.query.main_schet_id;
              id = req.params.id;
              _context4.next = 7;
              return AktService.getById({
                region_id: region_id,
                main_schet_id: main_schet_id,
                id: id
              });
            case 7:
              old_data = _context4.sent;
              if (old_data) {
                _context4.next = 10;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('docNotFound'), 404));
            case 10:
              _context4.next = 12;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 12:
              main_schet = _context4.sent;
              if (main_schet) {
                _context4.next = 15;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 15:
              _context4.next = 17;
              return OperatsiiService.getById({
                id: spravochnik_operatsii_own_id,
                type: "general"
              });
            case 17:
              operatsii = _context4.sent;
              if (operatsii) {
                _context4.next = 20;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('operatsiiNotFound'), 404));
            case 20:
              _context4.next = 22;
              return OrganizationService.getById({
                region_id: region_id,
                id: id_spravochnik_organization
              });
            case 22:
              organization = _context4.sent;
              if (organization) {
                _context4.next = 25;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('organizationNotFound'), 404));
            case 25:
              if (!(!shartnomalar_organization_id && shartnoma_grafik_id)) {
                _context4.next = 27;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('contractNotFound'), 404));
            case 27:
              if (!shartnomalar_organization_id) {
                _context4.next = 37;
                break;
              }
              _context4.next = 30;
              return ContractService.getById({
                region_id: region_id,
                id: shartnomalar_organization_id
              });
            case 30:
              contract = _context4.sent;
              if (!(!contract || !contract.pudratchi_bool)) {
                _context4.next = 33;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('contractNotFound'), 404));
            case 33:
              if (!shartnoma_grafik_id) {
                _context4.next = 37;
                break;
              }
              grafik = contract.grafiks.find(function (item) {
                return item.id === shartnoma_grafik_id;
              });
              if (grafik) {
                _context4.next = 37;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('grafikNotFound'), 404));
            case 37:
              if (!organization_by_raschet_schet_id) {
                _context4.next = 43;
                break;
              }
              _context4.next = 40;
              return AccountNumberService.getById({
                organ_id: id_spravochnik_organization,
                id: organization_by_raschet_schet_id
              });
            case 40:
              account_number = _context4.sent;
              if (account_number) {
                _context4.next = 43;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('account_number_not_found'), 404));
            case 43:
              if (!organization_by_raschet_schet_gazna_id) {
                _context4.next = 49;
                break;
              }
              _context4.next = 46;
              return GaznaService.getById({
                organ_id: id_spravochnik_organization,
                id: organization_by_raschet_schet_gazna_id
              });
            case 46:
              gazna = _context4.sent;
              if (gazna) {
                _context4.next = 49;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('gazna_not_found'), 404));
            case 49:
              operatsiis = [];
              _iterator2 = _createForOfIteratorHelper(childs);
              _context4.prev = 51;
              _iterator2.s();
            case 53:
              if ((_step2 = _iterator2.n()).done) {
                _context4.next = 82;
                break;
              }
              child = _step2.value;
              _context4.next = 57;
              return OperatsiiService.getById({
                id: child.spravochnik_operatsii_id,
                type: "akt"
              });
            case 57:
              _operatsii3 = _context4.sent;
              if (_operatsii3) {
                _context4.next = 60;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('operatsiiNotFound'), 404));
            case 60:
              operatsiis.push(_operatsii3);
              if (!child.id_spravochnik_podrazdelenie) {
                _context4.next = 67;
                break;
              }
              _context4.next = 64;
              return PodrazdelenieService.getById({
                region_id: region_id,
                id: child.id_spravochnik_podrazdelenie
              });
            case 64:
              podraz = _context4.sent;
              if (podraz) {
                _context4.next = 67;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('podrazNotFound'), 404));
            case 67:
              if (!child.id_spravochnik_sostav) {
                _context4.next = 73;
                break;
              }
              _context4.next = 70;
              return SostavService.getById({
                region_id: region_id,
                id: child.id_spravochnik_sostav
              });
            case 70:
              sostav = _context4.sent;
              if (sostav) {
                _context4.next = 73;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('sostavNotFound'), 404));
            case 73:
              if (!child.id_spravochnik_type_operatsii) {
                _context4.next = 79;
                break;
              }
              _context4.next = 76;
              return TypeOperatsiiService.getById({
                id: child.id_spravochnik_type_operatsii,
                region_id: region_id
              });
            case 76:
              _operatsii4 = _context4.sent;
              if (_operatsii4) {
                _context4.next = 79;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('typeOperatsiiNotFound'), 404));
            case 79:
              child.summa = child.kol * child.sena;
            case 80:
              _context4.next = 53;
              break;
            case 82:
              _context4.next = 87;
              break;
            case 84:
              _context4.prev = 84;
              _context4.t0 = _context4["catch"](51);
              _iterator2.e(_context4.t0);
            case 87:
              _context4.prev = 87;
              _iterator2.f();
              return _context4.finish(87);
            case 90:
              if (checkSchetsEquality(operatsiis)) {
                _context4.next = 92;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('schetDifferentError'), 400));
            case 92:
              _context4.next = 94;
              return AktService.update(_objectSpread(_objectSpread({
                main_schet_id: main_schet_id,
                user_id: user_id
              }, req.body), {}, {
                id: id
              }));
            case 94:
              result = _context4.sent;
              return _context4.abrupt("return", res.success(req.i18n.t('updateSuccess'), 200, null, result));
            case 96:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[51, 84, 87, 90]]);
      }));
      function update(_x7, _x8) {
        return _update.apply(this, arguments);
      }
      return update;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
        var main_schet_id, region_id, id, main_schet, doc, result;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              main_schet_id = req.query.main_schet_id;
              region_id = req.user.region_id;
              id = req.params.id;
              _context5.next = 5;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 5:
              main_schet = _context5.sent;
              if (main_schet) {
                _context5.next = 8;
                break;
              }
              return _context5.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 8:
              _context5.next = 10;
              return AktService.getById({
                region_id: region_id,
                main_schet_id: main_schet_id,
                id: id
              });
            case 10:
              doc = _context5.sent;
              if (doc) {
                _context5.next = 13;
                break;
              }
              return _context5.abrupt("return", res.error(req.i18n.t('docNotFound'), 404));
            case 13:
              _context5.next = 15;
              return AktService["delete"]({
                id: id
              });
            case 15:
              result = _context5.sent;
              return _context5.abrupt("return", res.success(req.i18n.t('deleteSuccess'), 200, null, result));
            case 17:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      function _delete(_x9, _x10) {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }()
  }, {
    key: "cap",
    value: function () {
      var _cap = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
        var region_id, region, _req$query2, from, to, main_schet_id, main_schet, schets, _yield$AktService$cap, fileName, filePath;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              region_id = req.user.region_id;
              _context6.next = 3;
              return RegionService.getById({
                id: region_id
              });
            case 3:
              region = _context6.sent;
              _req$query2 = req.query, from = _req$query2.from, to = _req$query2.to, main_schet_id = _req$query2.main_schet_id;
              _context6.next = 7;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 7:
              main_schet = _context6.sent;
              if (main_schet) {
                _context6.next = 10;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 10:
              _context6.next = 12;
              return AktService.getSchets({
                region_id: region_id,
                main_schet_id: main_schet_id,
                from: from,
                to: to
              });
            case 12:
              schets = _context6.sent;
              _context6.next = 15;
              return AktService.capExcel(_objectSpread(_objectSpread({}, req.query), {}, {
                region_id: region_id,
                schets: schets,
                region: region
              }));
            case 15:
              _yield$AktService$cap = _context6.sent;
              fileName = _yield$AktService$cap.fileName;
              filePath = _yield$AktService$cap.filePath;
              res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
              res.setHeader('Content-Disposition', "attachment; filename=\"".concat(fileName, "\""));
              return _context6.abrupt("return", res.sendFile(filePath));
            case 21:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      function cap(_x11, _x12) {
        return _cap.apply(this, arguments);
      }
      return cap;
    }()
  }]);
}();