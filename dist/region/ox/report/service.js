"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
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
var _require = require('./db'),
  ReportOx = _require.ReportOx;
var _require2 = require('../doc/db'),
  DocOx = _require2.DocOx;
var _require3 = require('@smeta_grafik/db'),
  SmetaGrafikDB = _require3.SmetaGrafikDB;
var _require4 = require('@helper/functions'),
  tashkentTime = _require4.tashkentTime;
var _require5 = require('@db/index'),
  db = _require5.db;
exports.ReportService = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "getInfo",
    value: function () {
      var _getInfo = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(data) {
        var _yield$SmetaGrafikDB$, smeta_grafiks, _iterator, _step, grafik;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return SmetaGrafikDB.getSmetaGrafik([data.region_id, 0, 99999], data.budjet_id, null, data.year);
            case 2:
              _yield$SmetaGrafikDB$ = _context.sent;
              smeta_grafiks = _yield$SmetaGrafikDB$.data;
              data.smeta_grafiks = smeta_grafiks.map(function (item) {
                return _objectSpread({}, item);
              });
              _iterator = _createForOfIteratorHelper(data.smeta_grafiks);
              _context.prev = 6;
              _iterator.s();
            case 8:
              if ((_step = _iterator.n()).done) {
                _context.next = 19;
                break;
              }
              grafik = _step.value;
              _context.next = 12;
              return DocOx.getGrafikSummaByGrafikId([data.region_id, data.year, data.month, data.budjet_id, grafik.id]);
            case 12:
              grafik.summa = _context.sent;
              if (!grafik.summa) {
                grafik.summa = {
                  ajratilgan_mablag: 0,
                  tulangan_mablag_smeta_buyicha: 0,
                  kassa_rasxod: 0,
                  haqiqatda_harajatlar: 0,
                  qoldiq: 0
                };
              }
              _context.next = 16;
              return DocOx.getByYearSumma([data.region_id, data.year, data.month, data.budjet_id, grafik.id]);
            case 16:
              grafik.year_summa = _context.sent;
            case 17:
              _context.next = 8;
              break;
            case 19:
              _context.next = 24;
              break;
            case 21:
              _context.prev = 21;
              _context.t0 = _context["catch"](6);
              _iterator.e(_context.t0);
            case 24:
              _context.prev = 24;
              _iterator.f();
              return _context.finish(24);
            case 27:
              return _context.abrupt("return", {
                year: data.year,
                month: data.month,
                smeta_grafiks: data.smeta_grafiks
              });
            case 28:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[6, 21, 24, 27]]);
      }));
      function getInfo(_x) {
        return _getInfo.apply(this, arguments);
      }
      return getInfo;
    }()
  }, {
    key: "createReport",
    value: function () {
      var _createReport = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(data) {
        var report;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return db.transaction(/*#__PURE__*/function () {
                var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(client) {
                  var result, _iterator2, _step2, grafik;
                  return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                    while (1) switch (_context2.prev = _context2.next) {
                      case 0:
                        result = [];
                        _iterator2 = _createForOfIteratorHelper(data.smeta_grafiks);
                        _context2.prev = 2;
                        _iterator2.s();
                      case 4:
                        if ((_step2 = _iterator2.n()).done) {
                          _context2.next = 13;
                          break;
                        }
                        grafik = _step2.value;
                        _context2.t0 = result;
                        _context2.next = 9;
                        return ReportOx.createReport([data.user_id, tashkentTime(), null, null, data.main_schet_id, data.budjet_id, grafik.id, data.month, data.year, grafik.summa.ajratilgan_mablag, grafik.summa.tulangan_mablag_smeta_buyicha, grafik.summa.kassa_rasxod, grafik.summa.haqiqatda_harajatlar, grafik.summa.qoldiq, 1, tashkentTime(), tashkentTime()], client);
                      case 9:
                        _context2.t1 = _context2.sent;
                        _context2.t0.push.call(_context2.t0, _context2.t1);
                      case 11:
                        _context2.next = 4;
                        break;
                      case 13:
                        _context2.next = 18;
                        break;
                      case 15:
                        _context2.prev = 15;
                        _context2.t2 = _context2["catch"](2);
                        _iterator2.e(_context2.t2);
                      case 18:
                        _context2.prev = 18;
                        _iterator2.f();
                        return _context2.finish(18);
                      case 21:
                        return _context2.abrupt("return", result);
                      case 22:
                      case "end":
                        return _context2.stop();
                    }
                  }, _callee2, null, [[2, 15, 18, 21]]);
                }));
                return function (_x3) {
                  return _ref.apply(this, arguments);
                };
              }());
            case 2:
              report = _context3.sent;
              return _context3.abrupt("return", report);
            case 4:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function createReport(_x2) {
        return _createReport.apply(this, arguments);
      }
      return createReport;
    }()
  }, {
    key: "getReport",
    value: function () {
      var _getReport = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(data) {
        var result, _iterator3, _step3, doc, times;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return ReportOx.getReport([data.region_id, data.budjet_id], data.year, data.month);
            case 2:
              result = _context4.sent;
              _iterator3 = _createForOfIteratorHelper(result);
              _context4.prev = 4;
              _iterator3.s();
            case 6:
              if ((_step3 = _iterator3.n()).done) {
                _context4.next = 15;
                break;
              }
              doc = _step3.value;
              _context4.next = 10;
              return ReportOx.getReportTime([doc.region_id, doc.budjet_id, doc.year, doc.month]);
            case 10:
              times = _context4.sent;
              doc.document_yaratilgan_vaqt = times.document_yaratilgan_vaqt;
              doc.document_qabul_qilingan_vaqt = times.document_qabul_qilingan_vaqt;
            case 13:
              _context4.next = 6;
              break;
            case 15:
              _context4.next = 20;
              break;
            case 17:
              _context4.prev = 17;
              _context4.t0 = _context4["catch"](4);
              _iterator3.e(_context4.t0);
            case 20:
              _context4.prev = 20;
              _iterator3.f();
              return _context4.finish(20);
            case 23:
              return _context4.abrupt("return", result);
            case 24:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[4, 17, 20, 23]]);
      }));
      function getReport(_x4) {
        return _getReport.apply(this, arguments);
      }
      return getReport;
    }()
  }, {
    key: "getByIdReport",
    value: function () {
      var _getByIdReport = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(data) {
        var _yield$SmetaGrafikDB$2, smeta_grafiks, report, _iterator4, _step4, grafik;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return SmetaGrafikDB.getSmetaGrafik([data.region_id, 0, 99999], data.budjet_id, null, data.year);
            case 2:
              _yield$SmetaGrafikDB$2 = _context5.sent;
              smeta_grafiks = _yield$SmetaGrafikDB$2.data;
              data.smeta_grafiks = smeta_grafiks.map(function (item) {
                return _objectSpread({}, item);
              });
              _context5.next = 7;
              return ReportOx.getByIdReport([data.region_id, data.budjet_id, data.year, data.month]);
            case 7:
              report = _context5.sent;
              if (!report) {
                _context5.next = 32;
                break;
              }
              report.smeta_grafiks = data.smeta_grafiks.map(function (item) {
                return _objectSpread({}, item);
              });
              if (!report) {
                _context5.next = 32;
                break;
              }
              _iterator4 = _createForOfIteratorHelper(report.smeta_grafiks);
              _context5.prev = 12;
              _iterator4.s();
            case 14:
              if ((_step4 = _iterator4.n()).done) {
                _context5.next = 24;
                break;
              }
              grafik = _step4.value;
              _context5.next = 18;
              return ReportOx.getSummaByGrafikId([data.region_id, data.year, data.month, data.budjet_id, grafik.id]);
            case 18:
              grafik.summa = _context5.sent;
              _context5.next = 21;
              return ReportOx.getByYearSumma([data.region_id, data.year, data.month, data.budjet_id, grafik.id]);
            case 21:
              grafik.year_summa = _context5.sent;
            case 22:
              _context5.next = 14;
              break;
            case 24:
              _context5.next = 29;
              break;
            case 26:
              _context5.prev = 26;
              _context5.t0 = _context5["catch"](12);
              _iterator4.e(_context5.t0);
            case 29:
              _context5.prev = 29;
              _iterator4.f();
              return _context5.finish(29);
            case 32:
              return _context5.abrupt("return", report);
            case 33:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[12, 26, 29, 32]]);
      }));
      function getByIdReport(_x5) {
        return _getByIdReport.apply(this, arguments);
      }
      return getByIdReport;
    }()
  }, {
    key: "updateReport",
    value: function () {
      var _updateReport = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(data) {
        var report;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return db.transaction(/*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(client) {
                  var result, _iterator5, _step5, grafik;
                  return _regeneratorRuntime().wrap(function _callee6$(_context6) {
                    while (1) switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return ReportOx.deleteReport([data.region_id, data.query.year, data.query.month, data.query.budjet_id], client);
                      case 2:
                        result = [];
                        _iterator5 = _createForOfIteratorHelper(data.smeta_grafiks);
                        _context6.prev = 4;
                        _iterator5.s();
                      case 6:
                        if ((_step5 = _iterator5.n()).done) {
                          _context6.next = 15;
                          break;
                        }
                        grafik = _step5.value;
                        _context6.t0 = result;
                        _context6.next = 11;
                        return ReportOx.createReport([data.user_id, tashkentTime(), null, null, data.query.main_schet_id, data.query.budjet_id, grafik.id, data.body.month, data.body.year, grafik.summa.ajratilgan_mablag, grafik.summa.tulangan_mablag_smeta_buyicha, grafik.summa.kassa_rasxod, grafik.summa.haqiqatda_harajatlar, grafik.summa.qoldiq, 1, tashkentTime(), tashkentTime()], client);
                      case 11:
                        _context6.t1 = _context6.sent;
                        _context6.t0.push.call(_context6.t0, _context6.t1);
                      case 13:
                        _context6.next = 6;
                        break;
                      case 15:
                        _context6.next = 20;
                        break;
                      case 17:
                        _context6.prev = 17;
                        _context6.t2 = _context6["catch"](4);
                        _iterator5.e(_context6.t2);
                      case 20:
                        _context6.prev = 20;
                        _iterator5.f();
                        return _context6.finish(20);
                      case 23:
                        return _context6.abrupt("return", result);
                      case 24:
                      case "end":
                        return _context6.stop();
                    }
                  }, _callee6, null, [[4, 17, 20, 23]]);
                }));
                return function (_x7) {
                  return _ref2.apply(this, arguments);
                };
              }());
            case 2:
              report = _context7.sent;
              return _context7.abrupt("return", report);
            case 4:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      }));
      function updateReport(_x6) {
        return _updateReport.apply(this, arguments);
      }
      return updateReport;
    }()
  }, {
    key: "deleteReport",
    value: function () {
      var _deleteReport = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(data) {
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return ReportOx.deleteReport([data.region_id, data.year, data.month, data.budjet_id]);
            case 2:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      }));
      function deleteReport(_x8) {
        return _deleteReport.apply(this, arguments);
      }
      return deleteReport;
    }()
  }]);
}();