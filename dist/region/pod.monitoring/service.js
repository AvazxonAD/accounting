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
  PodotchetMonitoringDB = _require.PodotchetMonitoringDB;
var ExcelJS = require('exceljs');
var _require2 = require('@helper/functions'),
  returnStringDate = _require2.returnStringDate,
  formatSubSchet = _require2.formatSubSchet;
var path = require('path');
exports.PodotchetMonitoringService = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "cap",
    value: function () {
      var _cap = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(data) {
        var itogo_rasxod, result, uniqueSchets, _iterator, _step, _loop, _iterator2, _step2, item;
        return _regeneratorRuntime().wrap(function _callee$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              itogo_rasxod = 0;
              _context2.next = 3;
              return PodotchetMonitoringDB.cap([data.region_id, data.main_schet_id, data.operatsii, data.from, data.to]);
            case 3:
              result = _context2.sent;
              uniqueSchets = Array.from(new Set(result.map(function (item) {
                return item.schet;
              }))).map(function (schet) {
                return {
                  schet: schet
                };
              });
              _iterator = _createForOfIteratorHelper(uniqueSchets);
              _context2.prev = 6;
              _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
                var schet, _iterator3, _step3, doc;
                return _regeneratorRuntime().wrap(function _loop$(_context) {
                  while (1) switch (_context.prev = _context.next) {
                    case 0:
                      schet = _step.value;
                      schet.summa = 0;
                      _iterator3 = _createForOfIteratorHelper(result);
                      try {
                        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                          doc = _step3.value;
                          if (schet.schet === doc.schet) {
                            schet.summa += doc.summa;
                          }
                        }
                        // Corrected filter
                      } catch (err) {
                        _iterator3.e(err);
                      } finally {
                        _iterator3.f();
                      }
                      schet.docs = result.filter(function (item) {
                        return item.schet === schet.schet;
                      });
                    case 5:
                    case "end":
                      return _context.stop();
                  }
                }, _loop);
              });
              _iterator.s();
            case 9:
              if ((_step = _iterator.n()).done) {
                _context2.next = 13;
                break;
              }
              return _context2.delegateYield(_loop(), "t0", 11);
            case 11:
              _context2.next = 9;
              break;
            case 13:
              _context2.next = 18;
              break;
            case 15:
              _context2.prev = 15;
              _context2.t1 = _context2["catch"](6);
              _iterator.e(_context2.t1);
            case 18:
              _context2.prev = 18;
              _iterator.f();
              return _context2.finish(18);
            case 21:
              _iterator2 = _createForOfIteratorHelper(result);
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  item = _step2.value;
                  itogo_rasxod += item.summa;
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
              return _context2.abrupt("return", {
                data: uniqueSchets,
                itogo_rasxod: itogo_rasxod
              });
            case 24:
            case "end":
              return _context2.stop();
          }
        }, _callee, null, [[6, 15, 18, 21]]);
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
        var workbook, fileName, worksheet, row_number, _iterator4, _step4, schet, _iterator5, _step5, doc, sub_schet, filePath;
        return _regeneratorRuntime().wrap(function _callee2$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              workbook = new ExcelJS.Workbook();
              fileName = "cap_".concat(new Date().getTime(), ".xlsx");
              worksheet = workbook.addWorksheet('organization prixod rasxod');
              worksheet.mergeCells("A1", 'F1');
              worksheet.getCell('A1').value = 'Мемориал ордер N_4';
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
              _iterator4 = _createForOfIteratorHelper(data.organizations);
              try {
                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                  schet = _step4.value;
                  _iterator5 = _createForOfIteratorHelper(schet.docs);
                  try {
                    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                      doc = _step5.value;
                      sub_schet = formatSubSchet(doc.sub_schet);
                      worksheet.getCell("A".concat(row_number)).value = doc.schet;
                      worksheet.getCell("B".concat(row_number)).value = sub_schet[0];
                      worksheet.getCell("C".concat(row_number)).value = sub_schet[1];
                      worksheet.getCell("D".concat(row_number)).value = sub_schet[2];
                      worksheet.getCell("F".concat(row_number)).value = doc.summa;
                      row_number++;
                    }
                  } catch (err) {
                    _iterator5.e(err);
                  } finally {
                    _iterator5.f();
                  }
                  worksheet.mergeCells("A".concat(row_number), "E".concat(row_number));
                  worksheet.getCell("A".concat(row_number)).value = "\u0418\u0442\u043E\u0433\u043E ".concat(schet.schet);
                  worksheet.getCell("F".concat(row_number)).value = schet.summa;
                  row_number++;
                }
              } catch (err) {
                _iterator4.e(err);
              } finally {
                _iterator4.f();
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
              _context3.next = 35;
              return workbook.xlsx.writeFile(filePath);
            case 35:
              return _context3.abrupt("return", {
                fileName: fileName,
                filePath: filePath
              });
            case 36:
            case "end":
              return _context3.stop();
          }
        }, _callee2);
      }));
      function capExcel(_x2) {
        return _capExcel.apply(this, arguments);
      }
      return capExcel;
    }()
  }]);
}();