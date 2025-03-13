"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _require = require('../spravochnik/podotchet/db'),
  PodotchetDB = _require.PodotchetDB;
var _require2 = require('@main_schet/db'),
  MainSchetDB = _require2.MainSchetDB;
var _require3 = require('@budjet/db'),
  BudjetDB = _require3.BudjetDB;
var ExcelJS = require('exceljs');
var _require4 = require('@helper/functions'),
  returnStringDate = _require4.returnStringDate;
var path = require('path');
var _require5 = require('./db'),
  PodotchetMonitoringDB = _require5.PodotchetMonitoringDB;
var _require6 = require('@main_schet/service'),
  MainSchetService = _require6.MainSchetService;
var _require7 = require('./service'),
  PodotchetMonitoringService = _require7.PodotchetMonitoringService;
exports.Controller = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "getMonitoring",
    value: function () {
      var _getMonitoring = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
        var _req$query, limit, page, main_schet_id, from, to, operatsii, podotchet_id, search, region_id, offset, podotchet, main_schet, data, summa_from, summa_to, summa, total, page_rasxod_sum, page_prixod_sum, pageCount, meta;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _req$query = req.query, limit = _req$query.limit, page = _req$query.page, main_schet_id = _req$query.main_schet_id, from = _req$query.from, to = _req$query.to, operatsii = _req$query.operatsii, podotchet_id = _req$query.podotchet_id, search = _req$query.search;
              region_id = req.user.region_id;
              offset = (page - 1) * limit;
              if (!podotchet_id) {
                _context.next = 9;
                break;
              }
              _context.next = 6;
              return PodotchetDB.getById([region_id, podotchet_id]);
            case 6:
              podotchet = _context.sent;
              if (podotchet) {
                _context.next = 9;
                break;
              }
              return _context.abrupt("return", res.status(404).json({
                message: "podotchet not found"
              }));
            case 9:
              _context.next = 11;
              return MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
            case 11:
              main_schet = _context.sent;
              if (main_schet) {
                _context.next = 14;
                break;
              }
              return _context.abrupt("return", res.status(404).json({
                message: "main schet not found"
              }));
            case 14:
              _context.next = 16;
              return PodotchetMonitoringDB.getMonitoring([region_id, main_schet_id, from, to, operatsii, offset, limit], podotchet_id, search);
            case 16:
              data = _context.sent;
              _context.next = 19;
              return PodotchetMonitoringDB.getSummaMonitoring([region_id], {
                date: from,
                operator: '<'
              }, null, podotchet_id, main_schet_id, null, operatsii, search);
            case 19:
              summa_from = _context.sent;
              _context.next = 22;
              return PodotchetMonitoringDB.getSummaMonitoring([region_id], {
                date: to,
                operator: '<='
              }, null, podotchet_id, main_schet_id, null, operatsii, search);
            case 22:
              summa_to = _context.sent;
              _context.next = 25;
              return PodotchetMonitoringDB.getSummaMonitoring([region_id], null, [from, to], podotchet_id, main_schet_id, null, operatsii, search);
            case 25:
              summa = _context.sent;
              _context.next = 28;
              return PodotchetMonitoringDB.getTotalMonitoring([region_id, main_schet_id, from, to, operatsii], podotchet_id, search);
            case 28:
              total = _context.sent;
              page_rasxod_sum = 0;
              page_prixod_sum = 0;
              data.forEach(function (item) {
                page_rasxod_sum += item.rasxod_sum;
                page_prixod_sum += item.prixod_sum;
              });
              pageCount = Math.ceil(total / limit);
              meta = {
                pageCount: pageCount,
                count: total,
                currentPage: page,
                nextPage: page >= pageCount ? null : page + 1,
                backPage: page === 1 ? null : page - 1,
                summa_from: summa_from.summa,
                summa_to: summa_to.summa,
                page_prixod_sum: page_prixod_sum,
                page_rasxod_sum: page_rasxod_sum,
                page_total_sum: page_prixod_sum - page_rasxod_sum,
                prixod_sum: summa.prixod_sum,
                rasxod_sum: summa.rasxod_sum,
                summa: summa.summa,
                summa_object: summa,
                summa_from_object: summa_from,
                summa_to_object: summa_to
              };
              return _context.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, meta, data));
            case 35:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function getMonitoring(_x, _x2) {
        return _getMonitoring.apply(this, arguments);
      }
      return getMonitoring;
    }()
  }, {
    key: "prixodRasxodPodotchet",
    value: function () {
      var _prixodRasxodPodotchet = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
        var region_id, _req$query2, to, budjet_id, excel, bujet, data, _iterator, _step, podotchet, summa, workbook, fileName, worksheet, row_number, itogo_prixod, itogo_rasxod, _iterator2, _step2, column, _css_array, css_array, filePath;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              region_id = req.user.region_id;
              _req$query2 = req.query, to = _req$query2.to, budjet_id = _req$query2.budjet_id, excel = _req$query2.excel;
              _context2.next = 4;
              return BudjetDB.getById([budjet_id]);
            case 4:
              bujet = _context2.sent;
              if (bujet) {
                _context2.next = 7;
                break;
              }
              return _context2.abrupt("return", res.error(req.i18n.t('budjetNotFound'), 404));
            case 7:
              _context2.next = 9;
              return PodotchetDB.get([region_id, 0, 99999]);
            case 9:
              data = _context2.sent.data;
              _iterator = _createForOfIteratorHelper(data);
              _context2.prev = 11;
              _iterator.s();
            case 13:
              if ((_step = _iterator.n()).done) {
                _context2.next = 21;
                break;
              }
              podotchet = _step.value;
              _context2.next = 17;
              return PodotchetMonitoringDB.getSummaMonitoring([region_id], {
                operator: '<=',
                date: to
              }, null, podotchet.id, null, budjet_id);
            case 17:
              summa = _context2.sent;
              podotchet.summa = summa.summa;
            case 19:
              _context2.next = 13;
              break;
            case 21:
              _context2.next = 26;
              break;
            case 23:
              _context2.prev = 23;
              _context2.t0 = _context2["catch"](11);
              _iterator.e(_context2.t0);
            case 26:
              _context2.prev = 26;
              _iterator.f();
              return _context2.finish(26);
            case 29:
              if (!(excel === 'true')) {
                _context2.next = 93;
                break;
              }
              workbook = new ExcelJS.Workbook();
              fileName = "prixod_rasxod_".concat(new Date().getTime(), ".xlsx");
              worksheet = workbook.addWorksheet('prixod rasxod');
              worksheet.pageSetup.margins.left = 0;
              worksheet.pageSetup.margins.header = 0;
              worksheet.pageSetup.margins.footer = 0;
              worksheet.pageSetup.margins.right = 0;
              worksheet.mergeCells('A1:E1');
              worksheet.getCell('A1').value = "\u0421\u043F\u0438\u0441\u043E\u043A \u0414\u0435\u0431\u0435\u0442\u043E\u0440\u043E\u0432 / \u041A\u0440\u0435\u0434\u0438\u0442\u043E\u0440\u043E\u0432 \u043D\u0430 ".concat(returnStringDate(new Date(to)));
              worksheet.getCell('A2').value = 'Подотчетное лицо';
              worksheet.getCell('B2').value = 'Управление';
              worksheet.getCell('C2').value = 'Дата';
              worksheet.getCell('D2').value = 'Дебет';
              worksheet.getCell('E2').value = 'Кредит';
              row_number = 3;
              itogo_prixod = 0;
              itogo_rasxod = 0;
              _iterator2 = _createForOfIteratorHelper(data);
              _context2.prev = 48;
              _iterator2.s();
            case 50:
              if ((_step2 = _iterator2.n()).done) {
                _context2.next = 66;
                break;
              }
              column = _step2.value;
              if (!(column.summa === 0)) {
                _context2.next = 54;
                break;
              }
              return _context2.abrupt("continue", 64);
            case 54:
              worksheet.getCell("A".concat(row_number)).value = column.name;
              worksheet.getCell("B".concat(row_number)).value = column.rayon;
              worksheet.getCell("C".concat(row_number)).value = returnStringDate(new Date(to));
              worksheet.getCell("D".concat(row_number)).value = column.summa > 0 ? column.summa : 0;
              worksheet.getCell("E".concat(row_number)).value = column.summa < 0 ? Math.abs(column.summa) : 0;
              itogo_prixod += column.summa > 0 ? column.summa : 0;
              itogo_rasxod += column.summa < 0 ? Math.abs(column.summa) : 0;
              _css_array = ["A".concat(row_number), "B".concat(row_number), "C".concat(row_number), "D".concat(row_number), "E".concat(row_number)];
              _css_array.forEach(function (cell, index) {
                var horizontal = 'center';
                if (index === 0) horizontal = 'left';
                if (index > 2) horizontal = 'right';
                var column = worksheet.getCell(cell);
                column.numFmt = '#,##0.00';
                column.font = {
                  size: 10,
                  color: {
                    argb: 'FF000000'
                  },
                  name: 'Times New Roman'
                };
                column.alignment = {
                  vertical: 'middle',
                  horizontal: horizontal
                };
                column.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: {
                    argb: 'FFFFFFFF'
                  }
                };
                column.border = {
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
              });
              row_number++;
            case 64:
              _context2.next = 50;
              break;
            case 66:
              _context2.next = 71;
              break;
            case 68:
              _context2.prev = 68;
              _context2.t1 = _context2["catch"](48);
              _iterator2.e(_context2.t1);
            case 71:
              _context2.prev = 71;
              _iterator2.f();
              return _context2.finish(71);
            case 74:
              worksheet.mergeCells("A".concat(row_number), "C".concat(row_number));
              worksheet.getCell("A".concat(row_number)).value = 'Итого';
              worksheet.getCell("D".concat(row_number)).value = itogo_prixod;
              worksheet.getCell("E".concat(row_number)).value = itogo_rasxod;
              css_array = ['A1', 'A2', 'B2', 'C2', 'D2', 'E2', "A".concat(row_number), "D".concat(row_number), "E".concat(row_number)];
              css_array.forEach(function (cell, index) {
                var column = worksheet.getCell(cell);
                var size = 10;
                var horizontal = 'center';
                if (index === 0) size = 13;
                if (index > 5) column.numFmt = '#,##0.00', horizontal = 'right';
                Object.assign(column, {
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
              });
              worksheet.getColumn(1).width = 30;
              worksheet.getColumn(2).width = 20;
              worksheet.getColumn(3).width = 15;
              worksheet.getColumn(4).width = 18;
              worksheet.getColumn(5).width = 18;
              worksheet.getRow(1).height = 35;
              worksheet.getRow(2).height = 20;
              filePath = path.join(__dirname, '../../../public/exports/' + fileName);
              _context2.next = 90;
              return workbook.xlsx.writeFile(filePath);
            case 90:
              res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
              res.setHeader('Content-Disposition', "attachment; filename=\"".concat(fileName, "\""));
              return _context2.abrupt("return", res.download(filePath));
            case 93:
              return _context2.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, null, data));
            case 94:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[11, 23, 26, 29], [48, 68, 71, 74]]);
      }));
      function prixodRasxodPodotchet(_x3, _x4) {
        return _prixodRasxodPodotchet.apply(this, arguments);
      }
      return prixodRasxodPodotchet;
    }()
  }, {
    key: "getByIdPodotchetToExcel",
    value: function () {
      var _getByIdPodotchetToExcel = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
        var podotchet_id, _req$query3, main_schet_id, from, to, operatsii, region_id, podotchet, main_schet, data, summa_from_object, summa_to_object, summa_from, summa_to, summa_prixod, summa_rasxod, _iterator3, _step3, item, workbook, fileName, worksheet, titleCell, doc_numCell, doc_dateCell, opisanieCell, schetDebitCell, schetKriditCell, schetCell, subSchetCell, summaCell, schetCell2, subSchetCell2, summaCell2, summaFromCell, summa_from_debit, summa_from_kridit, row_number, _iterator4, _step4, column, _doc_numCell, _doc_dateCell, _opisanieCell, _schetCell, _subSchetCell, _summaCell, _schetCell2, _subSchetCell2, _summaCell2, _css_array2, itogoCell, schetCell3, subSchetCell3, summaCell3, schetCell4, subSchetCell4, summaCell4, summaToCell, summa_to_debit, summa_to_kridit, css_array, filePath;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              podotchet_id = req.params.id;
              _req$query3 = req.query, main_schet_id = _req$query3.main_schet_id, from = _req$query3.from, to = _req$query3.to, operatsii = _req$query3.operatsii;
              region_id = req.user.region_id;
              _context3.next = 5;
              return PodotchetDB.getById([region_id, podotchet_id]);
            case 5:
              podotchet = _context3.sent;
              if (podotchet) {
                _context3.next = 8;
                break;
              }
              return _context3.abrupt("return", res.status(404).json({
                message: "podotchet not found"
              }));
            case 8:
              _context3.next = 10;
              return MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
            case 10:
              main_schet = _context3.sent;
              if (main_schet) {
                _context3.next = 13;
                break;
              }
              return _context3.abrupt("return", res.status(404).json({
                message: "main schet not found"
              }));
            case 13:
              _context3.next = 15;
              return PodotchetMonitoringDB.getMonitoring([region_id, main_schet_id, from, to, operatsii, 0, 99999], podotchet_id);
            case 15:
              data = _context3.sent;
              _context3.next = 18;
              return PodotchetMonitoringDB.getSummaMonitoring([region_id], {
                operator: '<=',
                date: from
              }, null, podotchet_id, main_schet_id, null, operatsii);
            case 18:
              summa_from_object = _context3.sent;
              _context3.next = 21;
              return PodotchetMonitoringDB.getSummaMonitoring([region_id], {
                operator: '<=',
                date: to
              }, null, podotchet_id, main_schet_id, null, operatsii);
            case 21:
              summa_to_object = _context3.sent;
              summa_from = summa_from_object.summa;
              summa_to = summa_to_object.summa;
              summa_prixod = 0;
              summa_rasxod = 0;
              _iterator3 = _createForOfIteratorHelper(data);
              try {
                for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                  item = _step3.value;
                  summa_prixod += item.prixod_sum;
                  summa_rasxod += item.rasxod_sum;
                }
              } catch (err) {
                _iterator3.e(err);
              } finally {
                _iterator3.f();
              }
              workbook = new ExcelJS.Workbook();
              fileName = "kratochka_".concat(new Date().getTime(), ".xlsx");
              worksheet = workbook.addWorksheet('лицевой карточка');
              worksheet.mergeCells('A1', 'I');
              titleCell = worksheet.getCell("A1");
              titleCell.value = " \u041F\u043E\u0434\u043E\u0442\u0447\u0435\u0442\u043D\u043E\u0435 \u043B\u0438\u0446\u043E :  ".concat(podotchet.name);
              worksheet.mergeCells('A2', 'A3');
              doc_numCell = worksheet.getCell("A2");
              doc_numCell.value = "\u041D\u043E\u043C\u0435\u0440   \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442";
              worksheet.mergeCells('B2', 'B3');
              doc_dateCell = worksheet.getCell("B2");
              doc_dateCell.value = "\u0414\u0430\u0442\u0430";
              worksheet.mergeCells('C2', 'C3');
              opisanieCell = worksheet.getCell("C2");
              opisanieCell.value = 'Разъяснительный текст';
              worksheet.mergeCells("D2", 'F2');
              schetDebitCell = worksheet.getCell("D2");
              schetDebitCell.value = "\u0414\u0435\u0431\u0435\u0442 ".concat(operatsii, " / \u041A\u0440\u0435\u0434\u0438\u0442  \u0440\u0430\u0437\u043D\u044B\u0445   \u0441\u0447\u0435\u0442\u043E\u0432");
              worksheet.mergeCells("G2", 'I2');
              schetKriditCell = worksheet.getCell("G2");
              schetKriditCell.value = "\u041A\u0440\u0435\u0434\u0438\u0442 ".concat(operatsii, "  /  \u0414\u0435\u0431\u0435\u0442 \u0440\u0430\u0437\u043D\u044B\u0445 \u0441\u0447\u0435\u0442\u043E\u0432");
              schetCell = worksheet.getCell("D3");
              schetCell.value = "\u0441\u0447\u0435\u0442";
              subSchetCell = worksheet.getCell("E3");
              subSchetCell.value = "\u0441\u0443\u0431 \u0441\u0447\u0435\u0442";
              summaCell = worksheet.getCell("F3");
              summaCell.value = "\u0441\u0443\u043C\u043C\u0430";
              schetCell2 = worksheet.getCell("G3");
              schetCell2.value = "\u0441\u0447\u0435\u0442";
              subSchetCell2 = worksheet.getCell("H3");
              subSchetCell2.value = "\u0441\u0443\u0431 \u0441\u0447\u0435\u0442";
              summaCell2 = worksheet.getCell("I3");
              summaCell2.value = "\u0441\u0443\u043C\u043C\u0430";
              worksheet.mergeCells("A4", 'C4');
              summaFromCell = worksheet.getCell("A4");
              summaFromCell.value = "\u0421\u0430\u043B\u044C\u0434\u043E \u043D\u0430 \u043D\u0430\u0447\u0430\u043B\u043E :  ".concat(returnStringDate(new Date(from)));
              worksheet.mergeCells("D4", 'F4');
              summa_from_debit = worksheet.getCell("D4");
              summa_from_debit.value = summa_from > 0 ? summa_from : 0;
              worksheet.mergeCells("G4", 'I4');
              summa_from_kridit = worksheet.getCell("G4");
              summa_from_kridit.value = summa_from < 0 ? Math.abs(summa_from) : 0;
              row_number = 5;
              _iterator4 = _createForOfIteratorHelper(data);
              try {
                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                  column = _step4.value;
                  _doc_numCell = worksheet.getCell("A".concat(row_number));
                  _doc_numCell.value = column.doc_num;
                  _doc_dateCell = worksheet.getCell("B".concat(row_number));
                  _doc_dateCell.value = returnStringDate(new Date(column.doc_date));
                  _opisanieCell = worksheet.getCell("C".concat(row_number));
                  _opisanieCell.value = column.opisanie;
                  _schetCell = worksheet.getCell("D".concat(row_number));
                  _subSchetCell = worksheet.getCell("E".concat(row_number));
                  _summaCell = worksheet.getCell("F".concat(row_number));
                  _schetCell2 = worksheet.getCell("G".concat(row_number));
                  _subSchetCell2 = worksheet.getCell("H".concat(row_number));
                  _summaCell2 = worksheet.getCell("I".concat(row_number));
                  if (column.rasxod_sum) {
                    _schetCell.value = '';
                    _subSchetCell.value = '';
                    _summaCell.value = column.prixod_sum;
                    _schetCell2.value = column.provodki_schet;
                    _subSchetCell2.value = column.provodki_sub_schet;
                    _summaCell2.value = column.rasxod_sum;
                  } else {
                    _schetCell.value = column.provodki_schet;
                    _subSchetCell.value = column.provodki_sub_schet;
                    _summaCell.value = column.prixod_sum;
                    _schetCell2.value = '';
                    _subSchetCell2.value = '';
                    _summaCell2.value = column.rasxod_sum;
                  }
                  _css_array2 = [_doc_numCell, _doc_dateCell, _opisanieCell, _schetCell, _subSchetCell, _summaCell, _schetCell2, _subSchetCell2, _summaCell2];
                  _css_array2.forEach(function (cell, index) {
                    var horizontal = 'center';
                    if (index === 2) horizontal = 'left';
                    if (index === 5 || index === 8) horizontal = 'right';
                    Object.assign(cell, {
                      numFmt: "#,##0.00",
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
                      },
                      font: {
                        size: 10,
                        color: {
                          argb: 'FF000000'
                        },
                        name: 'Times New Roman',
                        wrappper: true
                      },
                      alignment: {
                        vertical: 'middle',
                        horizontal: horizontal,
                        wrapText: true
                      }
                    });
                  });
                  row_number++;
                }
              } catch (err) {
                _iterator4.e(err);
              } finally {
                _iterator4.f();
              }
              worksheet.mergeCells("A".concat(row_number), "C".concat(row_number));
              itogoCell = worksheet.getCell("A".concat(row_number));
              itogoCell.value = 'итого';
              schetCell3 = worksheet.getCell("D".concat(row_number));
              schetCell3.value = '';
              subSchetCell3 = worksheet.getCell("E".concat(row_number));
              subSchetCell3.value = '';
              summaCell3 = worksheet.getCell("F".concat(row_number));
              summaCell3.value = summa_prixod;
              schetCell4 = worksheet.getCell("G".concat(row_number));
              schetCell4.value = "";
              subSchetCell4 = worksheet.getCell("H".concat(row_number));
              subSchetCell4.value = "";
              summaCell4 = worksheet.getCell("I".concat(row_number));
              summaCell4.value = summa_rasxod;
              row_number++;
              worksheet.mergeCells("A".concat(row_number), "C".concat(row_number));
              summaToCell = worksheet.getCell("A".concat(row_number));
              summaToCell.value = "\u0421\u0430\u043B\u044C\u0434\u043E \u043D\u0430 \u043D\u0430\u0447\u0430\u043B\u043E :  ".concat(returnStringDate(new Date(to)));
              worksheet.mergeCells("D".concat(row_number), "F".concat(row_number));
              summa_to_debit = worksheet.getCell("D".concat(row_number));
              summa_to_debit.value = summa_to > 0 ? summa_to : 0;
              worksheet.mergeCells("G".concat(row_number), "I".concat(row_number));
              summa_to_kridit = worksheet.getCell("G".concat(row_number));
              summa_to_kridit.value = summa_to < 0 ? Math.abs(summa_to) : 0;
              css_array = [titleCell, doc_numCell, doc_dateCell, opisanieCell, schetDebitCell, schetKriditCell, summaFromCell, schetCell, subSchetCell, summaCell, schetCell2, subSchetCell2, summaCell2, summa_from_debit, summa_from_kridit, itogoCell, schetCell3, subSchetCell3, summaCell3, schetCell4, subSchetCell4, summaCell4, summaToCell, summa_to_debit, summa_to_kridit];
              css_array.forEach(function (cell, index) {
                var horizontal = 'center';
                var styles = {};
                if (index === 0) {
                  horizontal = 'left';
                }
                if (index === 6 || index === 15 || index === 22) {
                  horizontal = 'left';
                }
                if (index === 13 || index === 14 || index === 18 || index === 21 || index > 22) {
                  horizontal = 'right';
                }
                Object.assign(styles, {
                  numFmt: "#,##0.00",
                  font: {
                    size: 10,
                    color: {
                      argb: 'FF000000'
                    },
                    name: 'Times New Roman',
                    wrappper: true
                  },
                  alignment: {
                    vertical: 'middle',
                    horizontal: horizontal,
                    wrapText: true
                  }
                });
                if (index !== 0) {
                  styles.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {
                      argb: 'FFFFFFFF'
                    }
                  };
                  styles.border = {
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
                Object.assign(cell, styles);
              });
              worksheet.getColumn(1).width = 15;
              worksheet.getColumn(2).width = 15;
              worksheet.getColumn(3).width = 35;
              worksheet.getColumn(4).width = 15;
              worksheet.getColumn(5).width = 15;
              worksheet.getColumn(6).width = 15;
              worksheet.getColumn(7).width = 15;
              worksheet.getColumn(8).width = 15;
              worksheet.getColumn(9).width = 15;
              worksheet.getRow(1).height = 30;
              worksheet.getRow(2).height = 40;
              worksheet.getRow(4).height = 40;
              worksheet.getRow(itogoCell.row).height = 40;
              worksheet.getRow(summaToCell.row).height = 40;
              filePath = path.join(__dirname, '../../../public/exports/' + fileName);
              _context3.next = 117;
              return workbook.xlsx.writeFile(filePath);
            case 117:
              return _context3.abrupt("return", res.download(filePath, function (err) {
                if (err) throw new ErrorResponse(err, err.statusCode);
              }));
            case 118:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function getByIdPodotchetToExcel(_x5, _x6) {
        return _getByIdPodotchetToExcel.apply(this, arguments);
      }
      return getByIdPodotchetToExcel;
    }()
  }, {
    key: "cap",
    value: function () {
      var _cap = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
        var region_id, query, main_schet, _yield$PodotchetMonit, data, itogo_rasxod, _yield$PodotchetMonit2, filePath, fileName;
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
              return _context4.abrupt("return", res.error('Main shcet not found', 404));
            case 7:
              _context4.next = 9;
              return PodotchetMonitoringService.cap(_objectSpread(_objectSpread({}, query), {}, {
                region_id: region_id
              }));
            case 9:
              _yield$PodotchetMonit = _context4.sent;
              data = _yield$PodotchetMonit.data;
              itogo_rasxod = _yield$PodotchetMonit.itogo_rasxod;
              if (!(query.excel === 'true')) {
                _context4.next = 21;
                break;
              }
              _context4.next = 15;
              return PodotchetMonitoringService.capExcel({
                organ_name: main_schet.tashkilot_nomi,
                operatsii: query.operatsii,
                organizations: data,
                to: query.to,
                from: query.from,
                budjet_name: main_schet.budjet_name,
                itogo_rasxod: itogo_rasxod
              });
            case 15:
              _yield$PodotchetMonit2 = _context4.sent;
              filePath = _yield$PodotchetMonit2.filePath;
              fileName = _yield$PodotchetMonit2.fileName;
              res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
              res.setHeader('Content-Disposition', "attachment; filename=\"".concat(fileName, "\""));
              return _context4.abrupt("return", res.download(filePath, function (err) {
                if (err) {
                  res.error(err.message, err.statusCode);
                }
              }));
            case 21:
              ;
              return _context4.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, {
                itogo_rasxod: itogo_rasxod
              }, data));
            case 23:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function cap(_x7, _x8) {
        return _cap.apply(this, arguments);
      }
      return cap;
    }()
  }]);
}();