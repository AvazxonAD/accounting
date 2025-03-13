"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
var _require = require('./service'),
  ReportService = _require.ReportService;
var _require2 = require('@budjet/service'),
  BudjetService = _require2.BudjetService;
var _require3 = require('@main_schet/service'),
  MainSchetService = _require3.MainSchetService;
exports.Controller = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "createReport",
    value: function () {
      var _createReport = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
        var user_id, region_id, budjet_id, main_schet_id, _req$body, month, year, budjet, main_schet, doc, data, result;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              user_id = req.user.id;
              region_id = req.user.region_id;
              budjet_id = req.query.budjet_id;
              main_schet_id = req.query.main_schet_id;
              _req$body = req.body, month = _req$body.month, year = _req$body.year;
              _context.next = 7;
              return BudjetService.getById({
                id: budjet_id
              });
            case 7:
              budjet = _context.sent;
              if (budjet) {
                _context.next = 10;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('budjetNotFound'), 404));
            case 10:
              _context.next = 12;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 12:
              main_schet = _context.sent;
              if (main_schet) {
                _context.next = 15;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 15:
              _context.next = 17;
              return ReportService.getByIdReport({
                region_id: region_id,
                year: year,
                month: month,
                budjet_id: budjet_id
              });
            case 17:
              doc = _context.sent;
              if (!doc) {
                _context.next = 20;
                break;
              }
              return _context.abrupt("return", res.error('This data already exist', 409));
            case 20:
              _context.next = 22;
              return ReportService.getInfo({
                region_id: region_id,
                year: year,
                month: month,
                budjet_id: budjet_id
              });
            case 22:
              data = _context.sent;
              _context.next = 25;
              return ReportService.createReport(_objectSpread(_objectSpread({}, data), {}, {
                user_id: user_id,
                budjet_id: budjet_id,
                main_schet_id: main_schet_id
              }));
            case 25:
              result = _context.sent;
              return _context.abrupt("return", res.success('Create successfully', 201, null, result));
            case 27:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function createReport(_x, _x2) {
        return _createReport.apply(this, arguments);
      }
      return createReport;
    }()
  }, {
    key: "getReport",
    value: function () {
      var _getReport = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
        var region_id, _req$query, budjet_id, year, month, budjet, data;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              region_id = req.user.region_id;
              _req$query = req.query, budjet_id = _req$query.budjet_id, year = _req$query.year, month = _req$query.month;
              _context2.next = 4;
              return BudjetService.getById({
                id: budjet_id
              });
            case 4:
              budjet = _context2.sent;
              if (budjet) {
                _context2.next = 7;
                break;
              }
              return _context2.abrupt("return", res.status(404).json({
                message: "budjet not found"
              }));
            case 7:
              _context2.next = 9;
              return ReportService.getReport({
                region_id: region_id,
                budjet_id: budjet_id,
                year: year,
                month: month
              });
            case 9:
              data = _context2.sent;
              return _context2.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, null, data));
            case 11:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function getReport(_x3, _x4) {
        return _getReport.apply(this, arguments);
      }
      return getReport;
    }()
  }, {
    key: "getByIdReport",
    value: function () {
      var _getByIdReport = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
        var region_id, _req$query2, budjet_id, year, month, budjet, doc;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              region_id = req.user.region_id;
              _req$query2 = req.query, budjet_id = _req$query2.budjet_id, year = _req$query2.year, month = _req$query2.month;
              _context3.next = 4;
              return BudjetService.getById({
                id: budjet_id
              });
            case 4:
              budjet = _context3.sent;
              if (budjet) {
                _context3.next = 7;
                break;
              }
              return _context3.abrupt("return", res.error(req.i18n.t('budjetNotFound'), 404));
            case 7:
              _context3.next = 9;
              return ReportService.getByIdReport({
                region_id: region_id,
                year: year,
                month: month,
                budjet_id: budjet_id
              });
            case 9:
              doc = _context3.sent;
              if (doc) {
                _context3.next = 12;
                break;
              }
              return _context3.abrupt("return", res.error(req.i18n.t('docNotFound'), 404));
            case 12:
              return _context3.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, null, doc));
            case 13:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function getByIdReport(_x5, _x6) {
        return _getByIdReport.apply(this, arguments);
      }
      return getByIdReport;
    }()
  }, {
    key: "updateReport",
    value: function () {
      var _updateReport = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
        var region_id, user_id, body, query, budjet, main_schet, old_doc, doc, data, result;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              region_id = req.user.region_id;
              user_id = req.user.id;
              body = req.body, query = req.query;
              _context4.next = 5;
              return BudjetService.getById({
                id: query.budjet_id
              });
            case 5:
              budjet = _context4.sent;
              if (budjet) {
                _context4.next = 8;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('budjetNotFound'), 404));
            case 8:
              _context4.next = 10;
              return MainSchetService.getById({
                region_id: region_id,
                id: query.main_schet_id
              });
            case 10:
              main_schet = _context4.sent;
              if (main_schet) {
                _context4.next = 13;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 13:
              _context4.next = 15;
              return ReportService.getByIdReport({
                region_id: region_id,
                year: query.year,
                month: query.month,
                budjet_id: query.budjet_id
              });
            case 15:
              old_doc = _context4.sent;
              if (old_doc) {
                _context4.next = 18;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('docNotFound'), 404));
            case 18:
              if (!(old_doc.status === 2)) {
                _context4.next = 20;
                break;
              }
              return _context4.abrupt("return", res.error("The confirmed document cannot be deleted", 400));
            case 20:
              if (!(old_doc.year !== body.year || old_doc.month !== body.month)) {
                _context4.next = 26;
                break;
              }
              _context4.next = 23;
              return ReportService.getByIdReport({
                region_id: region_id,
                year: body.year,
                month: body.month,
                budjet_id: query.budjet_id
              });
            case 23:
              doc = _context4.sent;
              if (!doc) {
                _context4.next = 26;
                break;
              }
              return _context4.abrupt("return", res.error('This data already exist', 409));
            case 26:
              _context4.next = 28;
              return ReportService.getInfo({
                region_id: region_id,
                year: body.year,
                month: body.month,
                budjet_id: query.budjet_id
              });
            case 28:
              data = _context4.sent;
              _context4.next = 31;
              return ReportService.updateReport(_objectSpread(_objectSpread({}, data), {}, {
                user_id: user_id,
                region_id: region_id,
                query: query,
                body: body
              }));
            case 31:
              result = _context4.sent;
              return _context4.abrupt("return", res.success('Update successfullly', 200, null, result));
            case 33:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function updateReport(_x7, _x8) {
        return _updateReport.apply(this, arguments);
      }
      return updateReport;
    }()
  }, {
    key: "deleteReport",
    value: function () {
      var _deleteReport = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
        var region_id, _req$query3, budjet_id, year, month, budjet, doc;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              region_id = req.user.region_id;
              _req$query3 = req.query, budjet_id = _req$query3.budjet_id, year = _req$query3.year, month = _req$query3.month;
              _context5.next = 4;
              return BudjetService.getById({
                id: budjet_id
              });
            case 4:
              budjet = _context5.sent;
              if (budjet) {
                _context5.next = 7;
                break;
              }
              return _context5.abrupt("return", res.error(req.i18n.t('budjetNotFound'), 404));
            case 7:
              _context5.next = 9;
              return ReportService.getByIdReport({
                region_id: region_id,
                year: year,
                month: month,
                budjet_id: budjet_id
              });
            case 9:
              doc = _context5.sent;
              if (doc) {
                _context5.next = 12;
                break;
              }
              return _context5.abrupt("return", res.error(req.i18n.t('docNotFound'), 404));
            case 12:
              if (!(doc.status === 2)) {
                _context5.next = 14;
                break;
              }
              return _context5.abrupt("return", res.error("The confirmed document cannot be deleted", 400));
            case 14:
              _context5.next = 16;
              return ReportService.deleteReport({
                region_id: region_id,
                year: year,
                month: month,
                budjet_id: budjet_id
              });
            case 16:
              return _context5.abrupt("return", res.success('Delete successfully', 200));
            case 17:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      function deleteReport(_x9, _x10) {
        return _deleteReport.apply(this, arguments);
      }
      return deleteReport;
    }()
  }, {
    key: "getInfo",
    value: function () {
      var _getInfo = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
        var _req$query4, year, month, budjet_id, region_id, budjet, result;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _req$query4 = req.query, year = _req$query4.year, month = _req$query4.month, budjet_id = _req$query4.budjet_id;
              region_id = req.user.region_id;
              _context6.next = 4;
              return BudjetService.getById({
                id: budjet_id
              });
            case 4:
              budjet = _context6.sent;
              if (budjet) {
                _context6.next = 7;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('budjetNotFound'), 404));
            case 7:
              _context6.next = 9;
              return ReportService.getInfo({
                region_id: region_id,
                year: year,
                month: month,
                budjet_id: budjet_id
              });
            case 9:
              result = _context6.sent;
              return _context6.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, null, result));
            case 11:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      function getInfo(_x11, _x12) {
        return _getInfo.apply(this, arguments);
      }
      return getInfo;
    }()
  }]);
}();