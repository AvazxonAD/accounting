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
var _require = require('@saldo/db'),
  SaldoDB = _require.SaldoDB;
var _require2 = require('@helper/functions'),
  tashkentTime = _require2.tashkentTime;
var _require3 = require('@db/index'),
  db = _require3.db;
var xlsx = require('xlsx');
var _require4 = require('@product/db'),
  ProductDB = _require4.ProductDB;
var _require5 = require('@responsible/db'),
  ResponsibleDB = _require5.ResponsibleDB;
exports.SaldoService = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "cleanData",
    value: function () {
      var _cleanData = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(data) {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return db.transaction(/*#__PURE__*/function () {
                var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(client) {
                  return _regeneratorRuntime().wrap(function _callee$(_context) {
                    while (1) switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return SaldoDB.cleanData([data.region_id], client);
                      case 2:
                      case "end":
                        return _context.stop();
                    }
                  }, _callee);
                }));
                return function (_x2) {
                  return _ref.apply(this, arguments);
                };
              }());
            case 2:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function cleanData(_x) {
        return _cleanData.apply(this, arguments);
      }
      return cleanData;
    }()
  }, {
    key: "getFirstSaldoDate",
    value: function () {
      var _getFirstSaldoDate = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return SaldoDB.getFirstSaldoDate([data.region_id]);
            case 2:
              result = _context3.sent;
              return _context3.abrupt("return", result);
            case 4:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function getFirstSaldoDate(_x3) {
        return _getFirstSaldoDate.apply(this, arguments);
      }
      return getFirstSaldoDate;
    }()
  }, {
    key: "checkDoc",
    value: function () {
      var _checkDoc = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return SaldoDB.checkDoc([data.product_id]);
            case 2:
              result = _context4.sent;
              return _context4.abrupt("return", result);
            case 4:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function checkDoc(_x4) {
        return _checkDoc.apply(this, arguments);
      }
      return checkDoc;
    }()
  }, {
    key: "deleteById",
    value: function () {
      var _deleteById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return SaldoDB.deleteById([data.id]);
            case 2:
              result = _context5.sent;
              return _context5.abrupt("return", result);
            case 4:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      function deleteById(_x5) {
        return _deleteById.apply(this, arguments);
      }
      return deleteById;
    }()
  }, {
    key: "updateIznosSumma",
    value: function () {
      var _updateIznosSumma = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return SaldoDB.updateIznosSumma([data.iznos_summa, data.id]);
            case 2:
              result = _context6.sent;
              return _context6.abrupt("return", result);
            case 4:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      function updateIznosSumma(_x6) {
        return _updateIznosSumma.apply(this, arguments);
      }
      return updateIznosSumma;
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
              return SaldoDB.getById([data.region_id, data.id], data.isdeleted, data.iznos);
            case 2:
              result = _context7.sent;
              return _context7.abrupt("return", result);
            case 4:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      }));
      function getById(_x7) {
        return _getById.apply(this, arguments);
      }
      return getById;
    }()
  }, {
    key: "getByGroup",
    value: function () {
      var _getByGroup = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(data) {
        var month, year, _iterator, _step, group, products, _iterator2, _step2, product;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              month = new Date(data.to).getMonth() + 1;
              year = new Date(data.to).getFullYear();
              _iterator = _createForOfIteratorHelper(data.groups);
              _context8.prev = 3;
              _iterator.s();
            case 5:
              if ((_step = _iterator.n()).done) {
                _context8.next = 35;
                break;
              }
              group = _step.value;
              _context8.next = 9;
              return SaldoDB.get([data.region_id, year, month, 0, 99999], data.responsible_id, data.search, data.product_id, group.id, data.iznos);
            case 9:
              products = _context8.sent;
              group.products = products.data;
              _iterator2 = _createForOfIteratorHelper(group.products);
              _context8.prev = 12;
              _iterator2.s();
            case 14:
              if ((_step2 = _iterator2.n()).done) {
                _context8.next = 24;
                break;
              }
              product = _step2.value;
              _context8.next = 18;
              return SaldoDB.getKolAndSumma([product.naimenovanie_tovarov_jur7_id], "".concat(year, "-").concat(month < 10 ? "0".concat(month) : month, "-01"), data.to, product.responsible.id);
            case 18:
              product.internal = _context8.sent;
              product.to = {
                kol: product.from.kol + product.internal.kol,
                summa: product.from.summa + product.internal.summa,
                iznos_summa: product.from.iznos_summa + product.internal.iznos_summa
              };
              if (product.to.kol !== 0) {
                product.to.sena = product.to.summa / product.to.kol;
              } else {
                product.to.sena = product.to.summa;
              }
              if (product.iznos) {
                product.to.month_iznos = product.month_iznos_summa;
                product.to.eski_iznos_summa = product.eski_iznos_summa;
              }
            case 22:
              _context8.next = 14;
              break;
            case 24:
              _context8.next = 29;
              break;
            case 26:
              _context8.prev = 26;
              _context8.t0 = _context8["catch"](12);
              _iterator2.e(_context8.t0);
            case 29:
              _context8.prev = 29;
              _iterator2.f();
              return _context8.finish(29);
            case 32:
              if (data.iznos) {
                group.products = group.products.filter(function (item) {
                  return item.to.kol !== 0 && item.to.summa !== 0 || item.to.iznos_summa !== 0;
                });
              } else {
                group.products = group.products.filter(function (item) {
                  return item.to.kol !== 0 && item.to.summa !== 0;
                });
              }
            case 33:
              _context8.next = 5;
              break;
            case 35:
              _context8.next = 40;
              break;
            case 37:
              _context8.prev = 37;
              _context8.t1 = _context8["catch"](3);
              _iterator.e(_context8.t1);
            case 40:
              _context8.prev = 40;
              _iterator.f();
              return _context8.finish(40);
            case 43:
              return _context8.abrupt("return", data.groups);
            case 44:
            case "end":
              return _context8.stop();
          }
        }, _callee8, null, [[3, 37, 40, 43], [12, 26, 29, 32]]);
      }));
      function getByGroup(_x8) {
        return _getByGroup.apply(this, arguments);
      }
      return getByGroup;
    }()
  }, {
    key: "lastSaldo",
    value: function () {
      var _lastSaldo = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(data) {
        var last_saldo;
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return SaldoDB.get([data.region_id, data.year, data.month, 0, 99999]);
            case 2:
              last_saldo = _context9.sent;
              return _context9.abrupt("return", last_saldo.data);
            case 4:
            case "end":
              return _context9.stop();
          }
        }, _callee9);
      }));
      function lastSaldo(_x9) {
        return _lastSaldo.apply(this, arguments);
      }
      return lastSaldo;
    }()
  }, {
    key: "getBlock",
    value: function () {
      var _getBlock = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return SaldoDB.getBlock([data.region_id]);
            case 2:
              result = _context10.sent;
              return _context10.abrupt("return", result);
            case 4:
            case "end":
              return _context10.stop();
          }
        }, _callee10);
      }));
      function getBlock(_x10) {
        return _getBlock.apply(this, arguments);
      }
      return getBlock;
    }()
  }, {
    key: "getSaldoDate",
    value: function () {
      var _getSaldoDate = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(data) {
        var result;
        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return SaldoDB.getSaldoDate([data.region_id, data.date]);
            case 2:
              result = _context11.sent;
              return _context11.abrupt("return", result);
            case 4:
            case "end":
              return _context11.stop();
          }
        }, _callee11);
      }));
      function getSaldoDate(_x11) {
        return _getSaldoDate.apply(this, arguments);
      }
      return getSaldoDate;
    }()
  }, {
    key: "check",
    value: function () {
      var _check = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12(data) {
        var result, first, end;
        return _regeneratorRuntime().wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return SaldoDB.check([data.region_id], data.year, data.month);
            case 2:
              result = _context12.sent;
              _context12.next = 5;
              return SaldoDB.getFirstSaldoDate([data.region_id]);
            case 5:
              first = _context12.sent;
              _context12.next = 8;
              return SaldoDB.getEndSaldoDate([data.region_id]);
            case 8:
              end = _context12.sent;
              return _context12.abrupt("return", {
                result: result,
                meta: {
                  first: first,
                  end: end
                }
              });
            case 10:
            case "end":
              return _context12.stop();
          }
        }, _callee12);
      }));
      function check(_x12) {
        return _check.apply(this, arguments);
      }
      return check;
    }()
  }, {
    key: "create",
    value: function () {
      var _create = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee14(data) {
        var _yield$ResponsibleDB$, responsibles, _iterator3, _step3, _loop, result, dates;
        return _regeneratorRuntime().wrap(function _callee14$(_context15) {
          while (1) switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return ResponsibleDB.get([0, 99999], data.region_id);
            case 2:
              _yield$ResponsibleDB$ = _context15.sent;
              responsibles = _yield$ResponsibleDB$.data;
              _iterator3 = _createForOfIteratorHelper(responsibles);
              _context15.prev = 5;
              _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
                var responsible, _iterator7, _step7, product;
                return _regeneratorRuntime().wrap(function _loop$(_context14) {
                  while (1) switch (_context14.prev = _context14.next) {
                    case 0:
                      responsible = _step3.value;
                      responsible.products = data.last_saldo.filter(function (item) {
                        return item.responsible_id === responsible.id;
                      });
                      _iterator7 = _createForOfIteratorHelper(responsible.products);
                      _context14.prev = 3;
                      _iterator7.s();
                    case 5:
                      if ((_step7 = _iterator7.n()).done) {
                        _context14.next = 17;
                        break;
                      }
                      product = _step7.value;
                      _context14.next = 9;
                      return SaldoDB.getKolAndSumma([product.naimenovanie_tovarov_jur7_id], "".concat(data.last_date.year, "-").concat(data.last_date.month, "-01"), "".concat(data.year, "-").concat(data.month, "-01"), responsible.id);
                    case 9:
                      product.data = _context14.sent;
                      product.data.kol = product.data.kol + product.kol;
                      product.data.summa = product.data.summa + product.summa;
                      if (product.data.kol !== 0) {
                        product.data.sena = product.data.summa / product.data.kol;
                      } else {
                        product.data.sena = product.data.summa;
                      }
                      product.id = product.naimenovanie_tovarov_jur7_id;
                      product.doc_data = {
                        doc_date: product.prixod_data.doc_date,
                        doc_num: product.prixod_data.doc_num,
                        id: product.prixod_data.doc_id
                      };
                    case 15:
                      _context14.next = 5;
                      break;
                    case 17:
                      _context14.next = 22;
                      break;
                    case 19:
                      _context14.prev = 19;
                      _context14.t0 = _context14["catch"](3);
                      _iterator7.e(_context14.t0);
                    case 22:
                      _context14.prev = 22;
                      _iterator7.f();
                      return _context14.finish(22);
                    case 25:
                      responsible.products = responsible.products.filter(function (item) {
                        return item.data.iznos_summa !== 0 || item.data.kol !== 0 && item.data.summa !== 0;
                      });
                    case 26:
                    case "end":
                      return _context14.stop();
                  }
                }, _loop, null, [[3, 19, 22, 25]]);
              });
              _iterator3.s();
            case 8:
              if ((_step3 = _iterator3.n()).done) {
                _context15.next = 12;
                break;
              }
              return _context15.delegateYield(_loop(), "t0", 10);
            case 10:
              _context15.next = 8;
              break;
            case 12:
              _context15.next = 17;
              break;
            case 14:
              _context15.prev = 14;
              _context15.t1 = _context15["catch"](5);
              _iterator3.e(_context15.t1);
            case 17:
              _context15.prev = 17;
              _iterator3.f();
              return _context15.finish(17);
            case 20:
              _context15.next = 22;
              return responsibles.filter(function (item) {
                return item.products.length !== 0;
              });
            case 22:
              result = _context15.sent;
              _context15.next = 25;
              return db.transaction(/*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee13(client) {
                  var _iterator4, _step4, responsible, _iterator6, _step6, _product$doc_data, _product$doc_data2, _product$doc_data3, product, sena, iznos_summa, month_iznos_summa, check, dates, _iterator5, _step5, date;
                  return _regeneratorRuntime().wrap(function _callee13$(_context13) {
                    while (1) switch (_context13.prev = _context13.next) {
                      case 0:
                        _context13.next = 2;
                        return SaldoDB["delete"]([data.year, data.month, data.region_id], client);
                      case 2:
                        _iterator4 = _createForOfIteratorHelper(result);
                        _context13.prev = 3;
                        _iterator4.s();
                      case 5:
                        if ((_step4 = _iterator4.n()).done) {
                          _context13.next = 33;
                          break;
                        }
                        responsible = _step4.value;
                        _iterator6 = _createForOfIteratorHelper(responsible.products);
                        _context13.prev = 8;
                        _iterator6.s();
                      case 10:
                        if ((_step6 = _iterator6.n()).done) {
                          _context13.next = 23;
                          break;
                        }
                        product = _step6.value;
                        sena = 0;
                        iznos_summa = 0;
                        if (product.data.kol !== 0) {
                          sena = product.data.summa / product.data.kol;
                        } else {
                          sena = product.data.summa;
                        }
                        month_iznos_summa = sena * (product.group.iznos_foiz / 100);
                        if (product.data.kol !== 0) {
                          iznos_summa = month_iznos_summa + product.data.iznos_summa;
                          if (sena !== 0) {
                            month_iznos_summa = month_iznos_summa >= sena ? sena : month_iznos_summa;
                            iznos_summa = iznos_summa >= sena ? sena : iznos_summa;
                          }
                        } else {
                          iznos_summa = product.data.iznos_summa;
                        }
                        _context13.next = 19;
                        return SaldoDB.create([data.user_id, product.id, product.data.kol, sena, product.data.summa, data.month, data.year, "".concat(data.year, "-").concat(data.month, "-01"), ((_product$doc_data = product.doc_data) === null || _product$doc_data === void 0 ? void 0 : _product$doc_data.doc_date) || "".concat(data.year, "-").concat(data.month, "-01"), ((_product$doc_data2 = product.doc_data) === null || _product$doc_data2 === void 0 ? void 0 : _product$doc_data2.doc_num) || 'saldo', responsible.id, data.region_id, (_product$doc_data3 = product.doc_data) === null || _product$doc_data3 === void 0 ? void 0 : _product$doc_data3.id, product.iznos, iznos_summa, product.iznos_schet, product.iznos_sub_schet, product.data.iznos_summa, product.iznos_start, month_iznos_summa, tashkentTime(), tashkentTime()], client);
                      case 19:
                        _context13.next = 21;
                        return SaldoDB.unblock([data.region_id, data.year, data.month]);
                      case 21:
                        _context13.next = 10;
                        break;
                      case 23:
                        _context13.next = 28;
                        break;
                      case 25:
                        _context13.prev = 25;
                        _context13.t0 = _context13["catch"](8);
                        _iterator6.e(_context13.t0);
                      case 28:
                        _context13.prev = 28;
                        _iterator6.f();
                        return _context13.finish(28);
                      case 31:
                        _context13.next = 5;
                        break;
                      case 33:
                        _context13.next = 38;
                        break;
                      case 35:
                        _context13.prev = 35;
                        _context13.t1 = _context13["catch"](3);
                        _iterator4.e(_context13.t1);
                      case 38:
                        _context13.prev = 38;
                        _iterator4.f();
                        return _context13.finish(38);
                      case 41:
                        _context13.next = 43;
                        return SaldoDB.getSaldoDate([data.region_id, "".concat(data.year, "-").concat(data.month, "-01")]);
                      case 43:
                        check = _context13.sent;
                        dates = [];
                        _iterator5 = _createForOfIteratorHelper(check);
                        _context13.prev = 46;
                        _iterator5.s();
                      case 48:
                        if ((_step5 = _iterator5.n()).done) {
                          _context13.next = 57;
                          break;
                        }
                        date = _step5.value;
                        _context13.t2 = dates;
                        _context13.next = 53;
                        return SaldoDB.createSaldoDate([data.region_id, date.year, date.month, tashkentTime(), tashkentTime()], client);
                      case 53:
                        _context13.t3 = _context13.sent;
                        _context13.t2.push.call(_context13.t2, _context13.t3);
                      case 55:
                        _context13.next = 48;
                        break;
                      case 57:
                        _context13.next = 62;
                        break;
                      case 59:
                        _context13.prev = 59;
                        _context13.t4 = _context13["catch"](46);
                        _iterator5.e(_context13.t4);
                      case 62:
                        _context13.prev = 62;
                        _iterator5.f();
                        return _context13.finish(62);
                      case 65:
                        return _context13.abrupt("return", dates);
                      case 66:
                      case "end":
                        return _context13.stop();
                    }
                  }, _callee13, null, [[3, 35, 38, 41], [8, 25, 28, 31], [46, 59, 62, 65]]);
                }));
                return function (_x14) {
                  return _ref2.apply(this, arguments);
                };
              }());
            case 25:
              dates = _context15.sent;
              return _context15.abrupt("return", dates);
            case 27:
            case "end":
              return _context15.stop();
          }
        }, _callee14, null, [[5, 14, 17, 20]]);
      }));
      function create(_x13) {
        return _create.apply(this, arguments);
      }
      return create;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee15(data) {
        var _yield$SaldoDB$get, result;
        return _regeneratorRuntime().wrap(function _callee15$(_context16) {
          while (1) switch (_context16.prev = _context16.next) {
            case 0:
              _context16.next = 2;
              return SaldoDB.get([data.region_id, data.year, data.month, 0, 99999]);
            case 2:
              _yield$SaldoDB$get = _context16.sent;
              result = _yield$SaldoDB$get.data;
              return _context16.abrupt("return", result);
            case 5:
            case "end":
              return _context16.stop();
          }
        }, _callee15);
      }));
      function get(_x15) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee17(data) {
        var dates;
        return _regeneratorRuntime().wrap(function _callee17$(_context18) {
          while (1) switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return db.transaction(/*#__PURE__*/function () {
                var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee16(client) {
                  var _iterator8, _step8, id, check, dates, _iterator9, _step9, date;
                  return _regeneratorRuntime().wrap(function _callee16$(_context17) {
                    while (1) switch (_context17.prev = _context17.next) {
                      case 0:
                        _iterator8 = _createForOfIteratorHelper(data.ids);
                        _context17.prev = 1;
                        _iterator8.s();
                      case 3:
                        if ((_step8 = _iterator8.n()).done) {
                          _context17.next = 9;
                          break;
                        }
                        id = _step8.value;
                        _context17.next = 7;
                        return SaldoDB.deleteById([id.id], client);
                      case 7:
                        _context17.next = 3;
                        break;
                      case 9:
                        _context17.next = 14;
                        break;
                      case 11:
                        _context17.prev = 11;
                        _context17.t0 = _context17["catch"](1);
                        _iterator8.e(_context17.t0);
                      case 14:
                        _context17.prev = 14;
                        _iterator8.f();
                        return _context17.finish(14);
                      case 17:
                        _context17.next = 19;
                        return SaldoDB.getSaldoDate([data.region_id, "".concat(data.year, "-").concat(data.month, "-01")]);
                      case 19:
                        check = _context17.sent;
                        dates = [];
                        _iterator9 = _createForOfIteratorHelper(check);
                        _context17.prev = 22;
                        _iterator9.s();
                      case 24:
                        if ((_step9 = _iterator9.n()).done) {
                          _context17.next = 33;
                          break;
                        }
                        date = _step9.value;
                        _context17.t1 = dates;
                        _context17.next = 29;
                        return SaldoDB.createSaldoDate([data.region_id, date.year, date.month, tashkentTime(), tashkentTime()], client);
                      case 29:
                        _context17.t2 = _context17.sent;
                        _context17.t1.push.call(_context17.t1, _context17.t2);
                      case 31:
                        _context17.next = 24;
                        break;
                      case 33:
                        _context17.next = 38;
                        break;
                      case 35:
                        _context17.prev = 35;
                        _context17.t3 = _context17["catch"](22);
                        _iterator9.e(_context17.t3);
                      case 38:
                        _context17.prev = 38;
                        _iterator9.f();
                        return _context17.finish(38);
                      case 41:
                        return _context17.abrupt("return", dates);
                      case 42:
                      case "end":
                        return _context17.stop();
                    }
                  }, _callee16, null, [[1, 11, 14, 17], [22, 35, 38, 41]]);
                }));
                return function (_x17) {
                  return _ref3.apply(this, arguments);
                };
              }());
            case 2:
              dates = _context18.sent;
              return _context18.abrupt("return", dates);
            case 4:
            case "end":
              return _context18.stop();
          }
        }, _callee17);
      }));
      function _delete(_x16) {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }()
  }, {
    key: "importData",
    value: function () {
      var _importData = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee19(data) {
        return _regeneratorRuntime().wrap(function _callee19$(_context20) {
          while (1) switch (_context20.prev = _context20.next) {
            case 0:
              _context20.next = 2;
              return db.transaction(/*#__PURE__*/function () {
                var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee18(client) {
                  var saldo_create, _iterator10, _step10, _doc, i, product, _product, dates, year, month, first_date, _i, _saldo_create, doc, old_iznos, iznos_summa, month_iznos_summa, next_saldo, _iterator11, _step11, date;
                  return _regeneratorRuntime().wrap(function _callee18$(_context19) {
                    while (1) switch (_context19.prev = _context19.next) {
                      case 0:
                        saldo_create = [];
                        _iterator10 = _createForOfIteratorHelper(data.docs);
                        _context19.prev = 2;
                        _iterator10.s();
                      case 4:
                        if ((_step10 = _iterator10.n()).done) {
                          _context19.next = 25;
                          break;
                        }
                        _doc = _step10.value;
                        _doc.sena = _doc.summa / _doc.kol;
                        if (!_doc.iznos) {
                          _context19.next = 19;
                          break;
                        }
                        i = 1;
                      case 9:
                        if (!(i <= _doc.kol)) {
                          _context19.next = 17;
                          break;
                        }
                        _context19.next = 12;
                        return ProductDB.create([data.user_id, data.budjet_id, _doc.name, _doc.edin, _doc.group_jur7_id, _doc.inventar_num, _doc.serial_num, _doc.iznos, tashkentTime(), tashkentTime()], client);
                      case 12:
                        product = _context19.sent;
                        saldo_create.push(_objectSpread(_objectSpread({}, _doc), {}, {
                          product_id: product.id,
                          kol: 1,
                          summa: _doc.sena
                        }));
                      case 14:
                        i++;
                        _context19.next = 9;
                        break;
                      case 17:
                        _context19.next = 23;
                        break;
                      case 19:
                        _context19.next = 21;
                        return ProductDB.create([data.user_id, data.budjet_id, _doc.name, _doc.edin, _doc.group_jur7_id, _doc.inventar_num, _doc.serial_num, _doc.iznos, tashkentTime(), tashkentTime()], client);
                      case 21:
                        _product = _context19.sent;
                        saldo_create.push(_objectSpread({
                          product_id: _product.id
                        }, _doc));
                      case 23:
                        _context19.next = 4;
                        break;
                      case 25:
                        _context19.next = 30;
                        break;
                      case 27:
                        _context19.prev = 27;
                        _context19.t0 = _context19["catch"](2);
                        _iterator10.e(_context19.t0);
                      case 30:
                        _context19.prev = 30;
                        _iterator10.f();
                        return _context19.finish(30);
                      case 33:
                        dates = [];
                        _context19.next = 36;
                        return SaldoDB.getFirstSaldoDate([data.region_id]);
                      case 36:
                        first_date = _context19.sent;
                        if (first_date) {
                          first_date = new Date(first_date.date_saldo);
                          if (first_date < data.date_saldo.full_date) {
                            year = first_date.getFullYear();
                            month = first_date.getMonth() + 1;
                          } else {
                            year = data.date_saldo.full_date.getFullYear();
                            month = data.date_saldo.full_date.getMonth() + 1;
                          }
                        } else {
                          year = data.date_saldo.full_date.getFullYear();
                          month = data.date_saldo.full_date.getMonth() + 1;
                        }
                        _i = 0, _saldo_create = saldo_create;
                      case 39:
                        if (!(_i < _saldo_create.length)) {
                          _context19.next = 50;
                          break;
                        }
                        doc = _saldo_create[_i];
                        old_iznos = 0;
                        iznos_summa = 0;
                        month_iznos_summa = 0;
                        if (doc.iznos) {
                          month_iznos_summa = doc.sena * (doc.iznos_foiz / 100);
                          old_iznos = doc.eski_iznos_summa ? doc.eski_iznos_summa / doc.kol : 0;
                          iznos_summa = month_iznos_summa + old_iznos;
                          iznos_summa = iznos_summa >= doc.sena ? doc.sena : iznos_summa;
                          old_iznos = old_iznos >= doc.sena ? doc.sena : old_iznos;
                          month_iznos_summa = month_iznos_summa >= doc.sena ? doc.sena : month_iznos_summa;
                        }
                        _context19.next = 47;
                        return SaldoDB.create([data.user_id, doc.product_id, doc.kol, doc.sena, doc.summa, month, year, "".concat(year, "-").concat(month, "-01"), (doc === null || doc === void 0 ? void 0 : doc.doc_date) || "".concat(year, "-").concat(month, "-01"), (doc === null || doc === void 0 ? void 0 : doc.doc_num) || 'saldo', doc.responsible_id, data.region_id, null, doc.iznos, iznos_summa, doc.iznos_schet, doc.iznos_sub_schet, old_iznos, doc.iznos_start, month_iznos_summa, tashkentTime(), tashkentTime()], client);
                      case 47:
                        _i++;
                        _context19.next = 39;
                        break;
                      case 50:
                        _context19.next = 52;
                        return SaldoDB.getSaldoDate([data.region_id, "".concat(year, "-").concat(month, "-01")], client);
                      case 52:
                        next_saldo = _context19.sent;
                        _iterator11 = _createForOfIteratorHelper(next_saldo);
                        _context19.prev = 54;
                        _iterator11.s();
                      case 56:
                        if ((_step11 = _iterator11.n()).done) {
                          _context19.next = 65;
                          break;
                        }
                        date = _step11.value;
                        _context19.t1 = dates;
                        _context19.next = 61;
                        return SaldoDB.createSaldoDate([data.region_id, date.year, date.month, tashkentTime(), tashkentTime()], client);
                      case 61:
                        _context19.t2 = _context19.sent;
                        _context19.t1.push.call(_context19.t1, _context19.t2);
                      case 63:
                        _context19.next = 56;
                        break;
                      case 65:
                        _context19.next = 70;
                        break;
                      case 67:
                        _context19.prev = 67;
                        _context19.t3 = _context19["catch"](54);
                        _iterator11.e(_context19.t3);
                      case 70:
                        _context19.prev = 70;
                        _iterator11.f();
                        return _context19.finish(70);
                      case 73:
                      case "end":
                        return _context19.stop();
                    }
                  }, _callee18, null, [[2, 27, 30, 33], [54, 67, 70, 73]]);
                }));
                return function (_x19) {
                  return _ref4.apply(this, arguments);
                };
              }());
            case 2:
            case "end":
              return _context20.stop();
          }
        }, _callee19);
      }));
      function importData(_x18) {
        return _importData.apply(this, arguments);
      }
      return importData;
    }()
  }, {
    key: "readFile",
    value: function () {
      var _readFile = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee20(data) {
        var workbook, sheetName, sheet, excel_data, result, header;
        return _regeneratorRuntime().wrap(function _callee20$(_context21) {
          while (1) switch (_context21.prev = _context21.next) {
            case 0:
              workbook = xlsx.readFile(data.filePath);
              sheetName = workbook.SheetNames[0];
              sheet = workbook.Sheets[sheetName];
              excel_data = xlsx.utils.sheet_to_json(sheet).map(function (row, index) {
                var newRow = {};
                for (var key in row) {
                  if (Object.prototype.hasOwnProperty.call(row, key)) {
                    newRow[key] = row[key];
                    newRow.index = index + 2;
                  }
                }
                return newRow;
              });
              result = excel_data.filter(function (item, index) {
                return index >= 3;
              });
              header = excel_data.filter(function (item, index) {
                return index === 2;
              });
              return _context21.abrupt("return", {
                result: result,
                header: header
              });
            case 7:
            case "end":
              return _context21.stop();
          }
        }, _callee20);
      }));
      function readFile(_x20) {
        return _readFile.apply(this, arguments);
      }
      return readFile;
    }()
  }]);
}();