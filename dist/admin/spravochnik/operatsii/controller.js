"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _require = require("./operatsii.service"),
  createOperatsiiService = _require.createOperatsiiService,
  getAllOperatsiiService = _require.getAllOperatsiiService,
  updateOperatsiiService = _require.updateOperatsiiService,
  deleteOperatsiiService = _require.deleteOperatsiiService,
  getByIdOperatsiiService = _require.getByIdOperatsiiService,
  getSchetService = _require.getSchetService;
var pool = require("@config/db");
var ErrorResponse = require("@utils/errorResponse");
var xlsx = require("xlsx");
var _require2 = require("@utils/validation"),
  operatsiiValidation = _require2.operatsiiValidation,
  operatsiiQueryValidation = _require2.operatsiiQueryValidation;
;
var _require3 = require("@smeta/db"),
  SmetaDB = _require3.SmetaDB;
var _require4 = require('@utils/errorCatch'),
  errorCatch = _require4.errorCatch;
var _require5 = require("@utils/resFunc"),
  resFunc = _require5.resFunc;
var _require6 = require("@utils/response-for-validation"),
  validationResponse = _require6.validationResponse;
var _require7 = require('./service'),
  OperatsiiService = _require7.OperatsiiService;
var _require8 = require('@budjet/service'),
  BudjetService = _require8.BudjetService;
var _require9 = require('../../../helper/functions'),
  HelperFunctions = _require9.HelperFunctions;
var Controller = /*#__PURE__*/function () {
  function Controller() {
    _classCallCheck(this, Controller);
  }
  return _createClass(Controller, null, [{
    key: "uniqueSchets",
    value: function () {
      var _uniqueSchets = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
        var _req$query, type_schet, budjet_id, budjet, result;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _req$query = req.query, type_schet = _req$query.type_schet, budjet_id = _req$query.budjet_id;
              if (!budjet_id) {
                _context.next = 7;
                break;
              }
              _context.next = 4;
              return BudjetService.getById({
                id: budjet_id
              });
            case 4:
              budjet = _context.sent;
              if (budjet) {
                _context.next = 7;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('budjetNotFound'), 404));
            case 7:
              _context.next = 9;
              return OperatsiiService.uniqueSchets({
                type_schet: type_schet,
                budjet_id: budjet_id
              });
            case 9:
              result = _context.sent;
              return _context.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, null, result));
            case 11:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function uniqueSchets(_x, _x2) {
        return _uniqueSchets.apply(this, arguments);
      }
      return uniqueSchets;
    }()
  }, {
    key: "templateFile",
    value: function () {
      var _templateFile = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
        var _yield$OperatsiiServi, fileName, fileRes;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return OperatsiiService.templateFile();
            case 2:
              _yield$OperatsiiServi = _context2.sent;
              fileName = _yield$OperatsiiServi.fileName;
              fileRes = _yield$OperatsiiServi.fileRes;
              res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
              res.setHeader('Content-Disposition', "attachment; filename=\"".concat(fileName, "\""));
              return _context2.abrupt("return", res.send(fileRes));
            case 8:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function templateFile(_x3, _x4) {
        return _templateFile.apply(this, arguments);
      }
      return templateFile;
    }()
  }]);
}();
var getSchet = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var result;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return getSchetService();
        case 3:
          result = _context3.sent;
          return _context3.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, null, result));
        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          errorCatch(_context3.t0, res);
        case 10:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 7]]);
  }));
  return function getSchet(_x5, _x6) {
    return _ref.apply(this, arguments);
  };
}();

