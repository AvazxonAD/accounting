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
var _require = require('./db'),
  GroupDB = _require.GroupDB;
var _require2 = require('@helper/functions'),
  HelperFunctions = _require2.HelperFunctions;
var xlsx = require('xlsx');
var path = require('path');
var fs = require('fs').promises;
var _require3 = require('@db/index'),
  db = _require3.db;
var ExcelJS = require('exceljs');
exports.GroupService = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "export",
    value: function () {
      var _export2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(data) {
        var workbook, worksheet, folderPath, fileName, filePath;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              workbook = new ExcelJS.Workbook();
              worksheet = workbook.addWorksheet('responsibles');
              worksheet.columns = [{
                header: 'ID',
                key: 'id',
                width: 10
              }, {
                header: 'Nomi',
                key: 'name',
                width: 40
              }, {
                header: 'Schet',
                key: 'schet',
                width: 30
              }, {
                header: 'Iznos foiz',
                key: 'iznos_foiz',
                width: 30
              }, {
                header: 'Debet',
                key: 'provodka_debet',
                width: 30
              }, {
                header: 'Kredit',
                key: 'provodka_kredit',
                width: 30
              }, {
                header: 'Subschet',
                key: 'provodka_subschet',
                width: 30
              }, {
                header: 'Gruh raqami',
                key: 'group_number',
                width: 30
              }, {
                header: 'Rim raqami',
                key: 'roman_numeral',
                width: 30
              }, {
                header: 'Asosiy guruh',
                key: 'pod_group',
                width: 30
              }];
              data.forEach(function (item) {
                worksheet.addRow({
                  id: item.id,
                  name: item.name,
                  schet: item.schet,
                  iznos_foiz: item.iznos_foiz,
                  provodka_debet: item.provodka_debet,
                  provodka_kredit: item.provodka_kredit,
                  provodka_subschet: item.provodka_subschet,
                  group_number: item.group_number,
                  roman_numeral: item.roman_numeral,
                  pod_group: item.pod_group
                });
              });
              worksheet.eachRow(function (row, rowNumber) {
                var bold = false;
                if (rowNumber === 1) {
                  worksheet.getRow(rowNumber).height = 30;
                  bold = true;
                }
                row.eachCell(function (cell) {
                  Object.assign(cell, {
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
              folderPath = path.join(__dirname, "../../../../public/exports");
              _context.prev = 6;
              _context.next = 9;
              return fs.access(folderPath, fs.constants.W_OK);
            case 9:
              _context.next = 15;
              break;
            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](6);
              _context.next = 15;
              return fs.mkdir(folderPath);
            case 15:
              fileName = "groups.".concat(new Date().getTime(), ".xlsx");
              filePath = "".concat(folderPath, "/").concat(fileName);
              _context.next = 19;
              return workbook.xlsx.writeFile(filePath);
            case 19:
              return _context.abrupt("return", {
                fileName: fileName,
                filePath: filePath
              });
            case 20:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[6, 11]]);
      }));
      function _export(_x) {
        return _export2.apply(this, arguments);
      }
      return _export;
    }()
  }, {
    key: "import",
    value: function () {
      var _import2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(data) {
        var _this = this;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return db.transaction(/*#__PURE__*/function () {
                var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(client) {
                  var _iterator, _step, item;
                  return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                    while (1) switch (_context2.prev = _context2.next) {
                      case 0:
                        _iterator = _createForOfIteratorHelper(data.groups);
                        _context2.prev = 1;
                        _iterator.s();
                      case 3:
                        if ((_step = _iterator.n()).done) {
                          _context2.next = 9;
                          break;
                        }
                        item = _step.value;
                        _context2.next = 7;
                        return _this.create(_objectSpread(_objectSpread({}, item), {}, {
                          client: client
                        }));
                      case 7:
                        _context2.next = 3;
                        break;
                      case 9:
                        _context2.next = 14;
                        break;
                      case 11:
                        _context2.prev = 11;
                        _context2.t0 = _context2["catch"](1);
                        _iterator.e(_context2.t0);
                      case 14:
                        _context2.prev = 14;
                        _iterator.f();
                        return _context2.finish(14);
                      case 17:
                      case "end":
                        return _context2.stop();
                    }
                  }, _callee2, null, [[1, 11, 14, 17]]);
                }));
                return function (_x3) {
                  return _ref.apply(this, arguments);
                };
              }());
            case 2:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function _import(_x2) {
        return _import2.apply(this, arguments);
      }
      return _import;
    }()
  }, {
    key: "getById",
    value: function () {
      var _getById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return GroupDB.getById([data.id]);
            case 2:
              result = _context4.sent;
              return _context4.abrupt("return", result);
            case 4:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function getById(_x4) {
        return _getById.apply(this, arguments);
      }
      return getById;
    }()
  }, {
    key: "getByName",
    value: function () {
      var _getByName = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return GroupDB.getByName([data.name]);
            case 2:
              result = _context5.sent;
              return _context5.abrupt("return", result);
            case 4:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      function getByName(_x5) {
        return _getByName.apply(this, arguments);
      }
      return getByName;
    }()
  }, {
    key: "getByNumberName",
    value: function () {
      var _getByNumberName = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return GroupDB.getByNumberName([data.number, data.name]);
            case 2:
              result = _context6.sent;
              return _context6.abrupt("return", result);
            case 4:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      function getByNumberName(_x6) {
        return _getByNumberName.apply(this, arguments);
      }
      return getByNumberName;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return GroupDB.get([data.offset, data.limit], data.search, data.id);
            case 2:
              result = _context7.sent;
              return _context7.abrupt("return", {
                data: result.data || [],
                total: result.total
              });
            case 4:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      }));
      function get(_x7) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
  }, {
    key: "create",
    value: function () {
      var _create = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return GroupDB.create([data.smeta_id, data.name, data.schet, data.iznos_foiz, data.provodka_debet ? String(data.provodka_debet).replace(/\s/g, '') : null, data.group_number, data.provodka_kredit ? String(data.provodka_kredit).replace(/\s/g, '') : null, data.provodka_subschet ? String(data.provodka_subschet).replace(/\s/g, '') : null, data.roman_numeral, data.pod_group, HelperFunctions.tashkentTime(), HelperFunctions.tashkentTime()], data.client);
            case 2:
              result = _context8.sent;
              return _context8.abrupt("return", result);
            case 4:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      }));
      function create(_x8) {
        return _create.apply(this, arguments);
      }
      return create;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return GroupDB.update([data.smeta_id, data.name, data.schet, data.iznos_foiz, data.provodka_debet, data.group_number, data.provodka_kredit, data.provodka_subschet, data.roman_numeral, data.pod_group, HelperFunctions.tashkentTime(), data.id]);
            case 2:
              result = _context9.sent;
              return _context9.abrupt("return", result);
            case 4:
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
      var _delete2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return GroupDB["delete"]([data.id]);
            case 2:
              result = _context10.sent;
              return _context10.abrupt("return", result);
            case 4:
            case "end":
              return _context10.stop();
          }
        }, _callee10);
      }));
      function _delete(_x10) {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }()
  }, {
    key: "getWithPercent",
    value: function () {
      var _getWithPercent = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11() {
        var result;
        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return GroupDB.getWithPercent();
            case 2:
              result = _context11.sent;
              return _context11.abrupt("return", result);
            case 4:
            case "end":
              return _context11.stop();
          }
        }, _callee11);
      }));
      function getWithPercent() {
        return _getWithPercent.apply(this, arguments);
      }
      return getWithPercent;
    }()
  }, {
    key: "readFile",
    value: function () {
      var _readFile = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12(data) {
        var workbook, sheetName, sheet, excel_data, result;
        return _regeneratorRuntime().wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              workbook = xlsx.readFile(data.filePath);
              sheetName = workbook.SheetNames[0];
              sheet = workbook.Sheets[sheetName];
              excel_data = xlsx.utils.sheet_to_json(sheet).map(function (row) {
                var newRow = {};
                for (var key in row) {
                  if (Object.prototype.hasOwnProperty.call(row, key)) {
                    newRow[key] = row[key];
                  }
                }
                return newRow;
              });
              result = excel_data.filter(function (item, index) {
                return index > 2;
              });
              return _context12.abrupt("return", result);
            case 6:
            case "end":
              return _context12.stop();
          }
        }, _callee12);
      }));
      function readFile(_x11) {
        return _readFile.apply(this, arguments);
      }
      return readFile;
    }()
  }, {
    key: "templateFile",
    value: function () {
      var _templateFile = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee13() {
        var fileName, folderPath, filePath, fileRes;
        return _regeneratorRuntime().wrap(function _callee13$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              fileName = "group.xlsx";
              folderPath = path.join(__dirname, "../../../../public/template");
              filePath = path.join(folderPath, fileName);
              _context13.next = 5;
              return fs.readFile(filePath);
            case 5:
              fileRes = _context13.sent;
              return _context13.abrupt("return", {
                fileName: fileName,
                fileRes: fileRes
              });
            case 7:
            case "end":
              return _context13.stop();
          }
        }, _callee13);
      }));
      function templateFile() {
        return _templateFile.apply(this, arguments);
      }
      return templateFile;
    }()
  }]);
}();