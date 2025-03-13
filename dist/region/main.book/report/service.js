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
  ReportMainBookDB = _require.ReportMainBookDB;
var _require2 = require('../doc/db'),
  DocMainBookDB = _require2.DocMainBookDB;
var _require3 = require('@helper/data'),
  typeDocuments = _require3.typeDocuments;
var _require4 = require('../../../admin/spravochnik/main.book.schet/db'),
  MainBookSchetDB = _require4.MainBookSchetDB;
var _require5 = require('@helper/functions'),
  tashkentTime = _require5.tashkentTime;
var _require6 = require('@db/index'),
  db = _require6.db;
exports.ReportService = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "getInfo",
    value: function () {
      var _getInfo = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(data) {
        var types, _yield$MainBookSchetD, schets, _iterator, _step, type, _iterator2, _step2, schet;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              types = typeDocuments.map(function (item) {
                return _objectSpread({}, item);
              });
              _context.next = 3;
              return MainBookSchetDB.getMainBookSchet([0, 99999]);
            case 3:
              _yield$MainBookSchetD = _context.sent;
              schets = _yield$MainBookSchetD.data;
              _iterator = _createForOfIteratorHelper(types);
              _context.prev = 6;
              _iterator.s();
            case 8:
              if ((_step = _iterator.n()).done) {
                _context.next = 32;
                break;
              }
              type = _step.value;
              type.schets = schets.map(function (item) {
                return _objectSpread({}, item);
              });
              _iterator2 = _createForOfIteratorHelper(type.schets);
              _context.prev = 12;
              _iterator2.s();
            case 14:
              if ((_step2 = _iterator2.n()).done) {
                _context.next = 22;
                break;
              }
              schet = _step2.value;
              _context.next = 18;
              return DocMainBookDB.getSchetSummaBySchetId([data.region_id, data.year, data.month, data.budjet_id, schet.id, type.type]);
            case 18:
              schet.summa = _context.sent;
              if (!schet.summa) {
                schet.summa = {
                  debet_sum: 0,
                  kredit_sum: 0
                };
              }
            case 20:
              _context.next = 14;
              break;
            case 22:
              _context.next = 27;
              break;
            case 24:
              _context.prev = 24;
              _context.t0 = _context["catch"](12);
              _iterator2.e(_context.t0);
            case 27:
              _context.prev = 27;
              _iterator2.f();
              return _context.finish(27);
            case 30:
              _context.next = 8;
              break;
            case 32:
              _context.next = 37;
              break;
            case 34:
              _context.prev = 34;
              _context.t1 = _context["catch"](6);
              _iterator.e(_context.t1);
            case 37:
              _context.prev = 37;
              _iterator.f();
              return _context.finish(37);
            case 40:
              return _context.abrupt("return", {
                year: data.year,
                month: data.month,
                type_documents: types
              });
            case 41:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[6, 34, 37, 40], [12, 24, 27, 30]]);
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
                  var result, _iterator3, _step3, type, _iterator4, _step4, schet;
                  return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                    while (1) switch (_context2.prev = _context2.next) {
                      case 0:
                        result = [];
                        _iterator3 = _createForOfIteratorHelper(data.type_documents);
                        _context2.prev = 2;
                        _iterator3.s();
                      case 4:
                        if ((_step3 = _iterator3.n()).done) {
                          _context2.next = 28;
                          break;
                        }
                        type = _step3.value;
                        _iterator4 = _createForOfIteratorHelper(type.schets);
                        _context2.prev = 7;
                        _iterator4.s();
                      case 9:
                        if ((_step4 = _iterator4.n()).done) {
                          _context2.next = 18;
                          break;
                        }
                        schet = _step4.value;
                        _context2.t0 = result;
                        _context2.next = 14;
                        return ReportMainBookDB.createReport([data.user_id, tashkentTime(), null, null, data.main_schet_id, data.budjet_id, schet.id, type.type, data.month, data.year, schet.summa.debet_sum, schet.summa.kredit_sum, 1, tashkentTime(), tashkentTime()], client);
                      case 14:
                        _context2.t1 = _context2.sent;
                        _context2.t0.push.call(_context2.t0, _context2.t1);
                      case 16:
                        _context2.next = 9;
                        break;
                      case 18:
                        _context2.next = 23;
                        break;
                      case 20:
                        _context2.prev = 20;
                        _context2.t2 = _context2["catch"](7);
                        _iterator4.e(_context2.t2);
                      case 23:
                        _context2.prev = 23;
                        _iterator4.f();
                        return _context2.finish(23);
                      case 26:
                        _context2.next = 4;
                        break;
                      case 28:
                        _context2.next = 33;
                        break;
                      case 30:
                        _context2.prev = 30;
                        _context2.t3 = _context2["catch"](2);
                        _iterator3.e(_context2.t3);
                      case 33:
                        _context2.prev = 33;
                        _iterator3.f();
                        return _context2.finish(33);
                      case 36:
                        return _context2.abrupt("return", result);
                      case 37:
                      case "end":
                        return _context2.stop();
                    }
                  }, _callee2, null, [[2, 30, 33, 36], [7, 20, 23, 26]]);
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
        var result, _iterator5, _step5, doc, times;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return ReportMainBookDB.getReport([data.region_id, data.budjet_id], data.year, data.month);
            case 2:
              result = _context4.sent;
              _iterator5 = _createForOfIteratorHelper(result);
              _context4.prev = 4;
              _iterator5.s();
            case 6:
              if ((_step5 = _iterator5.n()).done) {
                _context4.next = 15;
                break;
              }
              doc = _step5.value;
              _context4.next = 10;
              return ReportMainBookDB.getReportTime([doc.region_id, doc.budjet_id, doc.year, doc.month]);
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
              _iterator5.e(_context4.t0);
            case 20:
              _context4.prev = 20;
              _iterator5.f();
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
        var report, _yield$MainBookSchetD2, schets, _iterator6, _step6, type, _iterator7, _step7, schet;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return ReportMainBookDB.getByIdReport([data.region_id, data.budjet_id, data.year, data.month]);
            case 2:
              report = _context5.sent;
              if (!report) {
                _context5.next = 43;
                break;
              }
              report.types = typeDocuments.map(function (item) {
                return _objectSpread({}, item);
              });
              _context5.next = 7;
              return MainBookSchetDB.getMainBookSchet([0, 99999]);
            case 7:
              _yield$MainBookSchetD2 = _context5.sent;
              schets = _yield$MainBookSchetD2.data;
              _iterator6 = _createForOfIteratorHelper(report.types);
              _context5.prev = 10;
              _iterator6.s();
            case 12:
              if ((_step6 = _iterator6.n()).done) {
                _context5.next = 35;
                break;
              }
              type = _step6.value;
              type.schets = schets.map(function (item) {
                return _objectSpread({}, item);
              });
              _iterator7 = _createForOfIteratorHelper(type.schets);
              _context5.prev = 16;
              _iterator7.s();
            case 18:
              if ((_step7 = _iterator7.n()).done) {
                _context5.next = 25;
                break;
              }
              schet = _step7.value;
              _context5.next = 22;
              return ReportMainBookDB.getSchetSummaBySchetId([data.region_id, data.year, data.month, data.budjet_id, schet.id, type.type]);
            case 22:
              schet.summa = _context5.sent;
            case 23:
              _context5.next = 18;
              break;
            case 25:
              _context5.next = 30;
              break;
            case 27:
              _context5.prev = 27;
              _context5.t0 = _context5["catch"](16);
              _iterator7.e(_context5.t0);
            case 30:
              _context5.prev = 30;
              _iterator7.f();
              return _context5.finish(30);
            case 33:
              _context5.next = 12;
              break;
            case 35:
              _context5.next = 40;
              break;
            case 37:
              _context5.prev = 37;
              _context5.t1 = _context5["catch"](10);
              _iterator6.e(_context5.t1);
            case 40:
              _context5.prev = 40;
              _iterator6.f();
              return _context5.finish(40);
            case 43:
              return _context5.abrupt("return", report);
            case 44:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[10, 37, 40, 43], [16, 27, 30, 33]]);
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
                  var result, _iterator8, _step8, type, _iterator9, _step9, schet;
                  return _regeneratorRuntime().wrap(function _callee6$(_context6) {
                    while (1) switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return ReportMainBookDB.deleteReport([data.region_id, data.query.year, data.query.month, data.query.budjet_id], client);
                      case 2:
                        result = [];
                        _iterator8 = _createForOfIteratorHelper(data.type_documents);
                        _context6.prev = 4;
                        _iterator8.s();
                      case 6:
                        if ((_step8 = _iterator8.n()).done) {
                          _context6.next = 30;
                          break;
                        }
                        type = _step8.value;
                        _iterator9 = _createForOfIteratorHelper(type.schets);
                        _context6.prev = 9;
                        _iterator9.s();
                      case 11:
                        if ((_step9 = _iterator9.n()).done) {
                          _context6.next = 20;
                          break;
                        }
                        schet = _step9.value;
                        _context6.t0 = result;
                        _context6.next = 16;
                        return ReportMainBookDB.createReport([data.user_id, tashkentTime(), null, null, data.query.main_schet_id, data.query.budjet_id, schet.id, type.type, data.body.month, data.body.year, schet.summa.debet_sum, schet.summa.kredit_sum, 1, tashkentTime(), tashkentTime()], client);
                      case 16:
                        _context6.t1 = _context6.sent;
                        _context6.t0.push.call(_context6.t0, _context6.t1);
                      case 18:
                        _context6.next = 11;
                        break;
                      case 20:
                        _context6.next = 25;
                        break;
                      case 22:
                        _context6.prev = 22;
                        _context6.t2 = _context6["catch"](9);
                        _iterator9.e(_context6.t2);
                      case 25:
                        _context6.prev = 25;
                        _iterator9.f();
                        return _context6.finish(25);
                      case 28:
                        _context6.next = 6;
                        break;
                      case 30:
                        _context6.next = 35;
                        break;
                      case 32:
                        _context6.prev = 32;
                        _context6.t3 = _context6["catch"](4);
                        _iterator8.e(_context6.t3);
                      case 35:
                        _context6.prev = 35;
                        _iterator8.f();
                        return _context6.finish(35);
                      case 38:
                        return _context6.abrupt("return", result);
                      case 39:
                      case "end":
                        return _context6.stop();
                    }
                  }, _callee6, null, [[4, 32, 35, 38], [9, 22, 25, 28]]);
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
              return ReportMainBookDB.deleteReport([data.region_id, data.year, data.month, data.budjet_id]);
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