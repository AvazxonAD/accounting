"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
var jwt = require('jsonwebtoken');
var path = require('path');
var fs = require('fs').promises;
var xlsx = require('xlsx');
exports.HelperFunctions = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "readFile",
    value: function () {
      var _readFile = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(filePath) {
        var workbook, sheetName, sheet, excel_data, result, header;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              workbook = xlsx.readFile(filePath);
              sheetName = workbook.SheetNames[0];
              sheet = workbook.Sheets[sheetName];
              excel_data = xlsx.utils.sheet_to_json(sheet).map(function (row, index) {
                var newRow = {};
                for (var key in row) {
                  if (Object.prototype.hasOwnProperty.call(row, key)) {
                    newRow[key] = row[key];
                  }
                }
                return newRow;
              });
              result = excel_data.filter(function (item, index) {
                return index >= 3;
              });
              header = excel_data.filter(function (item, index) {
                return index === 3;
              });
              return _context.abrupt("return", {
                result: result,
                header: header
              });
            case 7:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function readFile(_x) {
        return _readFile.apply(this, arguments);
      }
      return readFile;
    }()
  }, {
    key: "checkYearMonth",
    value: function checkYearMonth(array) {
      var year = array[0].year;
      var month = array[0].month;
      var _iterator = _createForOfIteratorHelper(array),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          if (item.year !== year || item.month !== month) {
            return false;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return {
        year: year,
        month: month,
        full_date: new Date("".concat(year, "-").concat(month, "-01"))
      };
    }
  }, {
    key: "lastDate",
    value: function lastDate(date) {
      if (date.month === 1) return {
        month: 12,
        year: date.year - 1
      };else if (date.month > 1) return {
        month: date.month - 1,
        year: date.year
      };else return null;
    }
  }, {
    key: "nextDate",
    value: function nextDate(date) {
      if (date.month === 12) return {
        month: 1,
        year: date.year + 1
      };else if (date.month < 12) return {
        month: date.month + 1,
        year: date.year
      };else return null;
    }
  }, {
    key: "returnTemplateFile",
    value: function () {
      var _returnTemplateFile = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(fileName, lang) {
        var folderPath, filePath, fileRes;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              folderPath = path.join(__dirname, "../../public/template");
              filePath = path.join(folderPath, fileName);
              _context2.prev = 2;
              _context2.next = 5;
              return fs.access(filePath, fs.constants.R_OK);
            case 5:
              _context2.next = 10;
              break;
            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](2);
              throw new Error(lang.t('fileError'));
            case 10:
              _context2.next = 12;
              return fs.readFile(filePath);
            case 12:
              fileRes = _context2.sent;
              return _context2.abrupt("return", {
                fileName: fileName,
                fileRes: fileRes
              });
            case 14:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[2, 7]]);
      }));
      function returnTemplateFile(_x2, _x3) {
        return _returnTemplateFile.apply(this, arguments);
      }
      return returnTemplateFile;
    }()
  }, {
    key: "sum",
    value: function sum() {
      var sum = 0;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      args.map(function (arg) {
        return sum += Number(arg);
      });
      return sum;
    }
  }, {
    key: "tashkentTime",
    value: function tashkentTime() {
      var currentUtcDate = new Date();
      var tashkentOffset = 10 * 60 * 60 * 1000;
      var tashkentDate = new Date(currentUtcDate.getTime() + tashkentOffset);
      return tashkentDate.toISOString();
    }
  }, {
    key: "returnMonth",
    value: function returnMonth(month) {
      switch (month) {
        case 1:
          return "январь";
        case 2:
          return "февраль";
        case 3:
          return "март";
        case 4:
          return "апрель";
        case 5:
          return "май";
        case 6:
          return "июнь";
        case 7:
          return "июль";
        case 8:
          return "август";
        case 9:
          return "сентябрь";
        case 10:
          return "октябрь";
        case 11:
          return "ноябрь";
        case 12:
          return "декабрь";
        default:
          return "server xatolik";
      }
    }
  }, {
    key: "formatSubSchet",
    value: function formatSubSchet(str) {
      var result = ['', '', ''];
      for (var i = 0; i < str.length; i++) {
        if (i < 2) {
          result[0] += str[i];
        } else if (i < 4) {
          result[1] += str[i];
        } else {
          result[2] += str[i];
        }
      }
      return result;
    }
  }, {
    key: "filters",
    value: function filters(data) {
      return data.length ? "AND ".concat(data.join(' AND ')) : '';
    }
  }, {
    key: "summaDoc",
    value: function summaDoc(data) {
      var summa = data.reduce(function (acc, item) {
        return acc += item.summa;
      }, 0);
      return summa;
    }
  }, {
    key: "saldoSumma",
    value: function saldoSumma(data) {
      var summa = {
        prixod_summa: 0,
        rasxod_summa: 0
      };
      if (data.prixod) {
        summa.prixod_summa = data.childs.reduce(function (acc, item) {
          return acc += item.summa;
        }, 0);
      } else if (data.rasxod) {
        summa.rasxod_summa = data.childs.reduce(function (acc, item) {
          return acc += item.summa;
        }, 0);
      }
      return summa;
    }
  }, {
    key: "paramsValues",
    value: function paramsValues(data) {
      var index_max = data.params.length;
      var values = '(';
      for (var i = 1; i <= index_max; i++) {
        if (index_max === i) {
          values += " $".concat(i, ")");
        } else if (i % data.column_count === 0) {
          values += " $".concat(i, "), (");
        } else {
          values += "$".concat(i, ", ");
        }
      }
      return values;
    }
  }, {
    key: "excelSerialToDate",
    value: function excelSerialToDate(serial) {
      var excelEpoch = new Date(1899, 11, 30);
      var date = new Date(excelEpoch.getTime() + serial * 86400000);
      return date.toISOString().split('T')[0];
    }
  }, {
    key: "probelNumber",
    value: function probelNumber(num) {
      var strNum = String(num);
      return strNum.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
  }, {
    key: "getMonthStartEnd",
    value: function getMonthStartEnd(year, month) {
      var startDate = new Date(year, month - 1, 1);
      var endDate = new Date(year, month, 0);
      return [startDate, endDate];
    }
  }, {
    key: "returnStringDate",
    value: function returnStringDate(date) {
      function getMonth(month) {
        switch (month) {
          case "01":
            return "январь";
          case "02":
            return "февраль";
          case "03":
            return "март";
          case "04":
            return "апрель";
          case "05":
            return "май";
          case "06":
            return "июнь";
          case "07":
            return "июль";
          case "08":
            return "август";
          case "09":
            return "сентябрь";
          case "10":
            return "октябрь";
          case "11":
            return "ноябрь";
          case "12":
            return "декабрь";
          default:
            return "server xatolik";
        }
      }
      var day = date.getDate().toString().padStart(2, "0");
      var month = (date.getMonth() + 1).toString().padStart(2, "0");
      var year = date.getFullYear().toString();
      month = getMonth(month);
      return "".concat(year, " ").concat(day, "-").concat(month);
    }
  }]);
}();
exports.tashkentTime = function () {
  var currentUtcDate = new Date();
  var tashkentOffset = 10 * 60 * 60 * 1000;
  var tashkentDate = new Date(currentUtcDate.getTime() + tashkentOffset);
  return tashkentDate.toISOString();
};
exports.sum = function () {
  var sum = 0;
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }
  args.map(function (arg) {
    return sum += Number(arg);
  });
  return sum;
};
exports.childsSumma = function (args) {
  var sum = 0;
  args.map(function (arg) {
    return sum += Number(arg.summa);
  });
  return sum;
};
exports.checkUniqueIds = function (array) {
  var ids = array.map(function (item) {
    return item.id ? item.id : item.spravochnik_main_book_schet_id ? item.spravochnik_main_book_schet_id : item.smeta_grafik_id;
  });
  var uniqueIds = new Set(ids);
  return ids.length === uniqueIds.size;
};
exports.returnStringDate = function (date) {
  function getMonth(month) {
    switch (month) {
      case "01":
        return "январь";
      case "02":
        return "февраль";
      case "03":
        return "март";
      case "04":
        return "апрель";
      case "05":
        return "май";
      case "06":
        return "июнь";
      case "07":
        return "июль";
      case "08":
        return "август";
      case "09":
        return "сентябрь";
      case "10":
        return "октябрь";
      case "11":
        return "ноябрь";
      case "12":
        return "декабрь";
      default:
        return "server xatolik";
    }
  }
  var day = date.getDate().toString().padStart(2, "0");
  var month = (date.getMonth() + 1).toString().padStart(2, "0");
  var year = date.getFullYear().toString();
  month = getMonth(month);
  return "".concat(year, " ").concat(day, "-").concat(month);
};
exports.returnLocalDate = function (date) {
  var day = date.getDate().toString().padStart(2, "0");
  var month = (date.getMonth() + 1).toString().padStart(2, "0");
  var year = date.getFullYear().toString();
  return "".concat(day, ".").concat(month, ".").concat(year);
};
exports.returnSleshDate = function (date) {
  var day = date.getDate().toString().padStart(2, "0");
  var month = (date.getMonth() + 1).toString().padStart(2, "0");
  var year = date.getFullYear().toString();
  return "".concat(day, "/").concat(month, "/").concat(year);
};
exports.designParams = function (params, design_keys) {
  return allValues = params.reduce(function (acc, obj) {
    var sortValues = design_keys.map(function (key) {
      return obj[key];
    });
    return acc.concat(Object.values(sortValues));
  }, []);
};
exports.sqlFilter = function (column_name, index_contract_id) {
  return "AND ".concat(column_name, " = $").concat(index_contract_id);
};
exports.returnStringSumma = function (num) {
  var formatNumber = function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  if (Number.isInteger(num)) {
    return formatNumber(num) + ".00";
  } else {
    var parts = num.toString().split(".");
    parts[0] = formatNumber(parts[0]);
    return parts.join(".");
  }
};
exports.returnParamsValues = function (params, column_count) {
  var index_max = params.length;
  var values = '(';
  for (var i = 1; i <= index_max; i++) {
    if (index_max === i) {
      values += " $".concat(i, ")");
    } else if (i % column_count === 0) {
      values += " $".concat(i, "), (");
    } else {
      values += "$".concat(i, ", ");
    }
  }
  return values;
};
exports.generateToken = function (user) {
  var payload = user;
  var secret = process.env.JWT_SECRET;
  var options = {
    expiresIn: process.env.JWT_EXPIRE || "30d"
  };
  var token = jwt.sign(payload, secret, options);
  return token;
};
exports.checkSchetsEquality = function (childs) {
  var firstSchet = childs[0].schet;
  return childs.every(function (child) {
    return child.schet === firstSchet;
  });
};
exports.checkTovarId = function (array) {
  var test;
  var _iterator2 = _createForOfIteratorHelper(array),
    _step2;
  try {
    var _loop = function _loop() {
      var item = _step2.value;
      test = array.filter(function (element) {
        return element.naimenovanie_tovarov_jur7_id === item.naimenovanie_tovarov_jur7_id;
      });
      if (test.length > 1) {
        test = true;
      } else {
        test = false;
      }
    };
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return test;
};
exports.filterLogs = function (array) {
  var logPattern = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\.\s*(\w+)\.\s*id:(\d+)\.\s*user_id:(\d+)/;
  var logs = array.map(function (line) {
    var match = line.match(logPattern);
    if (match) {
      return {
        date: match[1],
        type: match[2],
        id: match[3],
        user_id: match[4]
      };
    }
    return null;
  }).filter(function (log) {
    return log !== null;
  });
  return logs;
};
exports.parseLogs = function (logs, type) {
  return logs.map(function (log) {
    var match = log.match(/^(.*?)\. (\w+)\. id:([\d,]+)\. user_id:(\d+)/);
    if (match) {
      return _defineProperty({
        date: match[1],
        type: match[2],
        ids: match[3].split(',').map(function (id) {
          return parseInt(id);
        }),
        user_id: match[4]
      }, "type", type);
    }
    return null;
  }).filter(function (entry) {
    return entry !== null;
  });
};
exports.returnExcelColumn = function (columns) {
  if (columns.length === 1) {
    var columnNumber = columns[0];
    var result = '';
    while (columnNumber > 0) {
      var remainder = (columnNumber - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      columnNumber = Math.floor((columnNumber - 1) / 26);
    }
    return result;
  }
  var results = [];
  columns.forEach(function (columnNumber) {
    var result = '';
    while (columnNumber > 0) {
      var _remainder = (columnNumber - 1) % 26;
      result = String.fromCharCode(65 + _remainder) + result;
      columnNumber = Math.floor((columnNumber - 1) / 26);
    }
    results.push(result);
  });
  return results;
};
exports.getMonthStartEnd = function (year, month) {
  var startDate = new Date(year, month - 1, 1);
  var endDate = new Date(year, month, 0);
  return [startDate, endDate];
};
exports.getDayStartEnd = function (year, month) {
  var startOfMonth = 1;
  var endOfMonth = new Date(year, month, 0).getDate();
  return {
    start: startOfMonth,
    end: endOfMonth
  };
};
exports.returnMonth = function (month) {
  switch (month) {
    case 1:
      return "январь";
    case 2:
      return "февраль";
    case 3:
      return "март";
    case 4:
      return "апрель";
    case 5:
      return "май";
    case 6:
      return "июнь";
    case 7:
      return "июль";
    case 8:
      return "август";
    case 9:
      return "сентябрь";
    case 10:
      return "октябрь";
    case 11:
      return "ноябрь";
    case 12:
      return "декабрь";
    default:
      return "server xatolik";
  }
};
exports.formatSubSchet = function (str) {
  var result = ['', '', ''];
  for (var i = 0; i < str.length; i++) {
    if (i < 2) {
      result[0] += str[i];
    } else if (i < 4) {
      result[1] += str[i];
    } else {
      result[2] += str[i];
    }
  }
  return result;
};
exports.checkSchetsEquality = function (childs) {
  var firstSchet = childs[0].schet;
  return childs.every(function (child) {
    return child.schet === firstSchet;
  });
};