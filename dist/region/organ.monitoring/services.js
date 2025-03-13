"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
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
var _require2 = require('./db'),
  OrganizationMonitoringDB = _require2.OrganizationMonitoringDB;
var _require3 = require('@organization/db'),
  OrganizationDB = _require3.OrganizationDB;
var _require4 = require('@region/db'),
  RegionDB = _require4.RegionDB;
var _require5 = require('@contract/db'),
  ContractDB = _require5.ContractDB;
var _require6 = require('../spravochnik/podpis/db'),
  PodpisDB = _require6.PodpisDB;
var _require7 = require('@helper/functions'),
  returnStringDate = _require7.returnStringDate,
  returnStringSumma = _require7.returnStringSumma,
  returnExcelColumn = _require7.returnExcelColumn,
  formatSubSchet = _require7.formatSubSchet;
var ExcelJS = require('exceljs');
var path = require('path');
exports.OrganizationmonitoringService = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "monitoring",
    value: function () {
      var _monitoring = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(data) {
        var docs, summa_from, summa_to, summa, total, page_rasxod_sum, page_prixod_sum, _iterator, _step, item;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return OrganizationMonitoringDB.monitoring([data.region_id, data.main_schet_id, data.operatsii, data.from, data.to, data.offset, data.limit], data.organ_id, data.search);
            case 2:
              docs = _context.sent;
              _context.next = 5;
              return OrganizationMonitoringDB.getSumma([data.region_id, data.main_schet_id, data.operatsii], {
                operator: '<',
                date: data.from
              }, null, data.organ_id, data.search);
            case 5:
              summa_from = _context.sent;
              _context.next = 8;
              return OrganizationMonitoringDB.getSumma([data.region_id, data.main_schet_id, data.operatsii], {
                operator: '<=',
                date: data.to
              }, null, data.organ_id, data.search);
            case 8:
              summa_to = _context.sent;
              _context.next = 11;
              return OrganizationMonitoringDB.getSumma([data.region_id, data.main_schet_id, data.operatsii], null, [data.from, data.to], data.organ_id, data.search);
            case 11:
              summa = _context.sent;
              _context.next = 14;
              return OrganizationMonitoringDB.getTotal([data.region_id, data.main_schet_id, data.operatsii, data.from, data.to], data.organ_id, data.search);
            case 14:
              total = _context.sent;
              page_rasxod_sum = 0;
              page_prixod_sum = 0;
              _iterator = _createForOfIteratorHelper(docs);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  item = _step.value;
                  page_prixod_sum += item.summa_prixod;
                  page_rasxod_sum += item.summa_rasxod;
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              return _context.abrupt("return", {
                data: docs,
                summa_from: summa_from,
                summa_to: summa_to,
                page_prixod_sum: page_prixod_sum,
                page_rasxod_sum: page_rasxod_sum,
                page_total_sum: page_prixod_sum - page_rasxod_sum,
                total: total,
                summa: summa,
                prixod_sum: summa.prixod_sum,
                rasxod_sum: summa.rasxod_sum
              });
            case 20:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function monitoring(_x) {
        return _monitoring.apply(this, arguments);
      }
      return monitoring;
    }()
  }, {
    key: "prixodRasxod",
    value: function () {
      var _prixodRasxod = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(data, organizations) {
        var itogo_rasxod, itogo_prixod, _iterator2, _step2, item;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              itogo_rasxod = 0;
              itogo_prixod = 0;
              _iterator2 = _createForOfIteratorHelper(organizations);
              _context2.prev = 3;
              _iterator2.s();
            case 5:
              if ((_step2 = _iterator2.n()).done) {
                _context2.next = 14;
                break;
              }
              item = _step2.value;
              _context2.next = 9;
              return OrganizationMonitoringDB.getPrixodRasxod([data.operatsii, data.to, item.id, data.budjet_id]);
            case 9:
              item.summa = _context2.sent;
              itogo_rasxod += item.summa.rasxod_sum;
              itogo_prixod += item.prixod_sum;
            case 12:
              _context2.next = 5;
              break;
            case 14:
              _context2.next = 19;
              break;
            case 16:
              _context2.prev = 16;
              _context2.t0 = _context2["catch"](3);
              _iterator2.e(_context2.t0);
            case 19:
              _context2.prev = 19;
              _iterator2.f();
              return _context2.finish(19);
            case 22:
              return _context2.abrupt("return", {
                organizations: organizations,
                itogo_rasxod: itogo_rasxod,
                itogo_prixod: itogo_prixod
              });
            case 23:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[3, 16, 19, 22]]);
      }));
      function prixodRasxod(_x2, _x3) {
        return _prixodRasxod.apply(this, arguments);
      }
      return prixodRasxod;
    }()
  }, {
    key: "cap",
    value: function () {
      var _cap = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(data) {
        var itogo_rasxod, result, uniqueSchets, _iterator3, _step3, _loop, _iterator4, _step4, item;
        return _regeneratorRuntime().wrap(function _callee3$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              itogo_rasxod = 0;
              _context4.next = 3;
              return OrganizationMonitoringDB.cap([data.region_id, data.main_schet_id, data.operatsii, data.from, data.to]);
            case 3:
              result = _context4.sent;
              uniqueSchets = Array.from(new Set(result.map(function (item) {
                return item.schet;
              }))).map(function (schet) {
                return {
                  schet: schet
                };
              });
              _iterator3 = _createForOfIteratorHelper(uniqueSchets);
              _context4.prev = 6;
              _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
                var schet, _iterator5, _step5, doc;
                return _regeneratorRuntime().wrap(function _loop$(_context3) {
                  while (1) switch (_context3.prev = _context3.next) {
                    case 0:
                      schet = _step3.value;
                      schet.summa = 0;
                      _iterator5 = _createForOfIteratorHelper(result);
                      try {
                        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                          doc = _step5.value;
                          if (schet.schet === doc.schet) {
                            schet.summa += doc.summa;
                          }
                        }
                      } catch (err) {
                        _iterator5.e(err);
                      } finally {
                        _iterator5.f();
                      }
                      schet.docs = result.filter(function (item) {
                        return item.schet === schet.schet;
                      });
                    case 5:
                    case "end":
                      return _context3.stop();
                  }
                }, _loop);
              });
              _iterator3.s();
            case 9:
              if ((_step3 = _iterator3.n()).done) {
                _context4.next = 13;
                break;
              }
              return _context4.delegateYield(_loop(), "t0", 11);
            case 11:
              _context4.next = 9;
              break;
            case 13:
              _context4.next = 18;
              break;
            case 15:
              _context4.prev = 15;
              _context4.t1 = _context4["catch"](6);
              _iterator3.e(_context4.t1);
            case 18:
              _context4.prev = 18;
              _iterator3.f();
              return _context4.finish(18);
            case 21:
              _iterator4 = _createForOfIteratorHelper(result);
              try {
                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                  item = _step4.value;
                  itogo_rasxod += item.summa;
                }
              } catch (err) {
                _iterator4.e(err);
              } finally {
                _iterator4.f();
              }
              return _context4.abrupt("return", {
                data: uniqueSchets,
                itogo_rasxod: itogo_rasxod
              });
            case 24:
            case "end":
              return _context4.stop();
          }
        }, _callee3, null, [[6, 15, 18, 21]]);
      }));
      function cap(_x4) {
        return _cap.apply(this, arguments);
      }
      return cap;
    }()
  }, {
    key: "prixodRasxodExcel",
    value: function () {
      var _prixodRasxodExcel = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(data) {
        var workbook, fileName, worksheet, title, organ_nameCell, prixodCell, rasxodCell, css_array, itogo_rasxod, itogo_prixod, row_number, _iterator6, _step6, column, _organ_nameCell, _prixodCell, _rasxodCell, _css_array, itogoStr, prixod_itogoCell, rasxod_itogoCell, filePath;
        return _regeneratorRuntime().wrap(function _callee4$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              workbook = new ExcelJS.Workbook();
              fileName = "organization_prixod_rasxod_".concat(new Date().getTime(), ".xlsx");
              worksheet = workbook.addWorksheet('organization prixod rasxod');
              worksheet.pageSetup.margins.left = 0;
              worksheet.pageSetup.margins.header = 0;
              worksheet.pageSetup.margins.footer = 0;
              worksheet.pageSetup.margins.right = 0;
              worksheet.mergeCells("A1", 'D1');
              title = worksheet.getCell("A1");
              title.value = "".concat(data.organ_name, " ").concat(returnStringDate(new Date(data.to)), " \u0445\u043E\u043B\u0430\u0442\u0438\u0433\u0430  ").concat(data.operatsii, " \u0441\u0447\u0435\u0442 \u0431\u045E\u0439\u0438\u0447\u0430 \u0434\u0435\u0431\u0438\u0442\u043E\u0440-\u043A\u0440\u0435\u0434\u0438\u0442\u043E\u0440  \u043A\u0430\u0440\u0437\u0434\u043E\u0440\u043B\u0438\u043A \u0442\u0443\u0433\u0440\u0438\u0441\u0438\u0434\u0430 \u043C\u0430\u044A\u043B\u0443\u043C\u043E\u0442 ");
              organ_nameCell = worksheet.getCell("A2");
              organ_nameCell.value = 'Наименование организации';
              prixodCell = worksheet.getCell("B2");
              prixodCell.value = "\u0414\u0435\u0431\u0438\u0442";
              rasxodCell = worksheet.getCell("C2");
              rasxodCell.value = 'Кредит';
              css_array = [title, organ_nameCell, prixodCell, rasxodCell];
              itogo_rasxod = 0;
              itogo_prixod = 0;
              row_number = 3;
              _iterator6 = _createForOfIteratorHelper(data.organizations);
              _context5.prev = 21;
              _iterator6.s();
            case 23:
              if ((_step6 = _iterator6.n()).done) {
                _context5.next = 40;
                break;
              }
              column = _step6.value;
              if (!(column.summa.summa === 0)) {
                _context5.next = 27;
                break;
              }
              return _context5.abrupt("continue", 38);
            case 27:
              _organ_nameCell = worksheet.getCell("A".concat(row_number));
              _organ_nameCell.value = column.name;
              _prixodCell = worksheet.getCell("B".concat(row_number));
              _prixodCell.value = column.summa.summa > 0 ? column.summa.summa : 0;
              itogo_prixod += _prixodCell.value;
              _rasxodCell = worksheet.getCell("C".concat(row_number));
              _rasxodCell.value = column.summa.summa < 0 ? Math.abs(column.summa.summa) : 0;
              itogo_rasxod += _rasxodCell.value;
              _css_array = [_organ_nameCell, _prixodCell, _rasxodCell];
              _css_array.forEach(function (item, index) {
                var horizontal = 'center';
                var size = 10;
                if (index === 0) horizontal = 'left';
                if (index === 1 || index === 2) horizontal = 'right';
                Object.assign(item, {
                  numFmt: '#,##0.00',
                  font: {
                    size: size,
                    color: {
                      argb: 'FF000000'
                    },
                    name: 'Times New Roman'
                  },
                  alignment: {
                    vertical: 'middle',
                    horizontal: horizontal,
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
              });
              row_number++;
            case 38:
              _context5.next = 23;
              break;
            case 40:
              _context5.next = 45;
              break;
            case 42:
              _context5.prev = 42;
              _context5.t0 = _context5["catch"](21);
              _iterator6.e(_context5.t0);
            case 45:
              _context5.prev = 45;
              _iterator6.f();
              return _context5.finish(45);
            case 48:
              itogoStr = worksheet.getCell("A".concat(row_number));
              itogoStr.value = 'Итого';
              prixod_itogoCell = worksheet.getCell("B".concat(row_number));
              prixod_itogoCell.value = itogo_prixod;
              rasxod_itogoCell = worksheet.getCell("C".concat(row_number));
              rasxod_itogoCell.value = itogo_rasxod;
              css_array.push(itogoStr, prixod_itogoCell, rasxod_itogoCell);
              css_array.forEach(function (item, index) {
                var fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: {
                    argb: 'FFFFFFFF'
                  }
                };
                var border = {
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
                };
                var horizontal = 'center';
                var size = 10;
                if (index === 0) fill = null, border = null, size = 12;
                if (index === 1) fill = null, border = {
                  bottom: {
                    style: 'thin'
                  }
                }, size = 12;
                if (index === 4) fill = null, border = null, horizontal = 'right';
                if (index > 4) horizontal = 'right';
                Object.assign(item, {
                  numFmt: '#,##0.00',
                  font: {
                    size: size,
                    bold: true,
                    color: {
                      argb: 'FF000000'
                    },
                    name: 'Times New Roman'
                  },
                  alignment: {
                    vertical: 'middle',
                    horizontal: horizontal,
                    wrapText: true
                  },
                  fill: fill,
                  border: border
                });
              });
              worksheet.getColumn(1).width = 40;
              worksheet.getColumn(2).width = 20;
              worksheet.getColumn(3).width = 20;
              worksheet.getRow(1).height = 30;
              filePath = path.join(__dirname, '../../../public/exports/' + fileName);
              _context5.next = 63;
              return workbook.xlsx.writeFile(filePath);
            case 63:
              return _context5.abrupt("return", filePath);
            case 64:
            case "end":
              return _context5.stop();
          }
        }, _callee4, null, [[21, 42, 45, 48]]);
      }));
      function prixodRasxodExcel(_x5) {
        return _prixodRasxodExcel.apply(this, arguments);
      }
      return prixodRasxodExcel;
    }()
  }, {
    key: "capExcel",
    value: function () {
      var _capExcel = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(data) {
        var workbook, fileName, worksheet, row_number, _iterator7, _step7, schet, _iterator8, _step8, doc, sub_schet, filePath;
        return _regeneratorRuntime().wrap(function _callee5$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              workbook = new ExcelJS.Workbook();
              fileName = "cap_".concat(new Date().getTime(), ".xlsx");
              worksheet = workbook.addWorksheet('organization prixod rasxod');
              worksheet.mergeCells("A1", 'F1');
              worksheet.getCell('A1').value = 'Мемориал ордер N_3';
              worksheet.mergeCells("A2", 'F2');
              worksheet.getCell('A2').value = "(".concat(data.budjet_name, " \u0431\u0443\u0434\u0436\u0435\u0442\u0438)");
              worksheet.mergeCells("A3", 'F3');
              worksheet.getCell('A3').value = "".concat(returnStringDate(new Date(data.from)), " \u0434\u0430\u043D   ").concat(returnStringDate(new Date(data.to)), " \u0433\u0430\u0447\u0430   ").concat(data.operatsii);
              worksheet.mergeCells("A4", 'F4');
              worksheet.getCell('A4').value = "\u041F\u043E\u0434\u043B\u0435\u0436\u0438\u0442 \u0437\u0430\u043F\u0438\u0441\u0438 \u0432 \u0433\u043B\u0430\u0432\u043D\u0443\u044E \u043A\u043D\u0438\u0433\u0443";
              worksheet.getCell('A5').value = 'счет';
              worksheet.getCell('B5').value = 'Тип расхода';
              worksheet.getCell('C5').value = 'Объект';
              worksheet.getCell('D5').value = 'Подобъект';
              worksheet.getCell('E5').value = 'Кредит';
              worksheet.getCell('F5').value = 'Сумма';
              worksheet.getCell('E6').value = data.operatsii;
              row_number = !data.organizations.length ? 7 : 6;
              _iterator7 = _createForOfIteratorHelper(data.organizations);
              try {
                for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                  schet = _step7.value;
                  _iterator8 = _createForOfIteratorHelper(schet.docs);
                  try {
                    for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                      doc = _step8.value;
                      sub_schet = formatSubSchet(doc.sub_schet);
                      worksheet.getCell("A".concat(row_number)).value = doc.schet;
                      worksheet.getCell("B".concat(row_number)).value = sub_schet[0];
                      worksheet.getCell("C".concat(row_number)).value = sub_schet[1];
                      worksheet.getCell("D".concat(row_number)).value = sub_schet[2];
                      worksheet.getCell("F".concat(row_number)).value = doc.summa;
                      row_number++;
                    }
                  } catch (err) {
                    _iterator8.e(err);
                  } finally {
                    _iterator8.f();
                  }
                  worksheet.mergeCells("A".concat(row_number), "E".concat(row_number));
                  worksheet.getCell("A".concat(row_number)).value = "\u0418\u0442\u043E\u0433\u043E ".concat(schet.schet);
                  worksheet.getCell("F".concat(row_number)).value = schet.summa;
                  row_number++;
                }
              } catch (err) {
                _iterator7.e(err);
              } finally {
                _iterator7.f();
              }
              worksheet.mergeCells("A".concat(row_number), "E".concat(row_number));
              worksheet.getCell("A".concat(row_number)).value = 'Всего кредита';
              worksheet.getCell("F".concat(row_number)).value = data.itogo_rasxod;
              worksheet.getColumn(1).width = 15;
              worksheet.getColumn(2).width = 15;
              worksheet.getColumn(3).width = 15;
              worksheet.getColumn(4).width = 15;
              worksheet.getColumn(5).width = 15;
              worksheet.getColumn(6).width = 20;
              worksheet.getRow(1).height = 30;
              worksheet.eachRow(function (row, rowNumber) {
                worksheet.getRow(rowNumber).height = 20;
                row.eachCell(function (cell, columnNumber) {
                  var bold = false;
                  var horizontal = "left";
                  if (rowNumber < 6) {
                    bold = true;
                    horizontal = 'center';
                  }
                  if (rowNumber > 5 && columnNumber === 6) {
                    horizontal = 'right';
                  }
                  if (rowNumber > 5 && columnNumber !== 1 && columnNumber !== 6) {
                    horizontal = 'center';
                  }
                  Object.assign(cell, {
                    numFmt: '#,##0.00',
                    font: {
                      size: 13,
                      name: 'Times New Roman',
                      bold: bold
                    },
                    alignment: {
                      vertical: "middle",
                      horizontal: horizontal,
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
                });
              });
              filePath = path.join(__dirname, '../../../public/exports/' + fileName);
              _context6.next = 35;
              return workbook.xlsx.writeFile(filePath);
            case 35:
              return _context6.abrupt("return", filePath);
            case 36:
            case "end":
              return _context6.stop();
          }
        }, _callee5);
      }));
      function capExcel(_x6) {
        return _capExcel.apply(this, arguments);
      }
      return capExcel;
    }()
  }, {
    key: "consolidated",
    value: function () {
      var _consolidated = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(data) {
        var _iterator9, _step9, _loop2;
        return _regeneratorRuntime().wrap(function _callee6$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _iterator9 = _createForOfIteratorHelper(data.organizations);
              _context8.prev = 1;
              _loop2 = /*#__PURE__*/_regeneratorRuntime().mark(function _loop2() {
                var organ, contract_id, itogo_rasxod;
                return _regeneratorRuntime().wrap(function _loop2$(_context7) {
                  while (1) switch (_context7.prev = _context7.next) {
                    case 0:
                      organ = _step9.value;
                      contract_id = data.contract ? organ.contract_id : null;
                      _context7.next = 4;
                      return OrganizationMonitoringDB.getSummaConsolidated([data.region_id, data.main_schet_id, data.operatsii, data.from, organ.id], '<', contract_id);
                    case 4:
                      organ.summa_from = _context7.sent;
                      _context7.next = 7;
                      return OrganizationMonitoringDB.getSummaPrixodConsolidated([data.region_id, data.main_schet_id, data.operatsii, data.from, data.to, organ.id], contract_id);
                    case 7:
                      organ.summa_bank_rasxod_prixod = _context7.sent;
                      _context7.next = 10;
                      return OrganizationMonitoringDB.getSummaAktConsolidated([data.region_id, data.main_schet_id, data.operatsii, data.from, data.to, organ.id], contract_id);
                    case 10:
                      organ.summa_akt_rasxod = _context7.sent;
                      _context7.next = 13;
                      return OrganizationMonitoringDB.getSummaJur7Consolidated([data.region_id, data.main_schet_id, data.operatsii, data.from, data.to, organ.id], contract_id);
                    case 13:
                      organ.summa_jur7_rasxod = _context7.sent;
                      _context7.next = 16;
                      return OrganizationMonitoringDB.getSummaBankPrixodConsolidated([data.region_id, data.main_schet_id, data.operatsii, data.from, data.to, organ.id], contract_id);
                    case 16:
                      organ.summa_bank_prixod_rasxod = _context7.sent;
                      itogo_rasxod = 0;
                      organ.summa_akt_rasxod.forEach(function (item) {
                        itogo_rasxod += item.summa;
                      });
                      organ.summa_jur7_rasxod.forEach(function (item) {
                        itogo_rasxod += item.summa;
                      });
                      organ.summa_bank_prixod_rasxod.forEach(function (item) {
                        itogo_rasxod += item.summa;
                      });
                      organ.itogo_rasxod = {
                        schet: "itogo_kredit",
                        summa: itogo_rasxod
                      };
                      _context7.next = 24;
                      return OrganizationMonitoringDB.getSummaConsolidated([data.region_id, data.main_schet_id, data.operatsii, data.to, organ.id], '<=', contract_id);
                    case 24:
                      organ.summa_to = _context7.sent;
                      _context7.next = 27;
                      return OrganizationMonitoringDB.getRasxodSchets([data.region_id, data.main_schet_id, data.operatsii, data.from, data.to], contract_id);
                    case 27:
                      data.rasxodSchets = _context7.sent;
                      data.rasxodSchets.push({
                        schet: 'itogo_rasxod'
                      });
                    case 29:
                    case "end":
                      return _context7.stop();
                  }
                }, _loop2);
              });
              _iterator9.s();
            case 4:
              if ((_step9 = _iterator9.n()).done) {
                _context8.next = 8;
                break;
              }
              return _context8.delegateYield(_loop2(), "t0", 6);
            case 6:
              _context8.next = 4;
              break;
            case 8:
              _context8.next = 13;
              break;
            case 10:
              _context8.prev = 10;
              _context8.t1 = _context8["catch"](1);
              _iterator9.e(_context8.t1);
            case 13:
              _context8.prev = 13;
              _iterator9.f();
              return _context8.finish(13);
            case 16:
              return _context8.abrupt("return", {
                organizations: data.organizations,
                rasxodSchets: data.rasxodSchets
              });
            case 17:
            case "end":
              return _context8.stop();
          }
        }, _callee6, null, [[1, 10, 13, 16]]);
      }));
      function consolidated(_x7) {
        return _consolidated.apply(this, arguments);
      }
      return consolidated;
    }()
  }, {
    key: "consolidatedExcel",
    value: function () {
      var _consolidatedExcel = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(data) {
        var workbook, fileName, worksheet, endRasxodSchetsColumn, _iterator10, _step10, _loop3, filePath;
        return _regeneratorRuntime().wrap(function _callee7$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              workbook = new ExcelJS.Workbook();
              fileName = "consolidated_".concat(new Date().getTime(), ".xlsx");
              worksheet = workbook.addWorksheet('consolelidated');
              worksheet.mergeCells("A1", 'C1');
              worksheet.getCell('A1').value = 'Мемориал ордер N_3';
              worksheet.mergeCells("A2", 'C2');
              worksheet.getCell('A2').value = "\"\u0420\u0430\u0441\u0447\u0435\u0442\u044B \u0441 \u0434\u0435\u0431\u0435\u0442\u043E\u0440\u0430\u043C\u0438 \u0438 \u043A\u0440\u0435\u0434\u0438\u0442\u043E\u0440\u0430\u043C\u0438\"";
              worksheet.mergeCells("A3", 'C3');
              worksheet.getCell('A3').value = "".concat(returnStringDate(new Date(data.to)), " \u0445\u043E\u043B\u0430\u0442\u0438\u0433\u0430  ").concat(data.operatsii);
              worksheet.mergeCells("A4", 'A5');
              worksheet.mergeCells("B4", 'C4');
              worksheet.getCell('B4').value = "\u041E\u0441\u0442\u0430\u0442\u043E\u043A \u043A \u043D\u0430\u0447\u0430\u043B\u043E";
              worksheet.getCell('D4').value = 'Дебет';
              endRasxodSchetsColumn = data.rasxodSchets.length + 4;
              worksheet.mergeCells("E4", "".concat(returnExcelColumn([endRasxodSchetsColumn]), "4"));
              worksheet.getCell('E4').value = 'Кредит счета';
              worksheet.mergeCells("".concat(returnExcelColumn([endRasxodSchetsColumn + 1]), "4"), "".concat(returnExcelColumn([endRasxodSchetsColumn + 2]), "4"));
              worksheet.getCell("".concat(returnExcelColumn([endRasxodSchetsColumn + 1]), "4")).value = 'Остаток к конец';
              worksheet.getRow(5).values = ['Организатсия', 'Дебет', 'Кредит', ''].concat(_toConsumableArray(data.rasxodSchets.map(function (item) {
                if (item.schet === 'itogo_rasxod') {
                  return 'итого кредит';
                } else {
                  return item.schet;
                }
              })), ['Дебет', 'Кредит']);
              worksheet.columns = [{
                key: 'name'
              }, {
                key: 'prixod_from'
              }, {
                key: 'rasxod_from'
              }, {
                key: "_prixod_".concat(data.operatsii)
              }].concat(_toConsumableArray(data.rasxodSchets.map(function (item) {
                return {
                  key: "_rasxod_".concat(item.schet)
                };
              })), [{
                key: 'prixod_to'
              }, {
                key: 'rasxod_to'
              }]);
              _iterator10 = _createForOfIteratorHelper(data.organizations);
              _context10.prev = 21;
              _loop3 = /*#__PURE__*/_regeneratorRuntime().mark(function _loop3() {
                var _organ$summa_bank_ras;
                var organ, values;
                return _regeneratorRuntime().wrap(function _loop3$(_context9) {
                  while (1) switch (_context9.prev = _context9.next) {
                    case 0:
                      organ = _step10.value;
                      if (!(organ.summa_from.summa === 0 && organ.summa_to.summa === 0)) {
                        _context9.next = 3;
                        break;
                      }
                      return _context9.abrupt("return", 1);
                    case 3:
                      values = data.rasxodSchets.reduce(function (acc, item) {
                        var schetKey = "_rasxod_".concat(item.schet);
                        var matchAkt = organ.summa_akt_rasxod.find(function (i) {
                          return i.schet === item.schet;
                        });
                        var matchBankPrixod = organ.summa_bank_prixod_rasxod.find(function (i) {
                          return i.schet === item.schet;
                        });
                        var matchJur7 = organ.summa_jur7_rasxod.find(function (i) {
                          return i.schet === item.schet;
                        });
                        if (!matchAkt && !matchBankPrixod && !matchJur7 && item.schet !== 'itogo_rasxod') {
                          acc.push({
                            schet: schetKey,
                            summa: ''
                          });
                        }
                        if (matchAkt) acc.push({
                          schet: schetKey,
                          summa: matchAkt.summa
                        });
                        if (matchBankPrixod) acc.push({
                          schet: schetKey,
                          summa: matchBankPrixod.summa
                        });
                        if (matchJur7) acc.push({
                          schet: schetKey,
                          summa: matchJur7.summa
                        });
                        if (item.schet === 'itogo_rasxod') {
                          acc.push({
                            schet: schetKey,
                            summa: organ.itogo_rasxod.summa
                          });
                        }
                        return acc;
                      }, []);
                      worksheet.addRow(_objectSpread(_objectSpread(_defineProperty({
                        name: organ.name,
                        prixod_from: Math.max(organ.summa_from.summa, 0),
                        rasxod_from: Math.max(-organ.summa_from.summa, 0)
                      }, "_prixod_".concat(data.operatsii), ((_organ$summa_bank_ras = organ.summa_bank_rasxod_prixod[0]) === null || _organ$summa_bank_ras === void 0 ? void 0 : _organ$summa_bank_ras.summa) || ''), values.reduce(function (acc, _ref) {
                        var schet = _ref.schet,
                          summa = _ref.summa;
                        acc[schet] = summa;
                        return acc;
                      }, {})), {}, {
                        prixod_to: Math.max(organ.summa_to.summa, 0),
                        rasxod_to: Math.max(-organ.summa_to.summa, 0)
                      }));
                    case 5:
                    case "end":
                      return _context9.stop();
                  }
                }, _loop3);
              });
              _iterator10.s();
            case 24:
              if ((_step10 = _iterator10.n()).done) {
                _context10.next = 30;
                break;
              }
              return _context10.delegateYield(_loop3(), "t0", 26);
            case 26:
              if (!_context10.t0) {
                _context10.next = 28;
                break;
              }
              return _context10.abrupt("continue", 28);
            case 28:
              _context10.next = 24;
              break;
            case 30:
              _context10.next = 35;
              break;
            case 32:
              _context10.prev = 32;
              _context10.t1 = _context10["catch"](21);
              _iterator10.e(_context10.t1);
            case 35:
              _context10.prev = 35;
              _iterator10.f();
              return _context10.finish(35);
            case 38:
              worksheet.eachRow(function (row, rowNumber) {
                var bold = false;
                if (rowNumber < 6) {
                  worksheet.getRow(rowNumber).height = 30;
                  bold = true;
                }
                row.eachCell(function (cell, columnNumber) {
                  if (columnNumber === 1) {
                    worksheet.getColumn(columnNumber).width = 40;
                  } else {
                    worksheet.getColumn(columnNumber).width = 18;
                  }
                  Object.assign(cell, {
                    numFmt: "#0.00",
                    font: {
                      size: 13,
                      name: 'Times New Roman',
                      bold: bold
                    },
                    alignment: {
                      vertical: "middle",
                      horizontal: "center",
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
                });
              });
              filePath = path.join(__dirname, '../../../public/exports/' + fileName);
              _context10.next = 42;
              return workbook.xlsx.writeFile(filePath);
            case 42:
              return _context10.abrupt("return", {
                filePath: filePath,
                fileName: fileName
              });
            case 43:
            case "end":
              return _context10.stop();
          }
        }, _callee7, null, [[21, 32, 35, 38]]);
      }));
      function consolidatedExcel(_x8) {
        return _consolidatedExcel.apply(this, arguments);
      }
      return consolidatedExcel;
    }()
  }, {
    key: "consolidatedByContractExcel",
    value: function () {
      var _consolidatedByContractExcel = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(data) {
        var workbook, fileName, worksheet, endRasxodSchetsColumn, _iterator11, _step11, _loop4, filePath;
        return _regeneratorRuntime().wrap(function _callee8$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              workbook = new ExcelJS.Workbook();
              fileName = "consolidated_".concat(new Date().getTime(), ".xlsx");
              worksheet = workbook.addWorksheet('consolelidated');
              worksheet.mergeCells("A1", 'C1');
              worksheet.getCell('A1').value = 'Мемориал ордер N_3';
              worksheet.mergeCells("A2", 'C2');
              worksheet.getCell('A2').value = "\"\u0420\u0430\u0441\u0447\u0435\u0442\u044B \u0441 \u0434\u0435\u0431\u0435\u0442\u043E\u0440\u0430\u043C\u0438 \u0438 \u043A\u0440\u0435\u0434\u0438\u0442\u043E\u0440\u0430\u043C\u0438\"";
              worksheet.mergeCells("A3", 'C3');
              worksheet.getCell('A3').value = "".concat(returnStringDate(new Date(data.to)), " \u0445\u043E\u043B\u0430\u0442\u0438\u0433\u0430  ").concat(data.operatsii);
              worksheet.mergeCells("A4", 'A5');
              worksheet.mergeCells("B4", 'C4');
              worksheet.getCell('B4').value = "\u041E\u0441\u0442\u0430\u0442\u043E\u043A \u043A \u043D\u0430\u0447\u0430\u043B\u043E";
              worksheet.mergeCells("D4", 'E4');
              worksheet.getCell('D4').value = 'Договор ';
              worksheet.getCell('F4').value = 'Дебет';
              endRasxodSchetsColumn = data.rasxodSchets.length + 6;
              worksheet.mergeCells("G4", "".concat(returnExcelColumn([endRasxodSchetsColumn]), "4"));
              worksheet.getCell('G4').value = 'Кредит счета';
              worksheet.mergeCells("".concat(returnExcelColumn([endRasxodSchetsColumn + 1]), "4"), "".concat(returnExcelColumn([endRasxodSchetsColumn + 2]), "4"));
              worksheet.getCell("".concat(returnExcelColumn([endRasxodSchetsColumn + 1]), "4")).value = 'Остаток к конец';
              worksheet.getRow(5).values = ['Организатсия', 'Номер', 'Дата', 'Дебет', 'Кредит', data.operatsii].concat(_toConsumableArray(data.rasxodSchets.map(function (item) {
                if (item.schet === 'itogo_rasxod') {
                  return 'итого кредит';
                } else {
                  return item.schet;
                }
              })), ['Дебет', 'Кредит']);
              worksheet.columns = [{
                key: 'name'
              }, {
                key: 'contract_number'
              }, {
                key: 'contract_date'
              }, {
                key: 'prixod_from'
              }, {
                key: 'rasxod_from'
              }, {
                key: "_prixod_".concat(data.operatsii)
              }].concat(_toConsumableArray(data.rasxodSchets.map(function (item) {
                return {
                  key: "_rasxod_".concat(item.schet)
                };
              })), [{
                key: 'prixod_to'
              }, {
                key: 'rasxod_to'
              }]);
              _iterator11 = _createForOfIteratorHelper(data.organizations);
              _context12.prev = 23;
              _loop4 = /*#__PURE__*/_regeneratorRuntime().mark(function _loop4() {
                var _organ$summa_bank_ras2;
                var organ, values;
                return _regeneratorRuntime().wrap(function _loop4$(_context11) {
                  while (1) switch (_context11.prev = _context11.next) {
                    case 0:
                      organ = _step11.value;
                      if (!(organ.summa_from.summa === 0 && organ.summa_to.summa === 0)) {
                        _context11.next = 3;
                        break;
                      }
                      return _context11.abrupt("return", 1);
                    case 3:
                      values = data.rasxodSchets.reduce(function (acc, item) {
                        var schetKey = "_rasxod_".concat(item.schet);
                        var matchAkt = organ.summa_akt_rasxod.find(function (i) {
                          return i.schet === item.schet;
                        });
                        var matchBankPrixod = organ.summa_bank_prixod_rasxod.find(function (i) {
                          return i.schet === item.schet;
                        });
                        var matchJur7 = organ.summa_jur7_rasxod.find(function (i) {
                          return i.schet === item.schet;
                        });
                        if (!matchAkt && !matchBankPrixod && !matchJur7 && item.schet !== 'itogo_rasxod') {
                          acc.push({
                            schet: schetKey,
                            summa: ''
                          });
                        }
                        if (matchAkt) acc.push({
                          schet: schetKey,
                          summa: matchAkt.summa
                        });
                        if (matchBankPrixod) acc.push({
                          schet: schetKey,
                          summa: matchBankPrixod.summa
                        });
                        if (matchJur7) acc.push({
                          schet: schetKey,
                          summa: matchJur7.summa
                        });
                        if (item.schet === 'itogo_rasxod') {
                          acc.push({
                            schet: schetKey,
                            summa: organ.itogo_rasxod.summa
                          });
                        }
                        return acc;
                      }, []);
                      worksheet.addRow(_objectSpread(_objectSpread(_defineProperty({
                        name: organ.name,
                        contract_number: organ.doc_num,
                        contract_date: organ.doc_date,
                        prixod_from: Math.max(organ.summa_from.summa, 0),
                        rasxod_from: Math.max(-organ.summa_from.summa, 0)
                      }, "_prixod_".concat(data.operatsii), ((_organ$summa_bank_ras2 = organ.summa_bank_rasxod_prixod[0]) === null || _organ$summa_bank_ras2 === void 0 ? void 0 : _organ$summa_bank_ras2.summa) || ''), values.reduce(function (acc, _ref2) {
                        var schet = _ref2.schet,
                          summa = _ref2.summa;
                        acc[schet] = summa;
                        return acc;
                      }, {})), {}, {
                        prixod_to: Math.max(organ.summa_to.summa, 0),
                        rasxod_to: Math.max(-organ.summa_to.summa, 0)
                      }));
                    case 5:
                    case "end":
                      return _context11.stop();
                  }
                }, _loop4);
              });
              _iterator11.s();
            case 26:
              if ((_step11 = _iterator11.n()).done) {
                _context12.next = 32;
                break;
              }
              return _context12.delegateYield(_loop4(), "t0", 28);
            case 28:
              if (!_context12.t0) {
                _context12.next = 30;
                break;
              }
              return _context12.abrupt("continue", 30);
            case 30:
              _context12.next = 26;
              break;
            case 32:
              _context12.next = 37;
              break;
            case 34:
              _context12.prev = 34;
              _context12.t1 = _context12["catch"](23);
              _iterator11.e(_context12.t1);
            case 37:
              _context12.prev = 37;
              _iterator11.f();
              return _context12.finish(37);
            case 40:
              worksheet.eachRow(function (row, rowNumber) {
                var bold = false;
                if (rowNumber < 6) {
                  worksheet.getRow(rowNumber).height = 30;
                  bold = true;
                }
                row.eachCell(function (cell, columnNumber) {
                  if (columnNumber === 1) {
                    worksheet.getColumn(columnNumber).width = 40;
                  } else {
                    worksheet.getColumn(columnNumber).width = 18;
                  }
                  Object.assign(cell, {
                    numFmt: "#0.00",
                    font: {
                      size: 13,
                      name: 'Times New Roman',
                      bold: bold
                    },
                    alignment: {
                      vertical: "middle",
                      horizontal: "center",
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
                });
              });
              filePath = path.join(__dirname, '../../../public/exports/' + fileName);
              _context12.next = 44;
              return workbook.xlsx.writeFile(filePath);
            case 44:
              return _context12.abrupt("return", {
                filePath: filePath,
                fileName: fileName
              });
            case 45:
            case "end":
              return _context12.stop();
          }
        }, _callee8, null, [[23, 34, 37, 40]]);
      }));
      function consolidatedByContractExcel(_x9) {
        return _consolidatedByContractExcel.apply(this, arguments);
      }
      return consolidatedByContractExcel;
    }()
  }, {
    key: "aktSverka",
    value: function () {
      var _aktSverka = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
        var _podpis$, _podpis$2;
        var region_id, _req$query, main_schet_id, contract_id, organ_id, to, from, region, main_schet, organization, contract, data, summa_from, summa_to, podpis, summa_rasxod, summa_prixod, _iterator12, _step12, item, head, title, workbook, fileName, worksheet, headCell, titleCell, row1Cell, row2Cell, row3Cell, empty, debit1, kridit1, debit2, kridit2, empty2, debit1_2, kridit1_2, debit2_2, kridit2_2, _iterator13, _step13, _item, _row_number, text, row1, rowHeight, row, _debit, _kridit, _debit2, _kridit2, summa_array, row_number, empty3, debit3, kridit3, debit3_2, kridit3_2, empty4, debit4, kridit4, debit4_2, kridit4_2, footer, podotchet, organ, imzo1, imzo2, array_headers, titleLength, filePath;
        return _regeneratorRuntime().wrap(function _callee9$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              region_id = req.user.region_id;
              _req$query = req.query, main_schet_id = _req$query.main_schet_id, contract_id = _req$query.contract_id, organ_id = _req$query.organ_id, to = _req$query.to, from = _req$query.from;
              _context13.next = 4;
              return RegionDB.getById([region_id]);
            case 4:
              region = _context13.sent;
              if (region) {
                _context13.next = 7;
                break;
              }
              return _context13.abrupt("return", res.status(404).json({
                message: "region not found"
              }));
            case 7:
              _context13.next = 9;
              return MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
            case 9:
              main_schet = _context13.sent;
              if (main_schet) {
                _context13.next = 12;
                break;
              }
              return _context13.abrupt("return", res.status(404).json({
                message: "main schet not found"
              }));
            case 12:
              _context13.next = 14;
              return OrganizationDB.getById([region_id, organ_id]);
            case 14:
              organization = _context13.sent;
              if (organization) {
                _context13.next = 17;
                break;
              }
              return _context13.abrupt("return", res.status(404).json({
                message: "organization not found"
              }));
            case 17:
              if (!contract_id) {
                _context13.next = 23;
                break;
              }
              _context13.next = 20;
              return ContractDB.getById([region_id, contract_id], true, main_schet.spravochnik_budjet_name_id, organ_id);
            case 20:
              contract = _context13.sent;
              if (contract) {
                _context13.next = 23;
                break;
              }
              return _context13.abrupt("return", res.status(404).json({
                message: "contract not found"
              }));
            case 23:
              _context13.next = 25;
              return OrganizationMonitoringDB.getByContractIdData([from, to, organ_id], contract_id);
            case 25:
              data = _context13.sent;
              _context13.next = 28;
              return OrganizationMonitoringDB.getByContractIdSumma([from, organ_id], '<', contract_id);
            case 28:
              summa_from = _context13.sent;
              _context13.next = 31;
              return OrganizationMonitoringDB.getByContractIdSumma([to, organ_id], '<=', contract_id);
            case 31:
              summa_to = _context13.sent;
              _context13.next = 34;
              return PodpisDB.getPodpis([region_id], 'akkt_sverka');
            case 34:
              podpis = _context13.sent;
              summa_rasxod = 0;
              summa_prixod = 0;
              _iterator12 = _createForOfIteratorHelper(data);
              try {
                for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
                  item = _step12.value;
                  summa_rasxod += item.summa_rasxod;
                  summa_prixod += item.summa_prixod;
                }
              } catch (err) {
                _iterator12.e(err);
              } finally {
                _iterator12.f();
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
              _iterator13 = _createForOfIteratorHelper(data);
              try {
                for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
                  _item = _step13.value;
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
                _iterator13.e(err);
              } finally {
                _iterator13.f();
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
              _context13.next = 168;
              return workbook.xlsx.writeFile(filePath);
            case 168:
              return _context13.abrupt("return", res.download(filePath, function (err) {
                if (err) throw new ErrorResponse(err, err.statusCode);
              }));
            case 169:
            case "end":
              return _context13.stop();
          }
        }, _callee9);
      }));
      function aktSverka(_x10, _x11) {
        return _aktSverka.apply(this, arguments);
      }
      return aktSverka;
    }()
  }]);
}();