// createOperatsii
var createOperatsii = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var data, smeta, budjet, result;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          data = validationResponse(operatsiiValidation, req.body);
          if (!data.smeta_id) {
            _context4.next = 9;
            break;
          }
          _context4.next = 5;
          return SmetaDB.getById([data.smeta_id]);
        case 5:
          smeta = _context4.sent;
          if (smeta) {
            _context4.next = 8;
            break;
          }
          return _context4.abrupt("return", res.status(404).json({
            message: "smeta not found"
          }));
        case 8:
          ;
        case 9:
          if (!data.budjet_id) {
            _context4.next = 15;
            break;
          }
          _context4.next = 12;
          return BudjetService.getById({
            id: data.budjet_id
          });
        case 12:
          budjet = _context4.sent;
          if (budjet) {
            _context4.next = 15;
            break;
          }
          return _context4.abrupt("return", res.error(req.i18n.t('budjetNotFound'), 404));
        case 15:
          _context4.next = 17;
          return createOperatsiiService(_objectSpread({}, data));
        case 17:
          result = _context4.sent;
          return _context4.abrupt("return", res.success(req.i18n.t('createSuccess'), 200, null, result));
        case 21:
          _context4.prev = 21;
          _context4.t0 = _context4["catch"](0);
          errorCatch(_context4.t0, res);
        case 24:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 21]]);
  }));
  return function createOperatsii(_x7, _x8) {
    return _ref2.apply(this, arguments);
  };
}();

// get all
var getOperatsii = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var _validationResponse, page, limit, type_schet, search, meta_search, schet, sub_schet, budjet_id, offset, _yield$getAllOperatsi, result, total, pageCount, meta;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _validationResponse = validationResponse(operatsiiQueryValidation, req.query), page = _validationResponse.page, limit = _validationResponse.limit, type_schet = _validationResponse.type_schet, search = _validationResponse.search, meta_search = _validationResponse.meta_search, schet = _validationResponse.schet, sub_schet = _validationResponse.sub_schet, budjet_id = _validationResponse.budjet_id;
          offset = (page - 1) * limit;
          _context5.next = 5;
          return getAllOperatsiiService(offset, limit, type_schet, search, meta_search, schet, sub_schet, budjet_id);
        case 5:
          _yield$getAllOperatsi = _context5.sent;
          result = _yield$getAllOperatsi.result;
          total = _yield$getAllOperatsi.total;
          pageCount = Math.ceil(total / limit);
          meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1
          };
          resFunc(res, 200, result, meta);
          _context5.next = 16;
          break;
        case 13:
          _context5.prev = 13;
          _context5.t0 = _context5["catch"](0);
          return _context5.abrupt("return", errorCatch(_context5.t0, res));
        case 16:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 13]]);
  }));
  return function getOperatsii(_x9, _x10) {
    return _ref3.apply(this, arguments);
  };
}();

// updateOperatsii
var updateOperatsii = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var id, data, smeta, budjet, result;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          id = req.params.id;
          _context6.next = 4;
          return getByIdOperatsiiService(id, null);
        case 4:
          data = validationResponse(operatsiiValidation, req.body);
          if (!data.smeta_id) {
            _context6.next = 12;
            break;
          }
          _context6.next = 8;
          return SmetaDB.getById([data.smeta_id]);
        case 8:
          smeta = _context6.sent;
          if (smeta) {
            _context6.next = 11;
            break;
          }
          return _context6.abrupt("return", res.status(404).json({
            message: "smeta not found"
          }));
        case 11:
          ;
        case 12:
          if (!data.budjet_id) {
            _context6.next = 18;
            break;
          }
          _context6.next = 15;
          return BudjetService.getById({
            id: data.budjet_id
          });
        case 15:
          budjet = _context6.sent;
          if (budjet) {
            _context6.next = 18;
            break;
          }
          return _context6.abrupt("return", res.error(req.i18n.t('budjetNotFound'), 404));
        case 18:
          _context6.next = 20;
          return updateOperatsiiService(_objectSpread(_objectSpread({}, data), {}, {
            id: id
          }));
        case 20:
          result = _context6.sent;
          return _context6.abrupt("return", res.success(req.i18n.t('updateSuccess'), 200, null, result));
        case 24:
          _context6.prev = 24;
          _context6.t0 = _context6["catch"](0);
          errorCatch(_context6.t0, res);
        case 27:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 24]]);
  }));
  return function updateOperatsii(_x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

// delete value
var deleteOperatsii = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var id;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          id = req.params.id;
          _context7.next = 4;
          return getByIdOperatsiiService(id, null);
        case 4:
          _context7.next = 6;
          return deleteOperatsiiService(id);
        case 6:
          return _context7.abrupt("return");
        case 10:
          _context7.prev = 10;
          _context7.t0 = _context7["catch"](0);
          errorCatch(_context7.t0, res);
        case 13:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 10]]);
  }));
  return function deleteOperatsii(_x13, _x14) {
    return _ref5.apply(this, arguments);
  };
}();

