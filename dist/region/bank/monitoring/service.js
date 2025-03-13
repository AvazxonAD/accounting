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
var _require = require('./db'),
  BankMonitoringDB = _require.BankMonitoringDB;
var _require2 = require('@helper/functions'),
  returnStringSumma = _require2.returnStringSumma,
  returnStringDate = _require2.returnStringDate,
  HelperFunctions = _require2.HelperFunctions,
  returnSleshDate = _require2.returnSleshDate;
var ExcelJS = require('exceljs');
var path = require('path');
var _require$promises = require('fs').promises,
  mkdir = _require$promises.mkdir,
  constants = _require$promises.constants,
  access = _require$promises.access;
exports.BankMonitoringService = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(data) {
        var result, page_prixod_sum, page_rasxod_sum, _iterator, _step, item, summa_from, summa_to;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return BankMonitoringDB.get([data.region_id, data.main_schet_id, data.from, data.to, data.offset, data.limit], data.search);
            case 2:
              result = _context.sent;
              page_prixod_sum = 0;
              page_rasxod_sum = 0;
              _iterator = _createForOfIteratorHelper(result.data);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  item = _step.value;
                  page_prixod_sum += item.prixod_sum;
                  page_rasxod_sum += item.rasxod_sum;
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              _context.next = 9;
              return BankMonitoringDB.getSumma([data.region_id, data.main_schet_id, data.from], '<', data.search);
            case 9:
              summa_from = _context.sent;
              _context.next = 12;
              return BankMonitoringDB.getSumma([data.region_id, data.main_schet_id, data.to], '<=', data.search);
            case 12:
              summa_to = _context.sent;
              return _context.abrupt("return", {
                summa_from: summa_from,
                summa_to: summa_to,
                data: result.data || [],
                total_count: result.total_count,
                page_prixod_sum: page_prixod_sum,
                page_rasxod_sum: page_rasxod_sum,
                prixod_sum: result.prixod_sum,
                rasxod_sum: result.rasxod_sum,
                total_sum: result.prixod_sum - result.rasxod_sum,
                page_total_sum: page_prixod_sum - page_rasxod_sum
              });
            case 14:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function get(_x) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
  }, {
    key: "cap",
    value: function () {
      var _cap = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(data) {
        var schets, _iterator2, _step2, schet, prixod_sum, rasxod_sum, balance_from, balance_to;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return BankMonitoringDB.getSchets([data.region_id, data.main_schet_id, data.from, data.to]);
            case 2:
              schets = _context2.sent;
              _iterator2 = _createForOfIteratorHelper(schets);
              _context2.prev = 4;
              _iterator2.s();
            case 6:
              if ((_step2 = _iterator2.n()).done) {
                _context2.next = 13;
                break;
              }
              schet = _step2.value;
              _context2.next = 10;
              return BankMonitoringDB.getSummaSchet([data.region_id, data.main_schet_id, data.from, data.to, schet.schet]);
            case 10:
              schet.summa = _context2.sent;
            case 11:
              _context2.next = 6;
              break;
            case 13:
              _context2.next = 18;
              break;
            case 15:
              _context2.prev = 15;
              _context2.t0 = _context2["catch"](4);
              _iterator2.e(_context2.t0);
            case 18:
              _context2.prev = 18;
              _iterator2.f();
              return _context2.finish(18);
            case 21:
              prixod_sum = 0;
              rasxod_sum = 0;
              schets.forEach(function (item) {
                prixod_sum += item.summa.prixod_sum;
                rasxod_sum += item.summa.rasxod_sum;
              });
              _context2.next = 26;
              return BankMonitoringDB.getSumma([data.region_id, data.main_schet_id, data.from], '<');
            case 26:
              balance_from = _context2.sent;
              _context2.next = 29;
              return BankMonitoringDB.getSumma([data.region_id, data.main_schet_id, data.to], '<=');
            case 29:
              balance_to = _context2.sent;
              return _context2.abrupt("return", {
                balance_from: balance_from,
                balance_to: balance_to,
                prixod_sum: prixod_sum,
                rasxod_sum: rasxod_sum,
                data: schets
              });
            case 31:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[4, 15, 18, 21]]);
      }));
      function cap(_x2) {
        return _cap.apply(this, arguments);
      }
      return cap;
    }()
  }, {
    key: "capExcel",
    value: function () {
      var _capExcel = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(data) {
        var title, dateBetween, workbook, fileName, worksheet, titleCell, region, dateCell, balanceFromCell, balance_from, headerCell, row_number, _iterator3, _step3, item, schet, prixod_sum, rasxod_sum, array, summa, all_prixod_summa, all_rasxod_summa, summa_array, balanceToCell, signature, signature2, signature3, signature_array, folderPath, filePath;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              title = "\u0414\u043D\u0435\u0432\u043D\u043E\u0439 \u043E\u0442\u0447\u0435\u0442 \u043F\u043E ".concat(data.report_title.name, " \u21162. \u0421\u0447\u0435\u0442: ").concat(data.main_schet.jur2_schet, ". \u04B2\u0438\u0441\u043E\u0431 \u0440\u0430\u049B\u0430\u043C\u0438: ").concat(data.main_schet.account_number);
              dateBetween = "\u0417\u0430 \u043F\u0435\u0440\u0438\u043E\u0434 \u0441 ".concat(returnStringDate(new Date(data.from)), " \u043F\u043E ").concat(returnStringDate(new Date(data.to)));
              workbook = new ExcelJS.Workbook();
              fileName = "bank_shapka_".concat(new Date().getTime(), ".xlsx");
              worksheet = workbook.addWorksheet('Hisobot');
              worksheet.mergeCells('A1', 'G1');
              titleCell = worksheet.getCell('A1');
              Object.assign(titleCell, {
                value: title,
                font: {
                  size: 10,
                  bold: true,
                  color: {
                    argb: 'FF000000'
                  },
                  name: 'Times New Roman'
                },
                alignment: {
                  vertical: 'middle',
                  horizontal: 'center'
                }
              });
              worksheet.mergeCells('H1', 'J1');
              region = worksheet.getCell("H1");
              Object.assign(region, {
                value: data.region.name,
                font: {
                  size: 10,
                  color: {
                    argb: 'FF000000'
                  },
                  name: 'Times New Roman'
                },
                alignment: {
                  vertical: 'middle',
                  horizontal: "center"
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
              worksheet.getRow(1).height = 30;
              worksheet.getColumn(1).width = 5;
              worksheet.getColumn(2).width = 7;
              worksheet.getColumn(3).width = 27;
              worksheet.getColumn(4).width = 27;
              worksheet.mergeCells('A2', 'D2');
              dateCell = worksheet.getCell('A2');
              Object.assign(dateCell, {
                value: dateBetween,
                font: {
                  size: 12,
                  bold: true,
                  color: {
                    argb: 'FF000000'
                  },
                  name: 'Times New Roman'
                },
                alignment: {
                  vertical: 'middle',
                  horizontal: 'center'
                }
              });
              worksheet.getRow(2).height = 25;
              worksheet.mergeCells('A4', 'D4');
              balanceFromCell = worksheet.getCell('A4');
              balance_from = "\u041E\u0441\u0442\u0430\u0442\u043E\u043A \u043A \u043D\u0430\u0447\u0430\u043B\u0443 \u0434\u043D\u044F: ".concat(returnStringSumma(data.balance_from.summa));
              Object.assign(balanceFromCell, {
                value: balance_from,
                font: {
                  size: 12,
                  bold: true,
                  color: {
                    argb: 'FF000000'
                  },
                  name: 'Times New Roman'
                },
                alignment: {
                  vertical: 'middle',
                  horizontal: 'left'
                }
              });
              worksheet.mergeCells('A5:B5');
              headerCell = worksheet.getCell('A5');
              Object.assign(headerCell, {
                value: 'Счет',
                font: {
                  bold: true,
                  size: 12,
                  name: 'Times New Roman'
                },
                alignment: {
                  vertical: 'middle',
                  horizontal: 'center'
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
              worksheet.getCell('C5').value = 'Приход';
              worksheet.getCell('D5').value = 'Расход';
              [worksheet.getCell('C5'), worksheet.getCell('D5')].forEach(function (cell) {
                Object.assign(cell, {
                  font: {
                    bold: true,
                    size: 12,
                    name: 'Times New Roman'
                  },
                  alignment: {
                    vertical: 'middle',
                    horizontal: 'center'
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
              worksheet.getRow(5).height = 30;
              row_number = 5;
              _iterator3 = _createForOfIteratorHelper(data.data);
              try {
                for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                  item = _step3.value;
                  worksheet.mergeCells("A".concat(row_number + 1, ":B").concat(row_number + 1));
                  schet = worksheet.getCell("A".concat(row_number + 1));
                  Object.assign(schet, {
                    value: item.schet,
                    font: {
                      name: 'Times New Roman'
                    },
                    alignment: {
                      vertical: 'middle',
                      horizontal: 'center'
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
                  prixod_sum = worksheet.getCell("C".concat(row_number + 1));
                  prixod_sum.value = item.summa.prixod_sum;
                  prixod_sum.numFmt = '#,##0.00';
                  rasxod_sum = worksheet.getCell("D".concat(row_number + 1));
                  rasxod_sum.value = item.summa.rasxod_sum;
                  rasxod_sum.numFmt = '#,##0.00';
                  array = [prixod_sum, rasxod_sum];
                  array.forEach(function (cell) {
                    Object.assign(cell, {
                      font: {
                        name: 'Times New Roman',
                        size: 12
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
                  row_number++;
                }
              } catch (err) {
                _iterator3.e(err);
              } finally {
                _iterator3.f();
              }
              worksheet.mergeCells("A".concat(row_number + 1, ":B").concat(row_number + 1));
              summa = worksheet.getCell("A".concat(row_number + 1));
              summa.value = 'Всего';
              Object.assign(summa, {
                font: {
                  bold: true,
                  size: 12,
                  name: 'Times New Roman'
                },
                alignment: {
                  vertical: 'middle',
                  horizontal: 'center'
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
              all_prixod_summa = worksheet.getCell("C".concat(row_number + 1));
              all_prixod_summa.value = data.prixod_sum;
              all_prixod_summa.numFmt = '#,##0.00';
              all_rasxod_summa = worksheet.getCell("D".concat(row_number + 1));
              all_rasxod_summa.value = data.rasxod_sum;
              all_rasxod_summa.numFmt = '#,##0.00';
              summa_array = [all_prixod_summa, all_rasxod_summa];
              summa_array.forEach(function (cell) {
                Object.assign(cell, {
                  font: {
                    bold: true,
                    size: 12,
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
              row_number++;
              worksheet.mergeCells("A".concat(row_number + 1), "D".concat(row_number + 1));
              balanceToCell = worksheet.getCell('A' + (row_number + 1));
              balanceToCell.value = "\u041E\u0441\u0442\u0430\u0442\u043E\u043A \u043A\u043E\u043D\u0446\u0443 \u0434\u043D\u044F: ".concat(returnStringSumma(data.balance_to.summa));
              Object.assign(balanceToCell, {
                font: {
                  size: 12,
                  bold: true,
                  color: {
                    argb: 'FF000000'
                  },
                  name: 'Times New Roman'
                },
                alignment: {
                  vertical: 'middle',
                  horizontal: 'left'
                }
              });
              row_number++;
              worksheet.mergeCells("A".concat(row_number + 2), "C".concat(row_number + 2));
              signature = worksheet.getCell("A".concat(row_number + 2));
              signature.value = 'Главный бухгалтер ___________________________';
              worksheet.mergeCells("A".concat(row_number + 3), "C".concat(row_number + 3));
              signature2 = worksheet.getCell("A".concat(row_number + 3));
              signature2.value = 'Бухгалтер    __________________________________';
              worksheet.mergeCells("A".concat(row_number + 4), "C".concat(row_number + 4));
              signature3 = worksheet.getCell("A".concat(row_number + 4));
              signature3.value = "\u041F\u043E\u043B\u0443\u0447\u0438\u043B \u043A\u0430\u0441\u0441\u0438\u0440  ______________________________";
              signature_array = [signature, signature2, signature3];
              signature_array.forEach(function (row) {
                Object.assign(row, {
                  font: {
                    bold: true,
                    size: 12,
                    name: 'Times New Roman'
                  },
                  alignment: {
                    vertical: 'bottom',
                    horizontal: 'left'
                  }
                });
              });
              worksheet.getRow(row_number + 2).height = 30;
              worksheet.getRow(row_number + 3).height = 30;
              worksheet.getRow(row_number + 4).height = 30;
              folderPath = path.join(__dirname, '../../../../public/exports');
              _context3.prev = 67;
              _context3.next = 70;
              return access(folderPath, constants.W_OK);
            case 70:
              _context3.next = 76;
              break;
            case 72:
              _context3.prev = 72;
              _context3.t0 = _context3["catch"](67);
              _context3.next = 76;
              return mkdir(folderPath);
            case 76:
              filePath = "".concat(folderPath, "/").concat(fileName);
              _context3.next = 79;
              return workbook.xlsx.writeFile(filePath);
            case 79:
              return _context3.abrupt("return", {
                fileName: fileName,
                filePath: filePath
              });
            case 80:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[67, 72]]);
      }));
      function capExcel(_x3) {
        return _capExcel.apply(this, arguments);
      }
      return capExcel;
    }()
  }, {
    key: "daily",
    value: function () {
      var _daily = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(data) {
        var result, balance_from, balance_to, prixod_summa, rasxod_summa, _iterator4, _step4, item;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return BankMonitoringDB.daily([data.main_schet_id, data.from, data.to, data.region_id]);
            case 2:
              result = _context4.sent;
              _context4.next = 5;
              return BankMonitoringDB.dailySumma([data.region_id, data.main_schet_id, data.from], '<');
            case 5:
              balance_from = _context4.sent;
              _context4.next = 8;
              return BankMonitoringDB.dailySumma([data.region_id, data.main_schet_id, data.to], '<=');
            case 8:
              balance_to = _context4.sent;
              prixod_summa = 0;
              rasxod_summa = 0;
              _iterator4 = _createForOfIteratorHelper(result);
              try {
                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                  item = _step4.value;
                  prixod_summa += item.prixod_sum;
                  rasxod_summa += item.rasxod_sum;
                }
              } catch (err) {
                _iterator4.e(err);
              } finally {
                _iterator4.f();
              }
              return _context4.abrupt("return", {
                data: result,
                balance_from: balance_from,
                balance_to: balance_to,
                prixod_summa: prixod_summa,
                rasxod_summa: rasxod_summa
              });
            case 14:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function daily(_x4) {
        return _daily.apply(this, arguments);
      }
      return daily;
    }()
  }, {
    key: "dailyExcel",
    value: function () {
      var _dailyExcel = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(data) {
        var title, dateBetween, workbook, fileName, worksheet, titleCell, region, dateCell, balanceFromCell, doc_num, date, comment, schet, prixod, rasxod, headers, row_number, _iterator5, _step5, object, _schet, prixod_sum, rasxod_sum, array, itogo_prixod, itogo_rasxod, itogo_array, balanceToCell, folderPath, filePath;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              title = "\u0414\u043D\u0435\u0432\u043D\u043E\u0439 \u043E\u0442\u0447\u0435\u0442 \u043F\u043E ".concat(data.report_title.name, " \u21161. \u0421\u0447\u0435\u0442: ").concat(data.main_schet.jur1_schet, ". \u04B2\u0438\u0441\u043E\u0431 \u0440\u0430\u049B\u0430\u043C\u0438: ").concat(HelperFunctions.probelNumber(data.main_schet.account_number));
              dateBetween = "\u0417\u0430 \u043F\u0435\u0440\u0438\u043E\u0434 \u0441 ".concat(returnStringDate(new Date(data.from)), " \u043F\u043E ").concat(returnStringDate(new Date(data.to)));
              workbook = new ExcelJS.Workbook();
              fileName = "kundalik_hisobot_bank_".concat(new Date().getTime(), ".xlsx");
              worksheet = workbook.addWorksheet('Hisobot');
              worksheet.mergeCells('A1', 'G1');
              titleCell = worksheet.getCell('A1');
              Object.assign(titleCell, {
                value: title,
                font: {
                  size: 10,
                  bold: true,
                  color: {
                    argb: 'FF000000'
                  },
                  name: 'Times New Roman'
                },
                alignment: {
                  vertical: 'middle',
                  horizontal: 'left'
                }
              });
              worksheet.mergeCells('H1', 'J1');
              region = worksheet.getCell("H1");
              Object.assign(region, {
                value: data.region.name,
                font: {
                  size: 10,
                  color: {
                    argb: 'FF000000'
                  },
                  name: 'Times New Roman'
                },
                alignment: {
                  vertical: 'middle',
                  horizontal: "center"
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
              worksheet.mergeCells('A2', 'G2');
              dateCell = worksheet.getCell('A2');
              Object.assign(dateCell, {
                value: dateBetween,
                font: {
                  size: 11,
                  bold: true,
                  color: {
                    argb: 'FF000000'
                  },
                  name: 'Times New Roman'
                },
                alignment: {
                  vertical: 'middle',
                  horizontal: 'left'
                }
              });
              worksheet.mergeCells('A4', 'G4');
              balanceFromCell = worksheet.getCell('A4');
              balanceFromCell.value = "\u041E\u0441\u0442\u0430\u0442\u043E\u043A \u043A \u043D\u0430\u0447\u0430\u043B\u0443 \u0434\u043D\u044F: ".concat(returnStringSumma(data.balance_from));
              Object.assign(balanceFromCell, {
                font: {
                  size: 11,
                  bold: true,
                  color: {
                    argb: 'FF000000'
                  },
                  name: 'Times New Roman'
                },
                alignment: {
                  vertical: 'middle',
                  horizontal: 'left'
                }
              });
              doc_num = worksheet.getCell('A5');
              date = worksheet.getCell('B5');
              comment = worksheet.getCell('C5');
              schet = worksheet.getCell('D5');
              prixod = worksheet.getCell('E5');
              rasxod = worksheet.getCell('F5');
              date.value = "\u0414\u0430\u0442\u0430";
              comment.value = 'Разъяснительный текст';
              doc_num.value = "\u2116 \u0434\u043E\u043A";
              schet.value = "\u0421\u0447\u0435\u0442";
              prixod.value = 'Приход';
              rasxod.value = 'Расход';
              headers = [date, comment, doc_num, schet, prixod, rasxod];
              headers.forEach(function (item) {
                Object.assign(item, {
                  font: {
                    bold: true,
                    size: 10,
                    name: 'Times New Roman'
                  },
                  alignment: {
                    vertical: 'middle',
                    horizontal: 'center',
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
              row_number = 5;
              _iterator5 = _createForOfIteratorHelper(data.data);
              try {
                for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                  object = _step5.value;
                  object.docs.forEach(function (item) {
                    var doc_num = worksheet.getCell("A".concat(row_number + 1));
                    var date = worksheet.getCell("B".concat(row_number + 1));
                    var comment = worksheet.getCell("C".concat(row_number + 1));
                    var schet = worksheet.getCell("D".concat(row_number + 1));
                    var rasxod = worksheet.getCell("F".concat(row_number + 1));
                    var prixod = worksheet.getCell("E".concat(row_number + 1));
                    date.value = returnSleshDate(new Date(item.doc_date));
                    comment.value = item.opisanie;
                    doc_num.value = item.doc_num;
                    schet.value = item.schet;
                    prixod.value = item.prixod_sum;
                    prixod.numFmt = '#,##0.00';
                    rasxod.value = item.rasxod_sum;
                    rasxod.numFmt = '#,##0.00';
                    var array = [doc_num, date, comment, schet, rasxod, prixod];
                    array.forEach(function (item, index) {
                      var alignment = {
                        vertical: 'middle'
                      };
                      if (index === 2) {
                        alignment.horizontal = 'left';
                        alignment.wrapText = true;
                      } else if (index === 4 || index === 5) {
                        alignment.horizontal = 'right';
                      } else {
                        alignment.horizontal = 'center';
                      }
                      Object.assign(item, {
                        alignment: alignment,
                        font: {
                          name: 'Times New Roman'
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
                  });
                  worksheet.mergeCells("A".concat(row_number + 1), "D".concat(row_number + 1));
                  _schet = worksheet.getCell("A".concat(row_number + 1));
                  _schet.value = "\u0418\u0442\u043E\u0433\u043E \u043F\u043E \u0441\u0447\u0435\u0442\u0443 ".concat(object.schet);
                  prixod_sum = worksheet.getCell("E".concat(row_number + 1));
                  prixod_sum.value = object.prixod_sum;
                  prixod_sum.numFmt = '#,##0.00';
                  rasxod_sum = worksheet.getCell("F".concat(row_number + 1));
                  rasxod_sum.value = object.rasxod_sum;
                  rasxod_sum.numFmt = '#,##0.00';
                  array = [_schet, prixod_sum, rasxod_sum];
                  array.forEach(function (item, index) {
                    var horizontal = "right";
                    if (index === 0) {
                      horizontal = "left";
                    }
                    Object.assign(item, {
                      alignment: {
                        vertical: 'middle',
                        horizontal: horizontal
                      },
                      font: {
                        name: 'Times New Roman',
                        bold: true,
                        size: 9
                      }
                    });
                  });
                  row_number++;
                }
              } catch (err) {
                _iterator5.e(err);
              } finally {
                _iterator5.f();
              }
              itogo_prixod = worksheet.getCell("E".concat(row_number + 1));
              itogo_prixod.value = data.prixod_sum;
              itogo_rasxod = worksheet.getCell("F".concat(row_number + 1));
              itogo_rasxod.value = data.rasxod_sum;
              itogo_array = [itogo_prixod, itogo_rasxod];
              itogo_array.forEach(function (item) {
                Object.assign(item, {
                  numFmt: '#,##0.00',
                  font: {
                    size: 9,
                    bold: true,
                    color: {
                      argb: 'FF000000'
                    },
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
              worksheet.mergeCells("A".concat(row_number + 2), "H".concat(row_number + 2));
              balanceToCell = worksheet.getCell("A".concat(row_number + 2));
              balanceToCell.value = "\u041E\u0441\u0442\u0430\u0442\u043E\u043A \u043A\u043E\u043D\u0446\u0443 \u0434\u043D\u044F: ".concat(returnStringSumma(data.balance_to));
              Object.assign(balanceToCell, {
                font: {
                  size: 11,
                  bold: true,
                  color: {
                    argb: 'FF000000'
                  },
                  name: 'Times New Roman'
                },
                alignment: {
                  vertical: 'middle',
                  horizontal: 'left'
                }
              });
              worksheet.getColumn(2).width = 10;
              worksheet.getColumn(3).width = 12;
              worksheet.getColumn(4).width = 10;
              worksheet.getColumn(5).width = 18;
              worksheet.getColumn(6).width = 18;
              worksheet.getColumn(7).width = 9;
              worksheet.getRow(1).height = 25;
              worksheet.getRow(2).height = 20;
              worksheet.getRow(5).height = 25;
              folderPath = path.join(__dirname, '../../../../public/exports');
              _context5.prev = 55;
              _context5.next = 58;
              return access(folderPath, constants.W_OK);
            case 58:
              _context5.next = 64;
              break;
            case 60:
              _context5.prev = 60;
              _context5.t0 = _context5["catch"](55);
              _context5.next = 64;
              return mkdir(folderPath);
            case 64:
              filePath = "".concat(folderPath, "/").concat(fileName);
              _context5.next = 67;
              return workbook.xlsx.writeFile(filePath);
            case 67:
              return _context5.abrupt("return", {
                fileName: fileName,
                filePath: filePath
              });
            case 68:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[55, 60]]);
      }));
      function dailyExcel(_x5) {
        return _dailyExcel.apply(this, arguments);
      }
      return dailyExcel;
    }()
  }]);
}();