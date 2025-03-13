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
  AktDB = _require.AktDB;
var ExcelJS = require('exceljs');
var path = require('path');
var _require$promises = require('fs').promises,
  access = _require$promises.access,
  constants = _require$promises.constants,
  mkdir = _require$promises.mkdir;
var _require2 = require('@helper/functions'),
  childsSumma = _require2.childsSumma,
  HelperFunctions = _require2.HelperFunctions,
  tashkentTime = _require2.tashkentTime;
var _require3 = require('@db/index'),
  db = _require3.db;
exports.AktService = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "getSchets",
    value: function () {
      var _getSchets = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(data) {
        var result, _iterator, _step, item;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return AktDB.getSchets([data.region_id, data.main_schet_id, data.from, data.to]);
            case 2:
              result = _context.sent;
              _iterator = _createForOfIteratorHelper(result);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  item = _step.value;
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              return _context.abrupt("return", result);
            case 6:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function getSchets(_x) {
        return _getSchets.apply(this, arguments);
      }
      return getSchets;
    }()
  }, {
    key: "capExcel",
    value: function () {
      var _capExcel = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(data) {
        var workbook, fileName, worksheet, _iterator2, _step2, schet, capData, row_number, title, region, title2, title3_1, title3_2, title3_3, css_array, itogo, _iterator3, _step3, column, _title3_, _title3_2, kriditSchetCell, itogoStr, itogoSumma, folderPath, filePath;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              workbook = new ExcelJS.Workbook();
              fileName = "jur3_cap".concat(new Date().getTime(), ".xlsx");
              worksheet = null;
              if (data.schets.length === 0) {
                worksheet = workbook.addWorksheet("data not found");
              }
              _iterator2 = _createForOfIteratorHelper(data.schets);
              _context2.prev = 5;
              _iterator2.s();
            case 7:
              if ((_step2 = _iterator2.n()).done) {
                _context2.next = 59;
                break;
              }
              schet = _step2.value;
              _context2.next = 11;
              return AktDB.cap([data.from, data.to, data.region_id, schet.schet, data.main_schet_id]);
            case 11:
              capData = _context2.sent;
              row_number = 4;
              worksheet = workbook.addWorksheet("".concat(schet.schet));
              worksheet.pageSetup.margins.left = 0;
              worksheet.pageSetup.margins.header = 0;
              worksheet.pageSetup.margins.footer = 0;
              worksheet.pageSetup.margins.bottom = 0;
              worksheet.mergeCells("A1", "H1");
              title = worksheet.getCell("A1");
              title.value = "\u041C\u0435\u043C\u043E\u0440\u0438\u0430\u043B \u043E\u0440\u0434\u0435\u0440 \u2116 3 \u0421\u0447\u0435\u0442: ".concat(schet.schet);
              worksheet.mergeCells('I1', 'K1');
              region = worksheet.getCell("I1");
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
              worksheet.mergeCells('A2', 'H2');
              title2 = worksheet.getCell("A2");
              title2.value = "\u041F\u043E\u0434\u043B\u0435\u0436\u0438\u0442 \u0437\u0430\u043F\u0438\u0441\u0438 \u0432 \u0433\u043B\u0430\u0432\u043D\u0443\u044E \u043A\u043D\u0438\u0433\u0443";
              worksheet.mergeCells("A3", "C3");
              title3_1 = worksheet.getCell('A3');
              title3_1.value = 'Дебет';
              title3_2 = worksheet.getCell("D3");
              title3_2.value = 'Кредит';
              worksheet.mergeCells('E3', 'H3');
              title3_3 = worksheet.getCell('E3');
              title3_3.value = 'Сумма';
              css_array = [title, title2, title3_1, title3_2, title3_3];
              itogo = 0;
              _iterator3 = _createForOfIteratorHelper(capData);
              try {
                for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                  column = _step3.value;
                  worksheet.mergeCells("A".concat(row_number), "C".concat(row_number));
                  _title3_ = worksheet.getCell("A".concat(row_number));
                  _title3_.value = "".concat(column.schet, "   ").concat(column.smeta_number);
                  worksheet.mergeCells("E".concat(row_number), "H".concat(row_number));
                  _title3_2 = worksheet.getCell("E".concat(row_number));
                  _title3_2.value = column.summa;
                  row_number++;
                  itogo += column.summa;
                  css_array.forEach(function (coll, index) {
                    var horizontal = 'center';
                    if (index === 2) horizontal = 'right';
                    if (index === 0) horizontal = 'left';
                    Object.assign(coll, {
                      numFmt: '#,##0.00',
                      font: {
                        size: 12,
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
                }
              } catch (err) {
                _iterator3.e(err);
              } finally {
                _iterator3.f();
              }
              worksheet.mergeCells("D4", "D".concat(row_number - 1));
              kriditSchetCell = worksheet.getCell("D4");
              kriditSchetCell.value = "".concat(schet.schet);
              worksheet.mergeCells("A".concat(row_number), "D".concat(row_number));
              itogoStr = worksheet.getCell("A".concat(row_number));
              itogoStr.value = "\u0412\u0441\u0435\u0433\u043E \u043A\u0440\u0435\u0434\u0438\u0442";
              worksheet.mergeCells("E".concat(row_number), "H".concat(row_number));
              itogoSumma = worksheet.getCell("E".concat(row_number));
              itogoSumma.value = itogo;
              css_array.push(kriditSchetCell, itogoStr, itogoSumma);
              css_array.forEach(function (coll, index) {
                var vertical = 'middle';
                var bold = true;
                var horizontal = 'center';
                if (index === 5) vertical = 'top', bold = false;
                if (index === 6) horizontal = 'left';
                if (index === 7) horizontal = 'right';
                Object.assign(coll, {
                  numFmt: '#,##0.00',
                  font: {
                    size: 12,
                    bold: bold,
                    color: {
                      argb: 'FF000000'
                    },
                    name: 'Times New Roman'
                  },
                  alignment: {
                    vertical: vertical,
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
              worksheet.getRow(1).height = 35;
              worksheet.getRow(2).height = 25;
              worksheet.getColumn(1).width = 5;
              worksheet.getColumn(2).width = 5;
              worksheet.getColumn(3).width = 5;
              worksheet.getColumn(5).width = 5;
              worksheet.getColumn(6).width = 5;
            case 57:
              _context2.next = 7;
              break;
            case 59:
              _context2.next = 64;
              break;
            case 61:
              _context2.prev = 61;
              _context2.t0 = _context2["catch"](5);
              _iterator2.e(_context2.t0);
            case 64:
              _context2.prev = 64;
              _iterator2.f();
              return _context2.finish(64);
            case 67:
              folderPath = path.join(__dirname, '../../../public/exports/');
              _context2.prev = 68;
              _context2.next = 71;
              return access(folderPath, constants.W_OK);
            case 71:
              _context2.next = 77;
              break;
            case 73:
              _context2.prev = 73;
              _context2.t1 = _context2["catch"](68);
              _context2.next = 77;
              return mkdir(folderPath);
            case 77:
              filePath = "".concat(folderPath, "/").concat(fileName);
              _context2.next = 80;
              return workbook.xlsx.writeFile(filePath);
            case 80:
              return _context2.abrupt("return", {
                fileName: fileName,
                filePath: filePath
              });
            case 81:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[5, 61, 64, 67], [68, 73]]);
      }));
      function capExcel(_x2) {
        return _capExcel.apply(this, arguments);
      }
      return capExcel;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(data) {
        var result, page_summa;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return AktDB.get([data.region_id, data.main_schet_id, data.from, data.to, data.offset, data.limit], data.search);
            case 2:
              result = _context3.sent;
              page_summa = 0;
              result.data.forEach(function (item) {
                page_summa += item.summa;
              });
              return _context3.abrupt("return", _objectSpread(_objectSpread({}, result), {}, {
                page_summa: page_summa
              }));
            case 6:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function get(_x3) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
  }, {
    key: "create",
    value: function () {
      var _create = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(data) {
        var _this = this;
        var summa, result;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              summa = childsSumma(data.childs);
              _context5.next = 3;
              return db.transaction(/*#__PURE__*/function () {
                var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(client) {
                  var doc;
                  return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                    while (1) switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return AktDB.create([data.doc_num, data.doc_date, data.opisanie, summa, data.id_spravochnik_organization, data.shartnomalar_organization_id, data.main_schet_id, data.user_id, data.spravochnik_operatsii_own_id, data.organization_by_raschet_schet_id, data.organization_by_raschet_schet_gazna_id, data.shartnoma_grafik_id, tashkentTime(), tashkentTime()], client);
                      case 2:
                        doc = _context4.sent;
                        _context4.next = 5;
                        return _this.createChild(_objectSpread(_objectSpread({}, data), {}, {
                          docId: doc.id
                        }), client);
                      case 5:
                        return _context4.abrupt("return", doc);
                      case 6:
                      case "end":
                        return _context4.stop();
                    }
                  }, _callee4);
                }));
                return function (_x5) {
                  return _ref.apply(this, arguments);
                };
              }());
            case 3:
              result = _context5.sent;
              return _context5.abrupt("return", result);
            case 5:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      function create(_x4) {
        return _create.apply(this, arguments);
      }
      return create;
    }()
  }, {
    key: "createChild",
    value: function () {
      var _createChild = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(data, client) {
        var create_childs, _iterator4, _step4, item, _values;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              create_childs = [];
              _iterator4 = _createForOfIteratorHelper(data.childs);
              try {
                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                  item = _step4.value;
                  item.nds_summa = item.nds_foiz ? item.nds_foiz / 100 * item.summa : 0;
                  item.summa_s_nds = item.summa + item.nds_summa;
                  create_childs.push(item.spravochnik_operatsii_id, item.summa, item.id_spravochnik_podrazdelenie, item.id_spravochnik_sostav, item.id_spravochnik_type_operatsii, data.main_schet_id, data.docId, data.user_id, data.spravochnik_operatsii_own_id, item.kol, item.sena, item.nds_foiz, item.nds_summa, item.summa_s_nds, tashkentTime(), tashkentTime());
                }
              } catch (err) {
                _iterator4.e(err);
              } finally {
                _iterator4.f();
              }
              _values = HelperFunctions.paramsValues({
                params: create_childs,
                column_count: 16
              });
              _context6.next = 6;
              return AktDB.createChild(create_childs, _values, client);
            case 6:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      function createChild(_x6, _x7) {
        return _createChild.apply(this, arguments);
      }
      return createChild;
    }()
  }, {
    key: "getById",
    value: function () {
      var _getById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return AktDB.getById([data.region_id, data.main_schet_id, data.id], data.isdeleted);
            case 2:
              result = _context7.sent;
              return _context7.abrupt("return", result);
            case 4:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      }));
      function getById(_x8) {
        return _getById.apply(this, arguments);
      }
      return getById;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(data) {
        var _this2 = this;
        var summa, result;
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              summa = childsSumma(data.childs);
              _context9.next = 3;
              return db.transaction(/*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(client) {
                  var doc;
                  return _regeneratorRuntime().wrap(function _callee8$(_context8) {
                    while (1) switch (_context8.prev = _context8.next) {
                      case 0:
                        _context8.next = 2;
                        return AktDB.update([data.doc_num, data.doc_date, data.opisanie, summa, data.id_spravochnik_organization, data.shartnomalar_organization_id, data.spravochnik_operatsii_own_id, data.organization_by_raschet_schet_id, data.organization_by_raschet_schet_gazna_id, data.shartnoma_grafik_id, tashkentTime(), data.id], client);
                      case 2:
                        doc = _context8.sent;
                        _context8.next = 5;
                        return AktDB.deleteChild([data.id], client);
                      case 5:
                        _context8.next = 7;
                        return _this2.createChild(_objectSpread(_objectSpread({}, data), {}, {
                          docId: data.id
                        }), client);
                      case 7:
                        return _context8.abrupt("return", doc);
                      case 8:
                      case "end":
                        return _context8.stop();
                    }
                  }, _callee8);
                }));
                return function (_x10) {
                  return _ref2.apply(this, arguments);
                };
              }());
            case 3:
              result = _context9.sent;
              return _context9.abrupt("return", result);
            case 5:
            case "end":
              return _context9.stop();
          }
        }, _callee9);
      }));
      function update(_x9) {
        return _update.apply(this, arguments);
      }
      return update;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return db.transaction(/*#__PURE__*/function () {
                var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(client) {
                  var docId;
                  return _regeneratorRuntime().wrap(function _callee10$(_context10) {
                    while (1) switch (_context10.prev = _context10.next) {
                      case 0:
                        _context10.next = 2;
                        return AktDB["delete"]([data.id], client);
                      case 2:
                        docId = _context10.sent;
                        return _context10.abrupt("return", docId);
                      case 4:
                      case "end":
                        return _context10.stop();
                    }
                  }, _callee10);
                }));
                return function (_x12) {
                  return _ref3.apply(this, arguments);
                };
              }());
            case 2:
              result = _context11.sent;
              return _context11.abrupt("return", result);
            case 4:
            case "end":
              return _context11.stop();
          }
        }, _callee11);
      }));
      function _delete(_x11) {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }()
  }]);
}();