// get element by id
var getByIdOperatsii = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var result;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return getByIdOperatsiiService(req.params.id, null, true);
        case 3:
          result = _context8.sent;
          return _context8.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, null, result));
        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](0);
          errorCatch(_context8.t0, res);
        case 10:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 7]]);
  }));
  return function getByIdOperatsii(_x15, _x16) {
    return _ref6.apply(this, arguments);
  };
}();

// import to excel
var importToExcel = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var filePath, workbook, sheetName, sheet, data, _iterator, _step, rowData, test, _iterator2, _step2, _rowData, result;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          if (req.file) {
            _context9.next = 2;
            break;
          }
          return _context9.abrupt("return", next(new ErrorResponse("Fayl yuklanmadi", 400)));
        case 2:
          filePath = req.file.path;
          workbook = xlsx.readFile(filePath);
          sheetName = workbook.SheetNames[0];
          sheet = workbook.Sheets[sheetName];
          data = xlsx.utils.sheet_to_json(sheet).map(function (row) {
            var newRow = {};
            for (var key in row) {
              newRow[key.trim()] = row[key];
            }
            return newRow;
          });
          _iterator = _createForOfIteratorHelper(data);
          _context9.prev = 8;
          _iterator.s();
        case 10:
          if ((_step = _iterator.n()).done) {
            _context9.next = 19;
            break;
          }
          rowData = _step.value;
          _context9.next = 14;
          return pool.query("SELECT * FROM spravochnik_operatsii WHERE name = $1 AND type_schet = $2 AND isdeleted = false\n        ", [rowData.name, rowData.type_schet]);
        case 14:
          test = _context9.sent;
          if (!(test.rows.length > 0)) {
            _context9.next = 17;
            break;
          }
          return _context9.abrupt("return", next(new ErrorResponse("Ushbu malumot avval kiritilgan", 409)));
        case 17:
          _context9.next = 10;
          break;
        case 19:
          _context9.next = 24;
          break;
        case 21:
          _context9.prev = 21;
          _context9.t0 = _context9["catch"](8);
          _iterator.e(_context9.t0);
        case 24:
          _context9.prev = 24;
          _iterator.f();
          return _context9.finish(24);
        case 27:
          _iterator2 = _createForOfIteratorHelper(data);
          _context9.prev = 28;
          _iterator2.s();
        case 30:
          if ((_step2 = _iterator2.n()).done) {
            _context9.next = 39;
            break;
          }
          _rowData = _step2.value;
          _context9.next = 34;
          return pool.query("INSERT INTO spravochnik_operatsii(\n            name,  schet, sub_schet, type_schet\n            ) VALUES($1, $2, $3, $4) \n            RETURNING *\n        ", [_rowData.name, _rowData.schet, _rowData.sub_schet, _rowData.type_schet]);
        case 34:
          result = _context9.sent;
          if (result.rows[0]) {
            _context9.next = 37;
            break;
          }
          return _context9.abrupt("return", next(new ErrorResponse("Server xatolik. Malumot kiritilmadi", 500)));
        case 37:
          _context9.next = 30;
          break;
        case 39:
          _context9.next = 44;
          break;
        case 41:
          _context9.prev = 41;
          _context9.t1 = _context9["catch"](28);
          _iterator2.e(_context9.t1);
        case 44:
          _context9.prev = 44;
          _iterator2.f();
          return _context9.finish(44);
        case 47:
          return _context9.abrupt("return", res.status(200).json({
            success: true,
            data: "Muvaffaqiyatli kiritildi"
          }));
        case 48:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[8, 21, 24, 27], [28, 41, 44, 47]]);
  }));
  return function importToExcel(_x17, _x18) {
    return _ref7.apply(this, arguments);
  };
}();
module.exports = {
  getByIdOperatsii: getByIdOperatsii,
  createOperatsii: createOperatsii,
  getOperatsii: getOperatsii,
  deleteOperatsii: deleteOperatsii,
  updateOperatsii: updateOperatsii,
  importToExcel: importToExcel,
  getSchet: getSchet,
  Controller: Controller
};