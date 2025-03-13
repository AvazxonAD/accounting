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
  OrganizationDB = _require.OrganizationDB;
var xlsx = require('xlsx');
var _require2 = require('@helper/functions'),
  tashkentTime = _require2.tashkentTime,
  HelperFunctions = _require2.HelperFunctions;
var _require3 = require('@db/index'),
  db = _require3.db;
var _require4 = require('@bank/service'),
  BankService = _require4.BankService;
var path = require('path');
var fs = require('fs').promises;
var _require5 = require('./gazna/db'),
  GaznaDB = _require5.GaznaDB;
var _require6 = require('./account_number/db'),
  AccountNumberDB = _require6.AccountNumberDB;
exports.OrganizationService = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "setParentId",
    value: function () {
      var _setParentId = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return db.transaction(/*#__PURE__*/function () {
                var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(client) {
                  var organization_ids, _iterator, _step, doc;
                  return _regeneratorRuntime().wrap(function _callee$(_context) {
                    while (1) switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return OrganizationDB.setNullParentId([data.parent_id], client);
                      case 2:
                        organization_ids = [];
                        _iterator = _createForOfIteratorHelper(data.organization_ids);
                        _context.prev = 4;
                        _iterator.s();
                      case 6:
                        if ((_step = _iterator.n()).done) {
                          _context.next = 15;
                          break;
                        }
                        doc = _step.value;
                        _context.t0 = organization_ids;
                        _context.next = 11;
                        return OrganizationDB.setParentId([data.parent_id, doc.id], client);
                      case 11:
                        _context.t1 = _context.sent;
                        _context.t0.push.call(_context.t0, _context.t1);
                      case 13:
                        _context.next = 6;
                        break;
                      case 15:
                        _context.next = 20;
                        break;
                      case 17:
                        _context.prev = 17;
                        _context.t2 = _context["catch"](4);
                        _iterator.e(_context.t2);
                      case 20:
                        _context.prev = 20;
                        _iterator.f();
                        return _context.finish(20);
                      case 23:
                        return _context.abrupt("return", organization_ids);
                      case 24:
                      case "end":
                        return _context.stop();
                    }
                  }, _callee, null, [[4, 17, 20, 23]]);
                }));
                return function (_x2) {
                  return _ref.apply(this, arguments);
                };
              }());
            case 2:
              result = _context2.sent;
              return _context2.abrupt("return", result);
            case 4:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function setParentId(_x) {
        return _setParentId.apply(this, arguments);
      }
      return setParentId;
    }()
  }, {
    key: "templateFile",
    value: function () {
      var _templateFile = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        var fileName, folderPath, filePath, fileRes;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              fileName = "organization.xlsx";
              folderPath = path.join(__dirname, "../../../../public/template");
              filePath = path.join(folderPath, fileName);
              _context3.next = 5;
              return fs.readFile(filePath);
            case 5:
              fileRes = _context3.sent;
              return _context3.abrupt("return", {
                fileName: fileName,
                fileRes: fileRes
              });
            case 7:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function templateFile() {
        return _templateFile.apply(this, arguments);
      }
      return templateFile;
    }()
  }, {
    key: "getByInn",
    value: function () {
      var _getByInn = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return OrganizationDB.getByInn([data.region_id, data.inn]);
            case 2:
              result = _context4.sent;
              return _context4.abrupt("return", result);
            case 4:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function getByInn(_x3) {
        return _getByInn.apply(this, arguments);
      }
      return getByInn;
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
              return OrganizationDB.getByName([data.region_id, data.name]);
            case 2:
              result = _context5.sent;
              return _context5.abrupt("return", result);
            case 4:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      function getByName(_x4) {
        return _getByName.apply(this, arguments);
      }
      return getByName;
    }()
  }, {
    key: "create",
    value: function () {
      var _create = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return db.transaction(/*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(client) {
                  var organ, _iterator2, _step2, gazna, _iterator3, _step3, acccount_number;
                  return _regeneratorRuntime().wrap(function _callee6$(_context6) {
                    while (1) switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.next = 2;
                        return OrganizationDB.create([data.name, data.bank_klient, data.raschet_schet, data.raschet_schet_gazna, data.mfo, data.inn, data.user_id, data.okonx, data.parent_id, tashkentTime(), tashkentTime()], client);
                      case 2:
                        organ = _context6.sent;
                        _iterator2 = _createForOfIteratorHelper(data.gaznas);
                        _context6.prev = 4;
                        _iterator2.s();
                      case 6:
                        if ((_step2 = _iterator2.n()).done) {
                          _context6.next = 12;
                          break;
                        }
                        gazna = _step2.value;
                        _context6.next = 10;
                        return GaznaDB.create([organ.id, gazna.raschet_schet_gazna, HelperFunctions.tashkentTime(), HelperFunctions.tashkentTime()], client);
                      case 10:
                        _context6.next = 6;
                        break;
                      case 12:
                        _context6.next = 17;
                        break;
                      case 14:
                        _context6.prev = 14;
                        _context6.t0 = _context6["catch"](4);
                        _iterator2.e(_context6.t0);
                      case 17:
                        _context6.prev = 17;
                        _iterator2.f();
                        return _context6.finish(17);
                      case 20:
                        _iterator3 = _createForOfIteratorHelper(data.account_numbers);
                        _context6.prev = 21;
                        _iterator3.s();
                      case 23:
                        if ((_step3 = _iterator3.n()).done) {
                          _context6.next = 29;
                          break;
                        }
                        acccount_number = _step3.value;
                        _context6.next = 27;
                        return AccountNumberDB.create([organ.id, acccount_number.raschet_schet, HelperFunctions.tashkentTime(), HelperFunctions.tashkentTime()], client);
                      case 27:
                        _context6.next = 23;
                        break;
                      case 29:
                        _context6.next = 34;
                        break;
                      case 31:
                        _context6.prev = 31;
                        _context6.t1 = _context6["catch"](21);
                        _iterator3.e(_context6.t1);
                      case 34:
                        _context6.prev = 34;
                        _iterator3.f();
                        return _context6.finish(34);
                      case 37:
                        return _context6.abrupt("return", organ);
                      case 38:
                      case "end":
                        return _context6.stop();
                    }
                  }, _callee6, null, [[4, 14, 17, 20], [21, 31, 34, 37]]);
                }));
                return function (_x6) {
                  return _ref2.apply(this, arguments);
                };
              }());
            case 2:
              result = _context7.sent;
              return _context7.abrupt("return", result);
            case 4:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      }));
      function create(_x5) {
        return _create.apply(this, arguments);
      }
      return create;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return OrganizationDB.get([data.region_id, data.offset, data.limit], data.search, data.organ_id, data.parent, data.parent_id);
            case 2:
              result = _context8.sent;
              return _context8.abrupt("return", result);
            case 4:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      }));
      function get(_x7) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee10$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return db.transaction(/*#__PURE__*/function () {
                var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(client) {
                  var organization, create_gazna, create_account_number, _iterator4, _step4, _loop, _iterator5, _step5, _gazna, _i, _create_gazna, gazna, _iterator6, _step6, _loop2, _iterator7, _step7, _account_number, _i2, _create_account_numbe, account_number;
                  return _regeneratorRuntime().wrap(function _callee9$(_context11) {
                    while (1) switch (_context11.prev = _context11.next) {
                      case 0:
                        _context11.next = 2;
                        return OrganizationDB.update([data.name, data.bank_klient, data.raschet_schet, data.raschet_schet_gazna, data.mfo, data.inn, data.okonx, data.parent_id, data.id], client);
                      case 2:
                        organization = _context11.sent;
                        create_gazna = [];
                        create_account_number = []; // gazna
                        _iterator4 = _createForOfIteratorHelper(data.old_data.gaznas);
                        _context11.prev = 6;
                        _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
                          var gazna, check;
                          return _regeneratorRuntime().wrap(function _loop$(_context9) {
                            while (1) switch (_context9.prev = _context9.next) {
                              case 0:
                                gazna = _step4.value;
                                check = data.gaznas.find(function (item) {
                                  return item.id === gazna.id;
                                });
                                if (check) {
                                  _context9.next = 5;
                                  break;
                                }
                                _context9.next = 5;
                                return GaznaDB["delete"]([gazna.id], client);
                              case 5:
                              case "end":
                                return _context9.stop();
                            }
                          }, _loop);
                        });
                        _iterator4.s();
                      case 9:
                        if ((_step4 = _iterator4.n()).done) {
                          _context11.next = 13;
                          break;
                        }
                        return _context11.delegateYield(_loop(), "t0", 11);
                      case 11:
                        _context11.next = 9;
                        break;
                      case 13:
                        _context11.next = 18;
                        break;
                      case 15:
                        _context11.prev = 15;
                        _context11.t1 = _context11["catch"](6);
                        _iterator4.e(_context11.t1);
                      case 18:
                        _context11.prev = 18;
                        _iterator4.f();
                        return _context11.finish(18);
                      case 21:
                        _iterator5 = _createForOfIteratorHelper(data.gaznas);
                        _context11.prev = 22;
                        _iterator5.s();
                      case 24:
                        if ((_step5 = _iterator5.n()).done) {
                          _context11.next = 34;
                          break;
                        }
                        _gazna = _step5.value;
                        if (_gazna.id) {
                          _context11.next = 30;
                          break;
                        }
                        create_gazna.push(_gazna);
                        _context11.next = 32;
                        break;
                      case 30:
                        _context11.next = 32;
                        return GaznaDB.update([organization.id, _gazna.raschet_schet_gazna, HelperFunctions.tashkentTime(), _gazna.id], client);
                      case 32:
                        _context11.next = 24;
                        break;
                      case 34:
                        _context11.next = 39;
                        break;
                      case 36:
                        _context11.prev = 36;
                        _context11.t2 = _context11["catch"](22);
                        _iterator5.e(_context11.t2);
                      case 39:
                        _context11.prev = 39;
                        _iterator5.f();
                        return _context11.finish(39);
                      case 42:
                        _i = 0, _create_gazna = create_gazna;
                      case 43:
                        if (!(_i < _create_gazna.length)) {
                          _context11.next = 50;
                          break;
                        }
                        gazna = _create_gazna[_i];
                        _context11.next = 47;
                        return GaznaDB.create([organization.id, gazna.raschet_schet_gazna, HelperFunctions.tashkentTime(), HelperFunctions.tashkentTime()], client);
                      case 47:
                        _i++;
                        _context11.next = 43;
                        break;
                      case 50:
                        // account_number
                        _iterator6 = _createForOfIteratorHelper(data.old_data.account_numbers);
                        _context11.prev = 51;
                        _loop2 = /*#__PURE__*/_regeneratorRuntime().mark(function _loop2() {
                          var account_number, check;
                          return _regeneratorRuntime().wrap(function _loop2$(_context10) {
                            while (1) switch (_context10.prev = _context10.next) {
                              case 0:
                                account_number = _step6.value;
                                check = data.account_numbers.find(function (item) {
                                  return item.id === account_number.id;
                                });
                                if (check) {
                                  _context10.next = 5;
                                  break;
                                }
                                _context10.next = 5;
                                return AccountNumberDB["delete"]([account_number.id], client);
                              case 5:
                              case "end":
                                return _context10.stop();
                            }
                          }, _loop2);
                        });
                        _iterator6.s();
                      case 54:
                        if ((_step6 = _iterator6.n()).done) {
                          _context11.next = 58;
                          break;
                        }
                        return _context11.delegateYield(_loop2(), "t3", 56);
                      case 56:
                        _context11.next = 54;
                        break;
                      case 58:
                        _context11.next = 63;
                        break;
                      case 60:
                        _context11.prev = 60;
                        _context11.t4 = _context11["catch"](51);
                        _iterator6.e(_context11.t4);
                      case 63:
                        _context11.prev = 63;
                        _iterator6.f();
                        return _context11.finish(63);
                      case 66:
                        _iterator7 = _createForOfIteratorHelper(data.account_numbers);
                        _context11.prev = 67;
                        _iterator7.s();
                      case 69:
                        if ((_step7 = _iterator7.n()).done) {
                          _context11.next = 79;
                          break;
                        }
                        _account_number = _step7.value;
                        if (_account_number.id) {
                          _context11.next = 75;
                          break;
                        }
                        create_account_number.push(_account_number);
                        _context11.next = 77;
                        break;
                      case 75:
                        _context11.next = 77;
                        return AccountNumberDB.update([organization.id, _account_number.raschet_schet, HelperFunctions.tashkentTime(), _account_number.id], client);
                      case 77:
                        _context11.next = 69;
                        break;
                      case 79:
                        _context11.next = 84;
                        break;
                      case 81:
                        _context11.prev = 81;
                        _context11.t5 = _context11["catch"](67);
                        _iterator7.e(_context11.t5);
                      case 84:
                        _context11.prev = 84;
                        _iterator7.f();
                        return _context11.finish(84);
                      case 87:
                        _i2 = 0, _create_account_numbe = create_account_number;
                      case 88:
                        if (!(_i2 < _create_account_numbe.length)) {
                          _context11.next = 95;
                          break;
                        }
                        account_number = _create_account_numbe[_i2];
                        _context11.next = 92;
                        return AccountNumberDB.create([organization.id, account_number.raschet_schet, HelperFunctions.tashkentTime(), HelperFunctions.tashkentTime()], client);
                      case 92:
                        _i2++;
                        _context11.next = 88;
                        break;
                      case 95:
                        return _context11.abrupt("return", organization);
                      case 96:
                      case "end":
                        return _context11.stop();
                    }
                  }, _callee9, null, [[6, 15, 18, 21], [22, 36, 39, 42], [51, 60, 63, 66], [67, 81, 84, 87]]);
                }));
                return function (_x9) {
                  return _ref3.apply(this, arguments);
                };
              }());
            case 2:
              result = _context12.sent;
              return _context12.abrupt("return", result);
            case 4:
            case "end":
              return _context12.stop();
          }
        }, _callee10);
      }));
      function update(_x8) {
        return _update.apply(this, arguments);
      }
      return update;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee11$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              _context13.next = 2;
              return OrganizationDB["delete"]([data.id]);
            case 2:
              result = _context13.sent;
              return _context13.abrupt("return", result);
            case 4:
            case "end":
              return _context13.stop();
          }
        }, _callee11);
      }));
      function _delete(_x10) {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }()
  }, {
    key: "getById",
    value: function () {
      var _getById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee12$(_context14) {
          while (1) switch (_context14.prev = _context14.next) {
            case 0:
              _context14.next = 2;
              return OrganizationDB.getById([data.region_id, data.id], data.isdeleted);
            case 2:
              result = _context14.sent;
              return _context14.abrupt("return", result);
            case 4:
            case "end":
              return _context14.stop();
          }
        }, _callee12);
      }));
      function getById(_x11) {
        return _getById.apply(this, arguments);
      }
      return getById;
    }()
  }, {
    key: "import",
    value: function () {
      var _import2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee14(data) {
        var _this = this;
        return _regeneratorRuntime().wrap(function _callee14$(_context16) {
          while (1) switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return db.transaction(/*#__PURE__*/function () {
                var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee13(client) {
                  var _iterator8, _step8, item;
                  return _regeneratorRuntime().wrap(function _callee13$(_context15) {
                    while (1) switch (_context15.prev = _context15.next) {
                      case 0:
                        _iterator8 = _createForOfIteratorHelper(data.data);
                        _context15.prev = 1;
                        _iterator8.s();
                      case 3:
                        if ((_step8 = _iterator8.n()).done) {
                          _context15.next = 9;
                          break;
                        }
                        item = _step8.value;
                        _context15.next = 7;
                        return _this.create(_objectSpread(_objectSpread({}, item), {}, {
                          user_id: data.user_id
                        }), client);
                      case 7:
                        _context15.next = 3;
                        break;
                      case 9:
                        _context15.next = 14;
                        break;
                      case 11:
                        _context15.prev = 11;
                        _context15.t0 = _context15["catch"](1);
                        _iterator8.e(_context15.t0);
                      case 14:
                        _context15.prev = 14;
                        _iterator8.f();
                        return _context15.finish(14);
                      case 17:
                      case "end":
                        return _context15.stop();
                    }
                  }, _callee13, null, [[1, 11, 14, 17]]);
                }));
                return function (_x13) {
                  return _ref4.apply(this, arguments);
                };
              }());
            case 2:
            case "end":
              return _context16.stop();
          }
        }, _callee14);
      }));
      function _import(_x12) {
        return _import2.apply(this, arguments);
      }
      return _import;
    }()
  }, {
    key: "readFile",
    value: function () {
      var _readFile = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee15(data) {
        var workbook, sheetName, sheet, excel_data, result, header;
        return _regeneratorRuntime().wrap(function _callee15$(_context17) {
          while (1) switch (_context17.prev = _context17.next) {
            case 0:
              workbook = xlsx.readFile(data.filePath);
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
              return _context17.abrupt("return", {
                result: result,
                header: header
              });
            case 7:
            case "end":
              return _context17.stop();
          }
        }, _callee15);
      }));
      function readFile(_x14) {
        return _readFile.apply(this, arguments);
      }
      return readFile;
    }()
  }]);
}();