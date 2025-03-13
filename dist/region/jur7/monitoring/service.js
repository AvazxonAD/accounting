"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
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
var _require = require('./db'),
  Jur7MonitoringDB = _require.Jur7MonitoringDB;
var ExcelJS = require('exceljs');
var path = require('path');
var _require2 = require('@helper/functions'),
  HelperFunctions = _require2.HelperFunctions;
var _require$promises = require('fs').promises,
  access = _require$promises.access,
  constants = _require$promises.constants,
  mkdir = _require$promises.mkdir;
exports.Jur7MonitoringService = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "cap",
    value: function () {
      var _cap = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(data) {
        var result, _iterator, _step, schet, _iterator2, _step2, _schet, _iterator3, _step3, _schet2, _iterator4, _step4, _schet3;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              result = {
                schets_summa: 0,
                debet_sub_schets_summa: 0,
                kredit_sub_schets_summa: 0,
                iznos_summa: 0
              };
              _context.next = 3;
              return Jur7MonitoringDB.getSchetsForCap([data.budjet_id, data.region_id, data.from, data.to]);
            case 3:
              result.schets = _context.sent;
              _iterator = _createForOfIteratorHelper(result.schets);
              _context.prev = 5;
              _iterator.s();
            case 7:
              if ((_step = _iterator.n()).done) {
                _context.next = 15;
                break;
              }
              schet = _step.value;
              _context.next = 11;
              return Jur7MonitoringDB.getCapSchetSumma([data.budjet_id, data.region_id, data.from, data.to, schet.debet_schet, schet.kredit_schet]);
            case 11:
              schet.summa = _context.sent;
              result.schets_summa += schet.summa;
            case 13:
              _context.next = 7;
              break;
            case 15:
              _context.next = 20;
              break;
            case 17:
              _context.prev = 17;
              _context.t0 = _context["catch"](5);
              _iterator.e(_context.t0);
            case 20:
              _context.prev = 20;
              _iterator.f();
              return _context.finish(20);
            case 23:
              _context.next = 25;
              return Jur7MonitoringDB.getDebetSubSchetsForCap([data.budjet_id, data.region_id, data.from, data.to]);
            case 25:
              result.debet_sub_schets = _context.sent;
              _iterator2 = _createForOfIteratorHelper(result.debet_sub_schets);
              _context.prev = 27;
              _iterator2.s();
            case 29:
              if ((_step2 = _iterator2.n()).done) {
                _context.next = 37;
                break;
              }
              _schet = _step2.value;
              _context.next = 33;
              return Jur7MonitoringDB.getDebetSubSchetSumma([data.budjet_id, data.region_id, data.from, data.to, _schet.debet_sub_schet]);
            case 33:
              _schet.summa = _context.sent;
              result.debet_sub_schets_summa += _schet.summa;
            case 35:
              _context.next = 29;
              break;
            case 37:
              _context.next = 42;
              break;
            case 39:
              _context.prev = 39;
              _context.t1 = _context["catch"](27);
              _iterator2.e(_context.t1);
            case 42:
              _context.prev = 42;
              _iterator2.f();
              return _context.finish(42);
            case 45:
              _context.next = 47;
              return Jur7MonitoringDB.getKreditSubSchetsForCap([data.budjet_id, data.region_id, data.from, data.to]);
            case 47:
              result.kredit_sub_schets = _context.sent;
              _iterator3 = _createForOfIteratorHelper(result.kredit_sub_schets);
              _context.prev = 49;
              _iterator3.s();
            case 51:
              if ((_step3 = _iterator3.n()).done) {
                _context.next = 59;
                break;
              }
              _schet2 = _step3.value;
              _context.next = 55;
              return Jur7MonitoringDB.getKreditSubSchetSumma([data.budjet_id, data.region_id, data.from, data.to, _schet2.kredit_sub_schet]);
            case 55:
              _schet2.summa = _context.sent;
              result.kredit_sub_schets_summa += _schet2.summa;
            case 57:
              _context.next = 51;
              break;
            case 59:
              _context.next = 64;
              break;
            case 61:
              _context.prev = 61;
              _context.t2 = _context["catch"](49);
              _iterator3.e(_context.t2);
            case 64:
              _context.prev = 64;
              _iterator3.f();
              return _context.finish(64);
            case 67:
              _context.next = 69;
              return Jur7MonitoringDB.getIznosSummaByProvodkaSubSchet([data.budjet_id, data.region_id, data.from, data.to]);
            case 69:
              result.iznos_schets = _context.sent;
              _iterator4 = _createForOfIteratorHelper(result.iznos_schets);
              try {
                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                  _schet3 = _step4.value;
                  result.iznos_summa += _schet3.summa;
                }
              } catch (err) {
                _iterator4.e(err);
              } finally {
                _iterator4.f();
              }
              return _context.abrupt("return", result);
            case 73:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[5, 17, 20, 23], [27, 39, 42, 45], [49, 61, 64, 67]]);
      }));
      function cap(_x) {
        return _cap.apply(this, arguments);
      }
      return cap;
    }()
  }, {
    key: "capExcel",
    value: function () {
      var _capExcel = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(data) {
        var workbook, fileName, worksheet, row_number, _iterator5, _step5, doc, _iterator6, _step6, _doc, format, _iterator7, _step7, _doc2, _format, _iterator8, _step8, _doc3, _format2, filePath;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              workbook = new ExcelJS.Workbook();
              fileName = "cap_".concat(new Date().getTime(), ".xlsx");
              worksheet = workbook.addWorksheet('organization prixod rasxod');
              worksheet.mergeCells("A1", 'D1');
              worksheet.getCell('A1').value = 'Мемориал ордер N_7';
              worksheet.mergeCells("A2", 'D2');
              worksheet.getCell('A2').value = "".concat(HelperFunctions.returnStringDate(new Date(data.from)), " \u0434\u0430\u043D   ").concat(HelperFunctions.returnStringDate(new Date(data.to)), " \u0433\u0430\u0447\u0430");
              worksheet.mergeCells("A3", 'D3');
              worksheet.getCell('A3').value = "\u041F\u043E\u0434\u043B\u0435\u0436\u0438\u0442 \u0437\u0430\u043F\u0438\u0441\u0438 \u0432 \u0433\u043B\u0430\u0432\u043D\u0443\u044E \u043A\u043D\u0438\u0433\u0443";
              worksheet.getCell('A4').value = 'Дебет';
              worksheet.getCell('B4').value = 'Кредит';
              worksheet.getCell('C4').value = 'Сумма';
              row_number = !data.schets.length ? 5 : 4;
              _iterator5 = _createForOfIteratorHelper(data.schets);
              try {
                for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                  doc = _step5.value;
                  worksheet.getCell("A".concat(row_number)).value = doc.debet_schet;
                  worksheet.getCell("B".concat(row_number)).value = doc.kredit_schet;
                  worksheet.getCell("C".concat(row_number)).value = doc.summa;
                  row_number++;
                }
              } catch (err) {
                _iterator5.e(err);
              } finally {
                _iterator5.f();
              }
              worksheet.getCell("C".concat(row_number)).value = data.schets_summa;
              row_number += 3;
              worksheet.mergeCells("A".concat(row_number), "D".concat(row_number));
              worksheet.getCell("A".concat(row_number)).value = 'Расшифировка дебета';
              row_number++;
              worksheet.getCell("A".concat(row_number)).value = "\u0422\u0438\u043F \u0440\u0430\u0441\u0445\u043E\u0434\u0430";
              worksheet.getCell("B".concat(row_number)).value = "\u041E\u0431\u044A\u0435\u043A\u0442";
              worksheet.getCell("C".concat(row_number)).value = "\u041F\u043E\u0434";
              worksheet.getCell("D".concat(row_number)).value = "\u0421\u0443\u043C\u043C\u0430";
              row_number++;
              _iterator6 = _createForOfIteratorHelper(data.debet_sub_schets);
              try {
                for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                  _doc = _step6.value;
                  format = HelperFunctions.formatSubSchet(_doc.debet_sub_schet);
                  worksheet.getCell("A".concat(row_number)).value = format[0];
                  worksheet.getCell("B".concat(row_number)).value = format[1];
                  worksheet.getCell("C".concat(row_number)).value = format[2];
                  worksheet.getCell("D".concat(row_number)).value = _doc.summa;
                  row_number++;
                }
              } catch (err) {
                _iterator6.e(err);
              } finally {
                _iterator6.f();
              }
              worksheet.getCell("D".concat(row_number)).value = data.debet_sub_schets_summa;
              row_number += 3;
              worksheet.mergeCells("A".concat(row_number), "D".concat(row_number));
              worksheet.getCell("A".concat(row_number)).value = 'Расшифировка кредита';
              row_number++;
              worksheet.getCell("A".concat(row_number)).value = "\u0422\u0438\u043F \u0440\u0430\u0441\u0445\u043E\u0434\u0430";
              worksheet.getCell("B".concat(row_number)).value = "\u041E\u0431\u044A\u0435\u043A\u0442";
              worksheet.getCell("C".concat(row_number)).value = "\u041F\u043E\u0434";
              worksheet.getCell("D".concat(row_number)).value = "\u0421\u0443\u043C\u043C\u0430";
              row_number++;
              _iterator7 = _createForOfIteratorHelper(data.kredit_sub_schets);
              try {
                for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                  _doc2 = _step7.value;
                  _format = HelperFunctions.formatSubSchet(_doc2.kredit_sub_schet);
                  worksheet.getCell("A".concat(row_number)).value = _format[0];
                  worksheet.getCell("B".concat(row_number)).value = _format[1];
                  worksheet.getCell("C".concat(row_number)).value = _format[2];
                  worksheet.getCell("D".concat(row_number)).value = _doc2.summa;
                  row_number++;
                }
              } catch (err) {
                _iterator7.e(err);
              } finally {
                _iterator7.f();
              }
              worksheet.getCell("D".concat(row_number)).value = data.kredit_sub_schets_summa;
              row_number += 3;
              worksheet.mergeCells("A".concat(row_number), "D".concat(row_number));
              worksheet.getCell("A".concat(row_number)).value = 'Расшифировка дебета износ';
              row_number++;
              worksheet.getCell("A".concat(row_number)).value = "\u0422\u0438\u043F \u0440\u0430\u0441\u0445\u043E\u0434\u0430";
              worksheet.getCell("B".concat(row_number)).value = "\u041E\u0431\u044A\u0435\u043A\u0442";
              worksheet.getCell("C".concat(row_number)).value = "\u041F\u043E\u0434";
              worksheet.getCell("D".concat(row_number)).value = "\u0421\u0443\u043C\u043C\u0430";
              row_number++;
              _iterator8 = _createForOfIteratorHelper(data.iznos_schets);
              try {
                for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                  _doc3 = _step8.value;
                  _format2 = HelperFunctions.formatSubSchet(_doc3.provodka_subschet);
                  worksheet.getCell("A".concat(row_number)).value = _format2[0];
                  worksheet.getCell("B".concat(row_number)).value = _format2[1];
                  worksheet.getCell("C".concat(row_number)).value = _format2[2];
                  worksheet.getCell("D".concat(row_number)).value = _doc3.summa;
                  row_number++;
                }
              } catch (err) {
                _iterator8.e(err);
              } finally {
                _iterator8.f();
              }
              worksheet.getCell("D".concat(row_number)).value = data.iznos_summa;
              worksheet.getColumn(1).width = 15;
              worksheet.getColumn(2).width = 15;
              worksheet.getColumn(3).width = 30;
              worksheet.getColumn(4).width = 30;
              worksheet.getRow(1).height = 30;
              worksheet.eachRow(function (row, rowNumber) {
                worksheet.getRow(rowNumber).height = 18;
                row.eachCell(function (cell, columnNumber) {
                  var bold = false;
                  var horizontal = "center";
                  if (rowNumber < 3) {
                    bold = true;
                  }
                  if (rowNumber > 3 && columnNumber === 3) {
                    horizontal = 'right';
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
              filePath = path.join(__dirname, '../../../../public/exports/' + fileName);
              _context2.next = 61;
              return workbook.xlsx.writeFile(filePath);
            case 61:
              return _context2.abrupt("return", {
                filePath: filePath,
                fileName: fileName
              });
            case 62:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function capExcel(_x2) {
        return _capExcel.apply(this, arguments);
      }
      return capExcel;
    }()
  }, {
    key: "backCap",
    value: function () {
      var _backCap = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(data) {
        var result, _iterator9, _step9, item, _iterator10, _step10, _item;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return Jur7MonitoringDB.getSchetsForBackCap([data.budjet_id, data.region_id, data.from, data.to]);
            case 2:
              result = _context3.sent;
              result.debet_sum = 0;
              result.kredit_sum = 0;
              _iterator9 = _createForOfIteratorHelper(result.kredit_schets);
              _context3.prev = 6;
              _iterator9.s();
            case 8:
              if ((_step9 = _iterator9.n()).done) {
                _context3.next = 16;
                break;
              }
              item = _step9.value;
              _context3.next = 12;
              return Jur7MonitoringDB.getBackCapSchetSumma([data.budjet_id, data.region_id, data.from, data.to, item.schet], 'kredit_schet');
            case 12:
              item.summa = _context3.sent;
              result.kredit_sum += item.summa;
            case 14:
              _context3.next = 8;
              break;
            case 16:
              _context3.next = 21;
              break;
            case 18:
              _context3.prev = 18;
              _context3.t0 = _context3["catch"](6);
              _iterator9.e(_context3.t0);
            case 21:
              _context3.prev = 21;
              _iterator9.f();
              return _context3.finish(21);
            case 24:
              _iterator10 = _createForOfIteratorHelper(result.debet_schets);
              _context3.prev = 25;
              _iterator10.s();
            case 27:
              if ((_step10 = _iterator10.n()).done) {
                _context3.next = 35;
                break;
              }
              _item = _step10.value;
              _context3.next = 31;
              return Jur7MonitoringDB.getBackCapSchetSumma([data.budjet_id, data.region_id, data.from, data.to, _item.schet], 'debet_schet');
            case 31:
              _item.summa = _context3.sent;
              result.debet_sum += _item.summa;
            case 33:
              _context3.next = 27;
              break;
            case 35:
              _context3.next = 40;
              break;
            case 37:
              _context3.prev = 37;
              _context3.t1 = _context3["catch"](25);
              _iterator10.e(_context3.t1);
            case 40:
              _context3.prev = 40;
              _iterator10.f();
              return _context3.finish(40);
            case 43:
              return _context3.abrupt("return", result);
            case 44:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[6, 18, 21, 24], [25, 37, 40, 43]]);
      }));
      function backCap(_x3) {
        return _backCap.apply(this, arguments);
      }
      return backCap;
    }()
  }, {
    key: "backCapExcel",
    value: function () {
      var _backCapExcel = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(data) {
        var workbook, fileName, worksheet, row_number, _iterator11, _step11, item, _iterator12, _step12, _item2, filePath;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              workbook = new ExcelJS.Workbook();
              fileName = "cap_".concat(new Date().getTime(), ".xlsx");
              worksheet = workbook.addWorksheet('jur_7 cap');
              worksheet.mergeCells("A1", 'D1');
              worksheet.getCell('A1').value = 'Мемориал ордер N_7';
              worksheet.mergeCells("A2", 'D2');
              worksheet.getCell('A2').value = "".concat(HelperFunctions.returnStringDate(new Date(data.from)), " \u0434\u0430\u043D   ").concat(HelperFunctions.returnStringDate(new Date(data.to)), " \u0433\u0430\u0447\u0430");
              worksheet.mergeCells("A3", 'B3');
              worksheet.getCell('A3').value = "\u0428\u0430\u043F\u043A\u0430 \u0434\u043B\u044F \u041C\u0435\u043C\u043E\u0440\u0438\u0430\u043B \u043E\u0440\u0434\u0435\u0440 \u21167 (\u0434\u0435\u0431\u0435\u0442)";
              worksheet.mergeCells("C3", 'D3');
              worksheet.getCell('C3').value = 'Шапка для Мемориал ордер №7 (кредит)';
              worksheet.getCell("A4").value = "\u0414\u0435\u0431\u0435\u0442 \u0441\u0447\u0435\u0442";
              worksheet.getCell('B4').value = 'Сумма';
              worksheet.getCell('C4').value = "\u041A\u0440\u0435\u0434\u0438\u0442 \u0441\u0447\u0435\u0442";
              worksheet.getCell('D4').value = "\u0421\u0443\u043C\u043C\u0430";
              row_number = 5;
              _iterator11 = _createForOfIteratorHelper(data.debet_schets);
              try {
                for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
                  item = _step11.value;
                  worksheet.getCell("A".concat(row_number)).value = item.schet;
                  worksheet.getCell("B".concat(row_number)).value = item.summa;
                  row_number++;
                }
              } catch (err) {
                _iterator11.e(err);
              } finally {
                _iterator11.f();
              }
              worksheet.getCell("B".concat(row_number)).value = data.debet_sum;
              row_number = 5;
              _iterator12 = _createForOfIteratorHelper(data.kredit_schets);
              try {
                for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
                  _item2 = _step12.value;
                  worksheet.getCell("C".concat(row_number)).value = _item2.schet;
                  worksheet.getCell("D".concat(row_number)).value = _item2.summa;
                  row_number++;
                }
              } catch (err) {
                _iterator12.e(err);
              } finally {
                _iterator12.f();
              }
              worksheet.getCell("D".concat(row_number)).value = data.kredit_sum;
              worksheet.getColumn(1).width = 15;
              worksheet.getColumn(2).width = 30;
              worksheet.getColumn(3).width = 15;
              worksheet.getColumn(4).width = 30;
              worksheet.getRow(1).height = 30;
              worksheet.getRow(3).height = 60;
              worksheet.eachRow(function (row, rowNumber) {
                if (rowNumber > 3) {
                  worksheet.getRow(rowNumber).height = 18;
                }
                row.eachCell(function (cell, columnNumber) {
                  var bold = false;
                  var horizontal = "center";
                  if (rowNumber < 5) {
                    bold = true;
                  }
                  if (rowNumber > 4 && (columnNumber === 2 || columnNumber === 4)) {
                    horizontal = 'right';
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
              filePath = path.join(__dirname, '../../../../public/exports/' + fileName);
              _context4.next = 33;
              return workbook.xlsx.writeFile(filePath);
            case 33:
              return _context4.abrupt("return", {
                filePath: filePath,
                fileName: fileName
              });
            case 34:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function backCapExcel(_x4) {
        return _backCapExcel.apply(this, arguments);
      }
      return backCapExcel;
    }()
  }, {
    key: "getSaldo",
    value: function () {
      var _getSaldo = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(data) {
        var _yield$Jur7Monitoring, products, total, _iterator13, _step13, _loop;
        return _regeneratorRuntime().wrap(function _callee5$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return Jur7MonitoringDB.getProducts([data.responsible_id, data.offset, data.limit], data.product_id, data.search);
            case 2:
              _yield$Jur7Monitoring = _context6.sent;
              products = _yield$Jur7Monitoring.products;
              total = _yield$Jur7Monitoring.total;
              _iterator13 = _createForOfIteratorHelper(products);
              _context6.prev = 6;
              _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
                var product;
                return _regeneratorRuntime().wrap(function _loop$(_context5) {
                  while (1) switch (_context5.prev = _context5.next) {
                    case 0:
                      product = _step13.value;
                      _context5.next = 3;
                      return Jur7MonitoringDB.getKolSumma([product.naimenovanie_tovarov_jur7_id, data.responsible_id], data.from);
                    case 3:
                      product.from = _context5.sent;
                      _context5.next = 6;
                      return Jur7MonitoringDB.getKolSumma([product.naimenovanie_tovarov_jur7_id, data.responsible_id], null, [data.from, data.to]);
                    case 6:
                      product.internal = _context5.sent;
                      _context5.next = 9;
                      return Jur7MonitoringDB.getKolSumma([product.naimenovanie_tovarov_jur7_id, data.responsible_id], data.to);
                    case 9:
                      product.to = _context5.sent;
                      if (!(product.to.kol === 0 && product.to.summa === 0)) {
                        _context5.next = 13;
                        break;
                      }
                      products = products.filter(function (item) {
                        return item.naimenovanie_tovarov_jur7_id !== product.naimenovanie_tovarov_jur7_id;
                      });
                      return _context5.abrupt("return", 1);
                    case 13:
                      _context5.next = 15;
                      return Jur7MonitoringDB.getPrixodInfo([product.naimenovanie_tovarov_jur7_id]);
                    case 15:
                      product.prixod_data = _context5.sent;
                      product.sena = product.to.summa / product.to.kol;
                      product.senaRound = Math.round(product.sena * 100) / 100;
                    case 18:
                    case "end":
                      return _context5.stop();
                  }
                }, _loop);
              });
              _iterator13.s();
            case 9:
              if ((_step13 = _iterator13.n()).done) {
                _context6.next = 15;
                break;
              }
              return _context6.delegateYield(_loop(), "t0", 11);
            case 11:
              if (!_context6.t0) {
                _context6.next = 13;
                break;
              }
              return _context6.abrupt("continue", 13);
            case 13:
              _context6.next = 9;
              break;
            case 15:
              _context6.next = 20;
              break;
            case 17:
              _context6.prev = 17;
              _context6.t1 = _context6["catch"](6);
              _iterator13.e(_context6.t1);
            case 20:
              _context6.prev = 20;
              _iterator13.f();
              return _context6.finish(20);
            case 23:
              ;
              return _context6.abrupt("return", {
                products: products,
                total: total
              });
            case 25:
            case "end":
              return _context6.stop();
          }
        }, _callee5, null, [[6, 17, 20, 23]]);
      }));
      function getSaldo(_x5) {
        return _getSaldo.apply(this, arguments);
      }
      return getSaldo;
    }()
  }, {
    key: "getSchets",
    value: function () {
      var _getSchets = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(data) {
        var result, dates, _iterator14, _step14, schet;
        return _regeneratorRuntime().wrap(function _callee6$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return Jur7MonitoringDB.getSchets([data.year, data.month, data.main_schet_id]);
            case 2:
              result = _context7.sent;
              dates = HelperFunctions.getMonthStartEnd(data.year, data.month);
              _iterator14 = _createForOfIteratorHelper(result);
              _context7.prev = 5;
              _iterator14.s();
            case 7:
              if ((_step14 = _iterator14.n()).done) {
                _context7.next = 20;
                break;
              }
              schet = _step14.value;
              _context7.next = 11;
              return Jur7MonitoringDB.getSummaReport([data.main_schet_id, schet.schet, dates[0]], '<');
            case 11:
              schet.summa_from = _context7.sent;
              _context7.next = 14;
              return Jur7MonitoringDB.getSummaReport([data.main_schet_id, schet.schet, dates[0], dates[1]]);
            case 14:
              schet.internal = _context7.sent;
              _context7.next = 17;
              return Jur7MonitoringDB.getSummaReport([data.main_schet_id, schet.schet, dates[1]], '<=');
            case 17:
              schet.summa_to = _context7.sent;
            case 18:
              _context7.next = 7;
              break;
            case 20:
              _context7.next = 25;
              break;
            case 22:
              _context7.prev = 22;
              _context7.t0 = _context7["catch"](5);
              _iterator14.e(_context7.t0);
            case 25:
              _context7.prev = 25;
              _iterator14.f();
              return _context7.finish(25);
            case 28:
              return _context7.abrupt("return", result);
            case 29:
            case "end":
              return _context7.stop();
          }
        }, _callee6, null, [[5, 22, 25, 28]]);
      }));
      function getSchets(_x6) {
        return _getSchets.apply(this, arguments);
      }
      return getSchets;
    }()
  }, {
    key: "obrotkaExcel",
    value: function () {
      var _obrotkaExcel = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(data) {
        var Workbook, worksheet, titleCell, regionNameCell, _iterator15, _step15, schet, folderPath, fileName, filePath;
        return _regeneratorRuntime().wrap(function _callee7$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              Workbook = new ExcelJS.Workbook();
              worksheet = Workbook.addWorksheet('obrotka');
              worksheet.mergeCells('A1', 'C1');
              titleCell = worksheet.getCell('A1');
              titleCell.value = "\u0421\u0412\u041E\u0414\u041D\u0410\u042F \u041E\u0411\u041E\u0420\u041E\u0422\u042C \u0417\u0410 ".concat(HelperFunctions.returnMonth(data.month), " ").concat(data.year, " \u0433\u043E\u0434.");
              worksheet.mergeCells('D1', 'E1');
              regionNameCell = worksheet.getCell('D1');
              regionNameCell.value = data.region.name;
              worksheet.getRow(2).values = ['СЧЕТ', 'САЛЬДО', 'ПРИХОД', 'РАСХОД', 'САЛЬДО'];
              worksheet.columns = [{
                key: 'schet',
                width: 20
              }, {
                key: 'from',
                width: 20
              }, {
                key: 'prixod',
                width: 20
              }, {
                key: 'rasxod',
                width: 20
              }, {
                key: 'to',
                width: 20
              }];
              _iterator15 = _createForOfIteratorHelper(data.schets);
              try {
                for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
                  schet = _step15.value;
                  worksheet.addRow({
                    schet: schet.schet,
                    from: schet.summa_from.summa,
                    prixod: schet.internal.prixod,
                    rasxod: schet.internal.rasxod,
                    to: schet.summa_to.summa
                  });
                }
              } catch (err) {
                _iterator15.e(err);
              } finally {
                _iterator15.f();
              }
              worksheet.eachRow(function (row, rowNumber) {
                var size = 12;
                var bold = false;
                var horizontal = 'center';
                if (rowNumber === 1) {
                  size = 15;
                  bold = true;
                }
                row.eachCell(function (cell, cellNumber) {
                  if (rowNumber > 2 && cellNumber > 1) {
                    horizontal = 'right';
                  }
                  if (rowNumber === 1) {
                    Object.assign(cell, {
                      font: {
                        size: size,
                        bold: bold,
                        color: {
                          argb: 'FF000000'
                        },
                        name: 'Times New Roman'
                      },
                      alignment: {
                        vertical: 'middle',
                        horizontal: horizontal
                      }
                    });
                  } else {
                    Object.assign(cell, {
                      font: {
                        size: size,
                        bold: bold,
                        color: {
                          argb: 'FF000000'
                        },
                        name: 'Times New Roman'
                      },
                      alignment: {
                        vertical: 'middle',
                        horizontal: horizontal
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
                  }
                });
              });
              worksheet.getRow(1).height = 25;
              worksheet.getRow(2).height = 18;
              folderPath = path.join(__dirname, '../../../../public/exports');
              fileName = "obrotka_".concat(new Date().getTime(), ".xlsx");
              _context8.prev = 17;
              _context8.next = 20;
              return access(folderPath, constants.W_OK);
            case 20:
              _context8.next = 26;
              break;
            case 22:
              _context8.prev = 22;
              _context8.t0 = _context8["catch"](17);
              _context8.next = 26;
              return mkdir(folderPath);
            case 26:
              filePath = "".concat(folderPath, "/").concat(fileName);
              _context8.next = 29;
              return Workbook.xlsx.writeFile(filePath);
            case 29:
              return _context8.abrupt("return", {
                fileName: fileName,
                filePath: filePath
              });
            case 30:
            case "end":
              return _context8.stop();
          }
        }, _callee7, null, [[17, 22]]);
      }));
      function obrotkaExcel(_x7) {
        return _obrotkaExcel.apply(this, arguments);
      }
      return obrotkaExcel;
    }()
  }, {
    key: "materialReport",
    value: function () {
      var _materialReport = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(data) {
        var dates, _iterator16, _step16, responsible, _iterator17, _step17, schet, _iterator18, _step18, product;
        return _regeneratorRuntime().wrap(function _callee8$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              dates = HelperFunctions.getMonthStartEnd(data.year, data.month);
              _iterator16 = _createForOfIteratorHelper(data.responsibles);
              _context9.prev = 2;
              _iterator16.s();
            case 4:
              if ((_step16 = _iterator16.n()).done) {
                _context9.next = 67;
                break;
              }
              responsible = _step16.value;
              responsible.schets = data.schets.map(function (item) {
                return _objectSpread({}, item);
              });
              _iterator17 = _createForOfIteratorHelper(responsible.schets);
              _context9.prev = 8;
              _iterator17.s();
            case 10:
              if ((_step17 = _iterator17.n()).done) {
                _context9.next = 57;
                break;
              }
              schet = _step17.value;
              _context9.next = 14;
              return Jur7MonitoringDB.getBySchetProducts([data.region_id, data.main_schet_id, schet.schet, responsible.id]);
            case 14:
              schet.products = _context9.sent;
              schet.kol_from = 0;
              schet.summa_from = 0;
              schet.kol_prixod = 0;
              schet.prixod = 0;
              schet.kol_rasxod = 0;
              schet.rasxod = 0;
              schet.kol_to = 0;
              schet.summa_to = 0;
              _iterator18 = _createForOfIteratorHelper(schet.products);
              _context9.prev = 24;
              _iterator18.s();
            case 26:
              if ((_step18 = _iterator18.n()).done) {
                _context9.next = 47;
                break;
              }
              product = _step18.value;
              _context9.next = 30;
              return Jur7MonitoringDB.getSummaReport([data.main_schet_id, schet.schet, dates[0]], '<', responsible.id, product.id);
            case 30:
              product.summa_from = _context9.sent;
              _context9.next = 33;
              return Jur7MonitoringDB.getSummaReport([data.main_schet_id, schet.schet, dates[0], dates[1]], null, responsible.id, product.id);
            case 33:
              product.internal = _context9.sent;
              _context9.next = 36;
              return Jur7MonitoringDB.getSummaReport([data.main_schet_id, schet.schet, dates[1]], '<=', responsible.id, product.id);
            case 36:
              product.summa_to = _context9.sent;
              schet.kol_from += product.summa_from.kol;
              schet.summa_from += product.summa_from.summa;
              schet.kol_prixod += product.internal.prixod_kol;
              schet.prixod += product.internal.prixod;
              schet.kol_rasxod += product.internal.rasxod_kol;
              schet.rasxod += product.internal.rasxod;
              schet.kol_to += product.summa_to.kol;
              schet.summa_to += product.summa_to.summa;
            case 45:
              _context9.next = 26;
              break;
            case 47:
              _context9.next = 52;
              break;
            case 49:
              _context9.prev = 49;
              _context9.t0 = _context9["catch"](24);
              _iterator18.e(_context9.t0);
            case 52:
              _context9.prev = 52;
              _iterator18.f();
              return _context9.finish(52);
            case 55:
              _context9.next = 10;
              break;
            case 57:
              _context9.next = 62;
              break;
            case 59:
              _context9.prev = 59;
              _context9.t1 = _context9["catch"](8);
              _iterator17.e(_context9.t1);
            case 62:
              _context9.prev = 62;
              _iterator17.f();
              return _context9.finish(62);
            case 65:
              _context9.next = 4;
              break;
            case 67:
              _context9.next = 72;
              break;
            case 69:
              _context9.prev = 69;
              _context9.t2 = _context9["catch"](2);
              _iterator16.e(_context9.t2);
            case 72:
              _context9.prev = 72;
              _iterator16.f();
              return _context9.finish(72);
            case 75:
              return _context9.abrupt("return", data.responsibles);
            case 76:
            case "end":
              return _context9.stop();
          }
        }, _callee8, null, [[2, 69, 72, 75], [8, 59, 62, 65], [24, 49, 52, 55]]);
      }));
      function materialReport(_x8) {
        return _materialReport.apply(this, arguments);
      }
      return materialReport;
    }()
  }, {
    key: "materialExcel",
    value: function () {
      var _materialExcel = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(data) {
        var Workbook, worksheet, title1, title2, title3, title4, title5, productTitleCell, edinTitleCell, fromCell, oborotCell, toCell, date_prixod, _iterator19, _step19, responsible, _iterator20, _step20, schet, _iterator21, _step21, product, folderPath, fileName, filePath;
        return _regeneratorRuntime().wrap(function _callee9$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              Workbook = new ExcelJS.Workbook();
              worksheet = Workbook.addWorksheet('material');
              worksheet.mergeCells('G1', 'K1');
              title1 = worksheet.getCell('G1');
              title1.value = '"Тасдиқлайман"';
              worksheet.mergeCells('G2', 'K2');
              title2 = worksheet.getCell('G2');
              title2.value = data.region.name;
              worksheet.mergeCells('G3', 'K3');
              title3 = worksheet.getCell('G3');
              title3.value = 'бошлиғи';
              worksheet.mergeCells('G4', 'K4');
              title4 = worksheet.getCell('G4');
              title4.value = '';
              worksheet.mergeCells('A5', 'K5');
              title5 = worksheet.getCell('A5');
              title5.value = "\u041C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u043D\u044B\u0439 \u043E\u0442\u0447\u0451\u0442 \u0437\u0430 ".concat(HelperFunctions.returnMonth(data.month), " ").concat(data.year, " \u0433\u043E\u0434.");
              productTitleCell = worksheet.getCell('A6');
              productTitleCell.value = 'Назвал предмет';
              edinTitleCell = worksheet.getCell('B6');
              edinTitleCell.value = 'Ед.ном';
              worksheet.mergeCells('C6', 'D6');
              fromCell = worksheet.getCell('C6');
              fromCell.value = 'ОСТАТОК на нач';
              worksheet.mergeCells('E6', 'H6');
              oborotCell = worksheet.getCell('E6');
              oborotCell.value = 'ОБОРОТ';
              worksheet.mergeCells('I6', 'J6');
              toCell = worksheet.getCell('I6');
              toCell.value = 'ОСТАТОК на кон';
              date_prixod = worksheet.getCell('K6');
              date_prixod.value = 'Дата приход';
              worksheet.getRow(7).values = ['', '', 'Кол', 'Остаток', 'Кол', 'Приход', 'Кол', 'Расход', 'Кол', 'Остаток'];
              worksheet.columns = [{
                key: 'product_name',
                width: 30
              }, {
                key: 'edin',
                width: 15
              }, {
                key: 'from_kol',
                width: 15
              }, {
                key: 'from_summa',
                width: 15
              }, {
                key: 'prixod_kol',
                width: 15
              }, {
                key: 'prixod',
                width: 15
              }, {
                key: 'rasxod_kol',
                width: 15
              }, {
                key: 'rasxod',
                width: 15
              }, {
                key: 'to_kol',
                width: 15
              }, {
                key: 'to_summa',
                width: 15
              }, {
                key: 'date',
                width: 15
              }];
              _iterator19 = _createForOfIteratorHelper(data.responsibles);
              try {
                for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
                  responsible = _step19.value;
                  _iterator20 = _createForOfIteratorHelper(responsible.schets);
                  try {
                    for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
                      schet = _step20.value;
                      if (schet.products.length) {
                        worksheet.addRow({});
                        worksheet.addRow({
                          product_name: responsible.fio
                        });
                        worksheet.addRow({
                          product_name: "\u0421\u0447\u0435\u0442 ".concat(schet.schet)
                        });
                        _iterator21 = _createForOfIteratorHelper(schet.products);
                        try {
                          for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
                            product = _step21.value;
                            worksheet.addRow({
                              product_name: product.name,
                              edin: product.edin,
                              from_kol: product.summa_from.kol,
                              from_summa: product.summa_from.summa,
                              prixod_kol: product.internal.prixod_kol,
                              prixod: product.internal.prixod,
                              rasxod_kol: product.internal.rasxod_kol,
                              rasxod: product.internal.rasxod,
                              to_kol: product.summa_to.kol,
                              to_summa: product.summa_to.summa,
                              date: product.doc_date
                            });
                          }
                        } catch (err) {
                          _iterator21.e(err);
                        } finally {
                          _iterator21.f();
                        }
                        worksheet.addRow({
                          product_name: '',
                          edin: '',
                          from_kol: schet.kol_from,
                          from_summa: schet.summa_from,
                          prixod_kol: schet.kol_prixod,
                          prixod: schet.prixod,
                          rasxod_kol: schet.kol_rasxod,
                          rasxod: schet.rasxod,
                          to_kol: schet.kol_to,
                          to_summa: schet.summa_to,
                          date: undefined
                        });
                      }
                    }
                  } catch (err) {
                    _iterator20.e(err);
                  } finally {
                    _iterator20.f();
                  }
                }
              } catch (err) {
                _iterator19.e(err);
              } finally {
                _iterator19.f();
              }
              worksheet.eachRow(function (row, rowNumber) {
                var size = 12;
                var bold = false;
                var horizontal = 'center';
                var border = {
                  top: {
                    style: 'thin',
                    color: {
                      argb: 'FFD3D3D3'
                    }
                  },
                  left: {
                    style: 'thin',
                    color: {
                      argb: 'FFD3D3D3'
                    }
                  },
                  bottom: {
                    style: 'thin',
                    color: {
                      argb: 'FFD3D3D3'
                    }
                  },
                  right: {
                    style: 'thin',
                    color: {
                      argb: 'FFD3D3D3'
                    }
                  }
                };
                if (rowNumber < 6) {
                  worksheet.getRow(rowNumber).height = 25;
                  bold = true;
                }
                if (rowNumber === 3) {
                  horizontal = 'left';
                }
                if (rowNumber === 4) {
                  border = {
                    top: {
                      style: 'thin',
                      color: {
                        argb: 'FFD3D3D3'
                      }
                    },
                    left: {
                      style: 'thin',
                      color: {
                        argb: 'FFD3D3D3'
                      }
                    },
                    bottom: {
                      style: 'thin'
                    },
                    right: {
                      style: 'thin',
                      color: {
                        argb: 'FFD3D3D3'
                      }
                    }
                  };
                }
                row.eachCell(function (cell) {
                  if (rowNumber > 5 && cell.value !== '' && cell.value !== undefined) {
                    border = {
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
                  }
                  Object.assign(cell, {
                    font: {
                      size: size,
                      bold: bold,
                      color: {
                        argb: 'FF000000'
                      },
                      name: 'Times New Roman'
                    },
                    alignment: {
                      vertical: 'middle',
                      horizontal: horizontal
                    },
                    fill: {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: {
                        argb: 'FFFFFFFF'
                      }
                    },
                    border: border
                  });
                });
              });
              folderPath = path.join(__dirname, '../../../../public/exports');
              fileName = "material_".concat(new Date().getTime(), ".xlsx");
              _context10.prev = 39;
              _context10.next = 42;
              return access(folderPath, constants.W_OK);
            case 42:
              _context10.next = 48;
              break;
            case 44:
              _context10.prev = 44;
              _context10.t0 = _context10["catch"](39);
              _context10.next = 48;
              return mkdir(folderPath);
            case 48:
              filePath = "".concat(folderPath, "/").concat(fileName);
              _context10.next = 51;
              return Workbook.xlsx.writeFile(filePath);
            case 51:
              return _context10.abrupt("return", {
                fileName: fileName,
                filePath: filePath
              });
            case 52:
            case "end":
              return _context10.stop();
          }
        }, _callee9, null, [[39, 44]]);
      }));
      function materialExcel(_x9) {
        return _materialExcel.apply(this, arguments);
      }
      return materialExcel;
    }()
  }]);
}();