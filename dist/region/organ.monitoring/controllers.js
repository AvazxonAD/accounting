"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _require = require('./services'),
  OrganizationmonitoringService = _require.OrganizationmonitoringService;
var _require2 = require('@main_schet/service'),
  MainSchetService = _require2.MainSchetService;
var _require3 = require('@organization/service'),
  OrganizationService = _require3.OrganizationService;
var _require4 = require('@budjet/service'),
  BudjetService = _require4.BudjetService;
var _require5 = require('@contract/service'),
  ContractService = _require5.ContractService;
var _require6 = require('@region/db'),
  RegionDB = _require6.RegionDB;
var _require7 = require('@main_schet/db'),
  MainSchetDB = _require7.MainSchetDB;
var _require8 = require('@organization/db'),
  OrganizationDB = _require8.OrganizationDB;
var _require9 = require('./db'),
  OrganizationMonitoringDB = _require9.OrganizationMonitoringDB;
exports.Controller = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "monitoring",
    value: function () {
      var _monitoring = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
        var region_id, query, page, limit, organ_id, offset, main_schet, organization, _yield$Organizationmo, data, summa_from, page_rasxod_sum, page_prixod_sum, summa_to, total, summa, page_total_sum, prixod_sum, rasxod_sum, total_sum, pageCount, meta;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              region_id = req.user.region_id;
              query = req.query;
              page = query.page, limit = query.limit, organ_id = query.organ_id;
              offset = (query.page - 1) * limit;
              _context.next = 6;
              return MainSchetService.getById({
                region_id: region_id,
                id: query.main_schet_id
              });
            case 6:
              main_schet = _context.sent;
              if (main_schet) {
                _context.next = 9;
                break;
              }
              return _context.abrupt("return", res.error('main shcet not found', 404));
            case 9:
              if (!organ_id) {
                _context.next = 14;
                break;
              }
              _context.next = 12;
              return OrganizationService.getById({
                region_id: region_id,
                id: organ_id,
                isdeleted: false
              });
            case 12:
              organization = _context.sent;
              if (!organization) {
                res.error('Organization not found', 404);
              }
            case 14:
              _context.next = 16;
              return OrganizationmonitoringService.monitoring(_objectSpread(_objectSpread({}, query), {}, {
                offset: offset,
                region_id: region_id,
                organ_id: organ_id
              }));
            case 16:
              _yield$Organizationmo = _context.sent;
              data = _yield$Organizationmo.data;
              summa_from = _yield$Organizationmo.summa_from;
              page_rasxod_sum = _yield$Organizationmo.page_rasxod_sum;
              page_prixod_sum = _yield$Organizationmo.page_prixod_sum;
              summa_to = _yield$Organizationmo.summa_to;
              total = _yield$Organizationmo.total;
              summa = _yield$Organizationmo.summa;
              page_total_sum = _yield$Organizationmo.page_total_sum;
              prixod_sum = _yield$Organizationmo.prixod_sum;
              rasxod_sum = _yield$Organizationmo.rasxod_sum;
              total_sum = _yield$Organizationmo.total_sum;
              pageCount = Math.ceil(total / limit);
              meta = {
                pageCount: pageCount,
                count: total,
                currentPage: page,
                nextPage: page >= pageCount ? null : page + 1,
                backPage: page === 1 ? null : page - 1,
                page_prixod_sum: page_prixod_sum,
                page_rasxod_sum: page_rasxod_sum,
                page_total_sum: page_total_sum,
                summa_from_object: summa_from,
                summa_from: summa_from.summa,
                summa_to_object: summa_to,
                summa_to: summa_to.summa,
                prixod_sum: prixod_sum,
                rasxod_sum: rasxod_sum,
                total_sum: total_sum,
                summa_object: summa
              };
              return _context.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, meta, data));
            case 31:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function monitoring(_x, _x2) {
        return _monitoring.apply(this, arguments);
      }
      return monitoring;
    }()
  }, {
    key: "prixodRasxod",
    value: function () {
      var _prixodRasxod = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
        var region_id, query, budjet, main_schet, _yield$OrganizationSe, organizations, data, filePath;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              region_id = req.user.region_id;
              query = req.query;
              _context2.next = 4;
              return BudjetService.getById({
                id: query.budjet_id
              });
            case 4:
              budjet = _context2.sent;
              if (budjet) {
                _context2.next = 7;
                break;
              }
              return _context2.abrupt("return", res.error(req.i18n.t('budjetNotFound'), 404));
            case 7:
              _context2.next = 9;
              return MainSchetService.getById({
                region_id: region_id,
                id: query.main_schet_id
              });
            case 9:
              main_schet = _context2.sent;
              if (main_schet) {
                _context2.next = 12;
                break;
              }
              return _context2.abrupt("return", res.error('main shcet not found', 404));
            case 12:
              _context2.next = 14;
              return OrganizationService.get({
                region_id: region_id,
                offset: 0,
                limit: 99999
              });
            case 14:
              _yield$OrganizationSe = _context2.sent;
              organizations = _yield$OrganizationSe.data;
              _context2.next = 18;
              return OrganizationmonitoringService.prixodRasxod(query, organizations);
            case 18:
              data = _context2.sent;
              if (!(query.excel === 'true')) {
                _context2.next = 24;
                break;
              }
              _context2.next = 22;
              return OrganizationmonitoringService.prixodRasxodExcel({
                organ_name: main_schet.tashkilot_nomi,
                operatsii: query.operatsii,
                organizations: data.organizations,
                to: query.to
              });
            case 22:
              filePath = _context2.sent;
              return _context2.abrupt("return", res.download(filePath, function (err) {
                if (err) {
                  res.error(err.message, err.statusCode);
                }
              }));
            case 24:
              return _context2.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, {
                itogo_rasxod: data.itogo_rasxod,
                itogo_prixod: data.itogo_prixod
              }, data.organizations));
            case 25:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function prixodRasxod(_x3, _x4) {
        return _prixodRasxod.apply(this, arguments);
      }
      return prixodRasxod;
    }()
  }, {
    key: "cap",
    value: function () {
      var _cap = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
        var region_id, query, main_schet, _yield$Organizationmo2, data, itogo_rasxod, filePath;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              region_id = req.user.region_id;
              query = req.query;
              _context3.next = 4;
              return MainSchetService.getById({
                region_id: region_id,
                id: query.main_schet_id
              });
            case 4:
              main_schet = _context3.sent;
              if (main_schet) {
                _context3.next = 7;
                break;
              }
              return _context3.abrupt("return", res.error('Main shcet not found', 404));
            case 7:
              _context3.next = 9;
              return OrganizationmonitoringService.cap(_objectSpread(_objectSpread({}, query), {}, {
                region_id: region_id
              }));
            case 9:
              _yield$Organizationmo2 = _context3.sent;
              data = _yield$Organizationmo2.data;
              itogo_rasxod = _yield$Organizationmo2.itogo_rasxod;
              if (!(query.excel === 'true')) {
                _context3.next = 17;
                break;
              }
              _context3.next = 15;
              return OrganizationmonitoringService.capExcel({
                organ_name: main_schet.tashkilot_nomi,
                operatsii: query.operatsii,
                organizations: data,
                to: query.to,
                from: query.from,
                budjet_name: main_schet.budjet_name,
                itogo_rasxod: itogo_rasxod
              });
            case 15:
              filePath = _context3.sent;
              return _context3.abrupt("return", res.download(filePath, function (err) {
                if (err) {
                  res.error(err.message, err.statusCode);
                }
              }));
            case 17:
              ;
              return _context3.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, {
                itogo_rasxod: itogo_rasxod
              }, data));
            case 19:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function cap(_x5, _x6) {
        return _cap.apply(this, arguments);
      }
      return cap;
    }()
  }, {
    key: "consolidated",
    value: function () {
      var _consolidated = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
        var region_id, query, main_schet, organization, data, organizations, file;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              region_id = req.user.region_id;
              query = req.query;
              _context4.next = 4;
              return MainSchetService.getById({
                region_id: region_id,
                id: query.main_schet_id
              });
            case 4:
              main_schet = _context4.sent;
              if (main_schet) {
                _context4.next = 7;
                break;
              }
              return _context4.abrupt("return", res.error('main shcet not found', 404));
            case 7:
              if (!query.organ_id) {
                _context4.next = 13;
                break;
              }
              _context4.next = 10;
              return OrganizationService.getById({
                region_id: region_id,
                id: query.organ_id
              });
            case 10:
              organization = _context4.sent;
              if (organization) {
                _context4.next = 13;
                break;
              }
              return _context4.abrupt("return", res.error('Organization not found', 404));
            case 13:
              if (!(query.contract !== 'true')) {
                _context4.next = 19;
                break;
              }
              _context4.next = 16;
              return OrganizationService.get({
                region_id: region_id,
                offset: 0,
                limit: 99999,
                organ_id: query.organ_id
              });
            case 16:
              organizations = _context4.sent.data;
              _context4.next = 22;
              break;
            case 19:
              _context4.next = 21;
              return ContractService.getContractByOrganizations({
                region_id: region_id,
                organ_id: query.organ_id
              });
            case 21:
              organizations = _context4.sent;
            case 22:
              _context4.next = 24;
              return OrganizationmonitoringService.consolidated({
                organizations: organizations,
                region_id: region_id,
                from: query.from,
                to: query.to,
                main_schet_id: query.main_schet_id,
                operatsii: query.schet,
                contract: query.contract === 'true' ? true : false
              });
            case 24:
              data = _context4.sent;
              if (!(query.excel === 'true')) {
                _context4.next = 38;
                break;
              }
              if (!(query.contract === 'true')) {
                _context4.next = 32;
                break;
              }
              _context4.next = 29;
              return OrganizationmonitoringService.consolidatedByContractExcel({
                organizations: data.organizations,
                rasxodSchets: data.rasxodSchets,
                to: query.to,
                operatsii: query.schet
              });
            case 29:
              file = _context4.sent;
              _context4.next = 35;
              break;
            case 32:
              _context4.next = 34;
              return OrganizationmonitoringService.consolidatedExcel({
                organizations: data.organizations,
                rasxodSchets: data.rasxodSchets,
                to: query.to,
                operatsii: query.schet
              });
            case 34:
              file = _context4.sent;
            case 35:
              res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
              res.setHeader('Content-Disposition', "attachment; filename=\"".concat(file.fileName, "\""));
              return _context4.abrupt("return", res.download(file.filePath));
            case 38:
              return _context4.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, {
                rasxodSchets: data.rasxodSchets
              }, data.organizations));
            case 39:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function consolidated(_x7, _x8) {
        return _consolidated.apply(this, arguments);
      }
      return consolidated;
    }()
  }, {
    key: "aktSverka",
    value: function () {
      var _aktSverka = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
        var _podpis$, _podpis$2;
        var region_id, _req$query, main_schet_id, contract_id, organ_id, to, from, region, main_schet, organization, contract, data, summa_from, summa_to, podpis, summa_rasxod, summa_prixod, _iterator, _step, item, head, title, workbook, fileName, worksheet, headCell, titleCell, row1Cell, row2Cell, row3Cell, empty, debit1, kridit1, debit2, kridit2, empty2, debit1_2, kridit1_2, debit2_2, kridit2_2, _iterator2, _step2, _item, _row_number, text, row1, rowHeight, row, _debit, _kridit, _debit2, _kridit2, summa_array, row_number, empty3, debit3, kridit3, debit3_2, kridit3_2, empty4, debit4, kridit4, debit4_2, kridit4_2, footer, podotchet, organ, imzo1, imzo2, array_headers, titleLength, filePath;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              region_id = req.user.region_id;
              _req$query = req.query, main_schet_id = _req$query.main_schet_id, contract_id = _req$query.contract_id, organ_id = _req$query.organ_id, to = _req$query.to, from = _req$query.from;
              _context5.next = 4;
              return RegionDB.getById([region_id]);
            case 4:
              region = _context5.sent;
              if (region) {
                _context5.next = 7;
                break;
              }
              return _context5.abrupt("return", res.status(404).json({
                message: "region not found"
              }));
            case 7:
              _context5.next = 9;
              return MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
            case 9:
              main_schet = _context5.sent;
              if (main_schet) {
                _context5.next = 12;
                break;
              }
              return _context5.abrupt("return", res.status(404).json({
                message: "main schet not found"
              }));
            case 12:
              _context5.next = 14;
              return OrganizationDB.getById([region_id, organ_id]);
            case 14:
              organization = _context5.sent;
              if (organization) {
                _context5.next = 17;
                break;
              }
              return _context5.abrupt("return", res.status(404).json({
                message: "organization not found"
              }));
            case 17:
              if (!contract_id) {
                _context5.next = 23;
                break;
              }
              _context5.next = 20;
              return ContractDB.getById([region_id, contract_id], true, main_schet.spravochnik_budjet_name_id, organ_id);
            case 20:
              contract = _context5.sent;
              if (contract) {
                _context5.next = 23;
                break;
              }
              return _context5.abrupt("return", res.status(404).json({
                message: "contract not found"
              }));
            case 23:
              _context5.next = 25;
              return OrganizationMonitoringDB.ge([from, to, organ_id], contract_id);
            case 25:
              data = _context5.sent;
              _context5.next = 28;
              return OrganizationMonitoringDB.getByContractIdSumma([from, organ_id], '<', contract_id);
            case 28:
              summa_from = _context5.sent;
              _context5.next = 31;
              return OrganizationMonitoringDB.getByContractIdSumma([to, organ_id], '<=', contract_id);
            case 31:
              summa_to = _context5.sent;
              _context5.next = 34;
              return PodpisDB.getPodpis([region_id], 'akkt_sverka');
            case 34:
              podpis = _context5.sent;
              summa_rasxod = 0;
              summa_prixod = 0;
              _iterator = _createForOfIteratorHelper(data);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  item = _step.value;
                  summa_rasxod += item.summa_rasxod;
                  summa_prixod += item.summa_prixod;
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              head = "\u0410\u043A\u0442 \u0441\u0432\u0435\u0440\u043A\u0438 \u0432\u0437\u0430\u0438\u043C\u0430\u0440\u0430\u0441\u0447\u0435\u0442\u043E\u0432";
              title = "\u041C\u044B, \u043D\u0438\u0436\u0435\u043F\u043E\u0434\u043F\u0438\u0441\u0430\u0432\u0448\u0438\u0435\u0441\u044F \u041D\u0430\u0447\u0430\u043B\u044C\u043D\u0438\u043A ".concat(main_schet.tashkilot_nomi, " \" OOO ").concat(organization.name, "\" \u0410\u0416 \u043F\u0440\u043E\u0438\u0437\u0432\u0435\u043B\u0438 \u0441\u0432\u0435\u0440\u043A\u0443 \u0432\u0437\u0430\u0438\u043C\u043D\u044B\u0445 \u0440\u0430\u0441\u0447\u0435\u0442\u043E\u0432 \u043C\u0435\u0436\u0434\u0443 ").concat(main_schet.tashkilot_nomi, " \"").concat(organization.name, "\" \u0410\u0416 \u043F\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044E \u043D\u0430 ").concat(returnStringDate(new Date(to)));
              workbook = new ExcelJS.Workbook();
              fileName = "akt_sverki_".concat(new Date().getTime(), ".xlsx");
              worksheet = workbook.addWorksheet('Акт сверки');
              worksheet.pageSetup.margins.left = 0;
              worksheet.pageSetup.margins.header = 0;
              worksheet.pageSetup.margins.footer = 0;
              worksheet.mergeCells('A1', 'K1');
              headCell = worksheet.getCell('A1');
              Object.assign(headCell, {
                value: head,
                font: {
                  size: 14,
                  bold: true,
                  color: {
                    argb: 'FF004080'
                  },
                  name: 'Times New Roman'
                },
                alignment: {
                  vertical: 'middle',
                  horizontal: 'center'
                }
              });
              worksheet.mergeCells('A2', 'K2');
              worksheet.mergeCells('A3', 'C3');
              worksheet.mergeCells('D3', 'G3');
              worksheet.mergeCells('H3', 'K3');
              titleCell = worksheet.getCell('A2');
              titleCell.value = title;
              row1Cell = worksheet.getCell('A3');
              row1Cell.value = "\u0421\u043E\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0435 \u0437\u0430\u043F\u0438\u0441\u0435\u0439";
              row2Cell = worksheet.getCell('D3');
              row2Cell.value = main_schet.tashkilot_nomi;
              row3Cell = worksheet.getCell('H3');
              row3Cell.value = "".concat(organization.name);
              worksheet.mergeCells('A4', 'C4');
              empty = worksheet.getCell('A4');
              empty.value = '';
              worksheet.mergeCells('D4', 'E4');
              debit1 = worksheet.getCell('D4');
              debit1.value = "\u0414\u0435\u0431\u0438\u0442";
              worksheet.mergeCells('F4', 'G4');
              kridit1 = worksheet.getCell('F4');
              kridit1.value = 'Кредит';
              worksheet.mergeCells('H4', 'I4');
              debit2 = worksheet.getCell('H4');
              debit2.value = "\u0414\u0435\u0431\u0438\u0442";
              worksheet.mergeCells('J4', 'K4');
              kridit2 = worksheet.getCell('J4');
              kridit2.value = 'Кредит';
              worksheet.mergeCells('A5', 'C5');
              empty2 = worksheet.getCell('A5');
              empty2.value = 'Остаток к началу дня:';
              worksheet.mergeCells('D5', 'E5');
              debit1_2 = worksheet.getCell('D5');
              debit1_2.value = summa_from > 0 ? summa_from : 0;
              worksheet.mergeCells('F5', 'G5');
              kridit1_2 = worksheet.getCell('F5');
              kridit1_2.value = summa_from < 0 ? Math.abs(summa_from) : 0;
              worksheet.mergeCells('H5', 'I5');
              debit2_2 = worksheet.getCell('H5');
              debit2_2.value = summa_from < 0 ? Math.abs(summa_from) : 0;
              worksheet.mergeCells('J5', 'K5');
              kridit2_2 = worksheet.getCell('J5');
              kridit2_2.value = summa_from > 0 ? summa_from : 0;
              _iterator2 = _createForOfIteratorHelper(data);
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  _item = _step2.value;
                  _row_number = worksheet.lastRow.number + 1;
                  worksheet.mergeCells("A".concat(_row_number), "C".concat(_row_number));
                  text = "".concat(_item.opisanie || 'Описание');
                  row1 = worksheet.getCell("A".concat(_row_number));
                  Object.assign(row1, {
                    value: text,
                    font: {
                      size: 10,
                      name: 'Times New Roman'
                    },
                    alignment: {
                      vertical: 'middle',
                      horizontal: 'left',
                      wrapText: true
                    },
                    fill: {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: {
                        argb: 'FFFFFFFF'
                      }
                    },
                    border: {
                      top: {
                        style: 'thin'
                      },
                      left: {
                        style: 'thin'
                      },
                      bottom: {
                        style: 'thin'
                      },
                      right: {
                        style: 'thin'
                      }
                    }
                  });
                  rowHeight = Math.ceil(text.length / 30) * 15;
                  row = worksheet.getRow(_row_number);
                  row.height = rowHeight;
                  worksheet.mergeCells("D".concat(_row_number), "E".concat(_row_number));
                  _debit = worksheet.getCell("D".concat(_row_number));
                  _debit.value = _item.summa_prixod;
                  worksheet.mergeCells("F".concat(_row_number), "G".concat(_row_number));
                  _kridit = worksheet.getCell("F".concat(_row_number));
                  _kridit.value = _item.summa_rasxod;
                  worksheet.mergeCells("H".concat(_row_number), "I".concat(_row_number));
                  _debit2 = worksheet.getCell("H".concat(_row_number));
                  _debit2.value = _item.summa_rasxod;
                  worksheet.mergeCells("J".concat(_row_number), "K".concat(_row_number));
                  _kridit2 = worksheet.getCell("J".concat(_row_number));
                  _kridit2.value = _item.summa_prixod;
                  summa_array = [_debit, _debit2, _kridit, _kridit2];
                  summa_array.forEach(function (item) {
                    Object.assign(item, {
                      numFmt: '#,##0.00',
                      font: {
                        size: 10,
                        name: 'Times New Roman'
                      },
                      alignment: {
                        vertical: 'middle',
                        horizontal: 'right'
                      },
                      fill: {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {
                          argb: 'FFFFFFFF'
                        }
                      },
                      border: {
                        top: {
                          style: 'thin'
                        },
                        left: {
                          style: 'thin'
                        },
                        bottom: {
                          style: 'thin'
                        },
                        right: {
                          style: 'thin'
                        }
                      }
                    });
                  });
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
              ;
              row_number = worksheet.lastRow.number + 1;
              worksheet.mergeCells("A".concat(row_number), "C".concat(row_number));
              empty3 = worksheet.getCell("A".concat(row_number));
              empty3.value = "\u0418\u0442\u043E\u0433\u043E";
              worksheet.mergeCells("D".concat(row_number), "E".concat(row_number));
              debit3 = worksheet.getCell("D".concat(row_number));
              debit3.value = summa_prixod;
              worksheet.mergeCells("F".concat(row_number), "G".concat(row_number));
              kridit3 = worksheet.getCell("F".concat(row_number));
              kridit3.value = summa_rasxod;
              worksheet.mergeCells("H".concat(row_number), "I".concat(row_number));
              debit3_2 = worksheet.getCell("H".concat(row_number));
              debit3_2.value = summa_rasxod;
              worksheet.mergeCells("J".concat(row_number), "K".concat(row_number));
              kridit3_2 = worksheet.getCell("J".concat(row_number));
              kridit3_2.value = summa_prixod;
              row_number = row_number + 1;
              worksheet.mergeCells("A".concat(row_number), "C".concat(row_number));
              empty4 = worksheet.getCell("A".concat(row_number));
              empty4.value = "\u041E\u0441\u0442\u0430\u0442\u043E\u043A \u043A\u043E\u043D\u0446\u0443 \u0434\u043D\u044F:";
              worksheet.mergeCells("D".concat(row_number), "E".concat(row_number));
              debit4 = worksheet.getCell("D".concat(row_number));
              debit4.value = summa_to > 0 ? summa_to : 0;
              worksheet.mergeCells("F".concat(row_number), "G".concat(row_number));
              kridit4 = worksheet.getCell("F".concat(row_number));
              kridit4.value = summa_to < 0 ? Math.abs(summa_to) : 0;
              worksheet.mergeCells("H".concat(row_number), "I".concat(row_number));
              debit4_2 = worksheet.getCell("H".concat(row_number));
              debit4_2.value = summa_to < 0 ? Math.abs(summa_to) : 0;
              worksheet.mergeCells("J".concat(row_number), "K".concat(row_number));
              kridit4_2 = worksheet.getCell("J".concat(row_number));
              kridit4_2.value = summa_to > 0 ? summa_to : 0;
              row_number = row_number + 1;
              worksheet.mergeCells("A".concat(row_number), "K".concat(row_number));
              footer = worksheet.getCell("A".concat(row_number));
              footer.value = "\u0421\u0430\u043B\u044C\u0434\u043E \u0432 \u043F\u043E\u043B\u044C\u0437\u0443 : ".concat(((_podpis$ = podpis[0]) === null || _podpis$ === void 0 ? void 0 : _podpis$.fio_name) || 'podis', " ").concat(returnStringSumma(summa_to));
              worksheet.getRow(row_number).height = 40;
              row_number = row_number + 1;
              worksheet.mergeCells("A".concat(row_number), "D".concat(row_number));
              podotchet = worksheet.getCell("A".concat(row_number));
              podotchet.value = "\u041D\u0430\u0447\u0430\u043B\u043D\u0438\u043A ".concat(main_schet.tashkilot_nomi, " ").concat(((_podpis$2 = podpis[0]) === null || _podpis$2 === void 0 ? void 0 : _podpis$2.fio_name) || 'podis');
              worksheet.mergeCells("G".concat(row_number), "K".concat(row_number));
              organ = worksheet.getCell("G".concat(row_number));
              organ.value = "\u0420\u0443\u043A\u043E\u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C \"".concat(organization.name, "\" \u0410\u0416");
              worksheet.getRow(row_number).height = 30;
              row_number = row_number + 1;
              worksheet.mergeCells("A".concat(row_number), "D".concat(row_number));
              imzo1 = worksheet.getCell("A".concat(row_number));
              imzo1.value = "";
              imzo1.border = {
                bottom: {
                  style: 'thin'
                }
              };
              worksheet.mergeCells("G".concat(row_number), "K".concat(row_number));
              imzo2 = worksheet.getCell("G".concat(row_number));
              imzo2.value = "";
              imzo2.border = {
                bottom: {
                  style: 'thin'
                }
              };
              worksheet.getRow(row_number).height = 30;
              array_headers = [footer, podotchet, organ, imzo1, imzo2, titleCell, row1Cell, row2Cell, row3Cell, empty, debit1, debit2, kridit1, kridit2, empty2, debit1_2, debit2_2, kridit1_2, kridit2_2, empty3, debit3, debit3_2, kridit3, kridit3_2, empty4, debit4, debit4_2, kridit4, kridit4_2];
              array_headers.forEach(function (item, index) {
                var argb = 'FF004080';
                var horizontal = "center";
                if (index > 13) {
                  argb = '000000';
                  horizontal = 'right';
                }
                Object.assign(item, {
                  numFmt: "#,##0.00",
                  font: {
                    size: 10,
                    bold: true,
                    color: {
                      argb: argb
                    },
                    name: 'Times New Roman'
                  },
                  alignment: {
                    vertical: 'middle',
                    horizontal: horizontal,
                    wrapText: true
                  }
                });
                if (item.value !== '' && index > 5) {
                  Object.assign(item, {
                    fill: {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: {
                        argb: 'FFFFFFFF'
                      }
                    },
                    border: {
                      top: {
                        style: 'thin'
                      },
                      left: {
                        style: 'thin'
                      },
                      bottom: {
                        style: 'thin'
                      },
                      right: {
                        style: 'thin'
                      }
                    }
                  });
                }
              });
              titleLength = title.length;
              worksheet.getRow(2).height = titleLength > 150 ? 60 : titleLength > 100 ? 50 : 40;
              worksheet.getRow(1).height = 25;
              worksheet.getRow(3).height = 35;
              worksheet.getRow(4).height = 25;
              worksheet.getColumn(4).width = 8;
              worksheet.getColumn(5).width = 8;
              worksheet.getColumn(6).width = 8;
              worksheet.getColumn(7).width = 8;
              worksheet.getColumn(8).width = 8;
              worksheet.getColumn(9).width = 8;
              worksheet.getColumn(10).width = 8;
              worksheet.getColumn(11).width = 8;
              filePath = path.join(__dirname, '../../../public/exports/' + fileName);
              _context5.next = 168;
              return workbook.xlsx.writeFile(filePath);
            case 168:
              return _context5.abrupt("return", res.download(filePath, function (err) {
                if (err) throw new ErrorResponse(err, err.statusCode);
              }));
            case 169:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      function aktSverka(_x9, _x10) {
        return _aktSverka.apply(this, arguments);
      }
      return aktSverka;
    }()
  }]);
}();