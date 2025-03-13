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
var _require = require('./service'),
  SaldoService = _require.SaldoService;
var _require2 = require('@responsible/service'),
  ResponsibleService = _require2.ResponsibleService;
var _require3 = require('@budjet/service'),
  BudjetService = _require3.BudjetService;
var _require4 = require('@main_schet/service'),
  MainSchetService = _require4.MainSchetService;
var _require5 = require('@group/service'),
  GroupService = _require5.GroupService;
var _require6 = require('./schema'),
  SaldoSchema = _require6.SaldoSchema;
var _require7 = require('@helper/functions'),
  HelperFunctions = _require7.HelperFunctions;
var _require8 = require('@helper/constants'),
  CODE = _require8.CODE;
exports.Controller = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
        var _req$body, ids, year, month, region_id, _iterator, _step, id, check, check_doc, dates;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _req$body = req.body, ids = _req$body.ids, year = _req$body.year, month = _req$body.month;
              region_id = req.user.region_id;
              _iterator = _createForOfIteratorHelper(ids);
              _context.prev = 3;
              _iterator.s();
            case 5:
              if ((_step = _iterator.n()).done) {
                _context.next = 19;
                break;
              }
              id = _step.value;
              _context.next = 9;
              return SaldoService.getById({
                id: id.id,
                region_id: region_id
              });
            case 9:
              check = _context.sent;
              if (check) {
                _context.next = 12;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('saldoNotFound'), 404));
            case 12:
              _context.next = 14;
              return SaldoService.checkDoc({
                product_id: check.naimenovanie_tovarov_jur7_id
              });
            case 14:
              check_doc = _context.sent;
              if (!check_doc.length) {
                _context.next = 17;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('saldoRasxodError'), 400, {
                code: CODE.DOCS_HAVE.code,
                docs: check_doc,
                saldo_id: id
              }));
            case 17:
              _context.next = 5;
              break;
            case 19:
              _context.next = 24;
              break;
            case 21:
              _context.prev = 21;
              _context.t0 = _context["catch"](3);
              _iterator.e(_context.t0);
            case 24:
              _context.prev = 24;
              _iterator.f();
              return _context.finish(24);
            case 27:
              _context.next = 29;
              return SaldoService["delete"]({
                ids: ids,
                region_id: region_id,
                year: year,
                month: month
              });
            case 29:
              dates = _context.sent;
              return _context.abrupt("return", res.success(req.i18n.t('deleteSuccess'), 200, dates));
            case 31:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[3, 21, 24, 27]]);
      }));
      function _delete(_x, _x2) {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }()
  }, {
    key: "deleteById",
    value: function () {
      var _deleteById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
        var id, region_id, check, check_doc, response;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              id = req.params.id;
              region_id = req.user.region_id;
              _context2.next = 4;
              return SaldoService.getById({
                id: id,
                region_id: region_id
              });
            case 4:
              check = _context2.sent;
              if (check) {
                _context2.next = 7;
                break;
              }
              return _context2.abrupt("return", res.error(req.i18n.t('saldoNotFound'), 404));
            case 7:
              _context2.next = 9;
              return SaldoService.checkDoc({
                product_id: check.naimenovanie_tovarov_jur7_id
              });
            case 9:
              check_doc = _context2.sent;
              if (!check_doc.length) {
                _context2.next = 12;
                break;
              }
              return _context2.abrupt("return", res.error(req.i18n.t('saldoRasxodError'), 400, check_doc));
            case 12:
              _context2.next = 14;
              return SaldoService.deleteById({
                id: id
              });
            case 14:
              response = _context2.sent;
              return _context2.abrupt("return", res.success(req.i18n.t('deleteSuccess'), 200, null, response));
            case 16:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function deleteById(_x3, _x4) {
        return _deleteById.apply(this, arguments);
      }
      return deleteById;
    }()
  }, {
    key: "updateIznosSumma",
    value: function () {
      var _updateIznosSumma = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
        var id, region_id, iznos_summa, check, response;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              id = req.params.id;
              region_id = req.user.region_id;
              iznos_summa = req.body.iznos_summa;
              _context3.next = 5;
              return SaldoService.getById({
                id: id,
                region_id: region_id,
                iznos: true
              });
            case 5:
              check = _context3.sent;
              if (check) {
                _context3.next = 8;
                break;
              }
              return _context3.abrupt("return", res.error(req.i18n.t('saldoNotFound'), 404));
            case 8:
              _context3.next = 10;
              return SaldoService.updateIznosSumma({
                id: id,
                iznos_summa: iznos_summa,
                doc: check
              });
            case 10:
              response = _context3.sent;
              return _context3.abrupt("return", res.success(req.i18n.t('updateSuccess'), 200, null, response));
            case 12:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function updateIznosSumma(_x5, _x6) {
        return _updateIznosSumma.apply(this, arguments);
      }
      return updateIznosSumma;
    }()
  }, {
    key: "templateFile",
    value: function () {
      var _templateFile = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
        var _yield$HelperFunction, fileName, fileRes;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return HelperFunctions.returnTemplateFile('saldo.xlsx');
            case 2:
              _yield$HelperFunction = _context4.sent;
              fileName = _yield$HelperFunction.fileName;
              fileRes = _yield$HelperFunction.fileRes;
              res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
              res.setHeader('Content-Disposition', "attachment; filename=\"".concat(fileName, "\""));
              return _context4.abrupt("return", res.send(fileRes));
            case 8:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function templateFile(_x7, _x8) {
        return _templateFile.apply(this, arguments);
      }
      return templateFile;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
        var region_id, _req$query, kimning_buynida, page, limit, group_id, offset, responsible, _yield$GroupService$g, groups, total, pageCount, meta;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              region_id = req.user.region_id;
              _req$query = req.query, kimning_buynida = _req$query.kimning_buynida, page = _req$query.page, limit = _req$query.limit, group_id = _req$query.group_id;
              offset = (page - 1) * limit;
              if (!kimning_buynida) {
                _context5.next = 9;
                break;
              }
              _context5.next = 6;
              return ResponsibleService.getById({
                region_id: region_id,
                id: kimning_buynida
              });
            case 6:
              responsible = _context5.sent;
              if (responsible) {
                _context5.next = 9;
                break;
              }
              return _context5.abrupt("return", res.error(req.i18n.t('responsibleNotFound'), 404));
            case 9:
              _context5.next = 11;
              return GroupService.get({
                offset: 0,
                limit: 99999
              });
            case 11:
              _yield$GroupService$g = _context5.sent;
              groups = _yield$GroupService$g.data;
              total = _yield$GroupService$g.total;
              if (group_id) {
                groups = groups.filter(function (item) {
                  return item.id === group_id;
                });
                total = 1;
              }
              _context5.next = 17;
              return SaldoService.getByGroup(_objectSpread(_objectSpread({}, req.query), {}, {
                responsible_id: kimning_buynida,
                region_id: region_id,
                groups: groups,
                offset: offset
              }));
            case 17:
              groups = _context5.sent;
              groups = groups.filter(function (item) {
                return item.products.length > 0;
              });
              groups.sort(function (a, b) {
                return b.products.length - a.products.length;
              });
              pageCount = Math.ceil(total / limit);
              meta = {
                pageCount: pageCount,
                count: total,
                currentPage: page,
                nextPage: page >= pageCount ? null : page + 1,
                backPage: page === 1 ? null : page - 1
              };
              return _context5.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, meta, groups));
            case 23:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      function get(_x9, _x10) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
  }, {
    key: "import",
    value: function () {
      var _import2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
        var user_id, region_id, _req$query2, main_schet_id, budjet_id, check, budjet, main_schet, _yield$SaldoService$r, data, header, _iterator2, _step2, item, _SaldoSchema$importDa, error, value, date_saldo, _iterator3, _step3, doc, responsible, group, dates, _dates;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              if (req.file) {
                _context6.next = 2;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('fileError'), 400));
            case 2:
              user_id = req.user.id;
              region_id = req.user.region_id;
              _req$query2 = req.query, main_schet_id = _req$query2.main_schet_id, budjet_id = _req$query2.budjet_id;
              _context6.next = 7;
              return SaldoService.getFirstSaldoDate({
                region_id: region_id
              });
            case 7:
              check = _context6.sent;
              if (!check) {
                _context6.next = 10;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('saldoImportAlreadyExists'), 400));
            case 10:
              _context6.next = 12;
              return BudjetService.getById({
                id: budjet_id
              });
            case 12:
              budjet = _context6.sent;
              if (budjet) {
                _context6.next = 15;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('budjetNotFound'), 404));
            case 15:
              _context6.next = 17;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 17:
              main_schet = _context6.sent;
              if (main_schet) {
                _context6.next = 20;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 20:
              _context6.next = 22;
              return SaldoService.readFile({
                filePath: req.file.path
              });
            case 22:
              _yield$SaldoService$r = _context6.sent;
              data = _yield$SaldoService$r.result;
              header = _yield$SaldoService$r.header;
              if (data.length) {
                _context6.next = 27;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('emptyFile'), 400));
            case 27:
              _iterator2 = _createForOfIteratorHelper(data);
              _context6.prev = 28;
              _iterator2.s();
            case 30:
              if ((_step2 = _iterator2.n()).done) {
                _context6.next = 37;
                break;
              }
              item = _step2.value;
              _SaldoSchema$importDa = SaldoSchema.importData(req.i18n).validate(item), error = _SaldoSchema$importDa.error, value = _SaldoSchema$importDa.value;
              if (!error) {
                _context6.next = 35;
                break;
              }
              return _context6.abrupt("return", res.error(error.details[0].message, 400, {
                code: CODE.EXCEL_IMPORT.code,
                doc: item,
                header: header
              }));
            case 35:
              _context6.next = 30;
              break;
            case 37:
              _context6.next = 42;
              break;
            case 39:
              _context6.prev = 39;
              _context6.t0 = _context6["catch"](28);
              _iterator2.e(_context6.t0);
            case 42:
              _context6.prev = 42;
              _iterator2.f();
              return _context6.finish(42);
            case 45:
              date_saldo = HelperFunctions.checkYearMonth(data);
              if (date_saldo) {
                _context6.next = 48;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('differentSaldoDate'), 400));
            case 48:
              _iterator3 = _createForOfIteratorHelper(data);
              _context6.prev = 49;
              _iterator3.s();
            case 51:
              if ((_step3 = _iterator3.n()).done) {
                _context6.next = 75;
                break;
              }
              doc = _step3.value;
              _context6.next = 55;
              return ResponsibleService.getById({
                region_id: region_id,
                id: doc.responsible_id
              });
            case 55:
              responsible = _context6.sent;
              if (responsible) {
                _context6.next = 58;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('responsibleNotFound'), 404));
            case 58:
              _context6.next = 60;
              return GroupService.getById({
                id: doc.group_jur7_id
              });
            case 60:
              group = _context6.sent;
              if (group) {
                _context6.next = 63;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('groupNotFound'), 404));
            case 63:
              doc.date_saldo = new Date("".concat(doc.year, "-").concat(doc.month, "-01"));
              if (doc.doc_date) {
                dates = doc.doc_date.split('.');
                doc.doc_date = new Date("".concat(dates[2], "-").concat(dates[1], "-").concat(dates[0]));
              } else {
                doc.doc_date = new Date();
              }
              if (doc.iznos_start) {
                _dates = doc.iznos_start.split('.');
                doc.iznos_start = new Date("".concat(_dates[2], "-").concat(_dates[1], "-").concat(_dates[0]));
              } else {
                doc.iznos_start = new Date();
              }
              doc.doc_num = doc.doc_num ? doc.doc_num : 'saldo';
              doc.iznos = group.iznos_foiz > 0 ? true : false;
              doc.iznos_foiz = group.iznos_foiz;
              doc.iznos_schet = group.schet;
              doc.iznos_sub_schet = group.provodka_subschet;
              if (!(!doc.iznos && doc.eski_iznos_summa > 0)) {
                _context6.next = 73;
                break;
              }
              return _context6.abrupt("return", res.error("".concat(req.i18n.t('iznosSummaError')), 400, doc));
            case 73:
              _context6.next = 51;
              break;
            case 75:
              _context6.next = 80;
              break;
            case 77:
              _context6.prev = 77;
              _context6.t1 = _context6["catch"](49);
              _iterator3.e(_context6.t1);
            case 80:
              _context6.prev = 80;
              _iterator3.f();
              return _context6.finish(80);
            case 83:
              _context6.next = 85;
              return SaldoService.importData({
                docs: data,
                main_schet_id: main_schet_id,
                budjet_id: budjet_id,
                user_id: user_id,
                region_id: region_id,
                date_saldo: date_saldo
              });
            case 85:
              return _context6.abrupt("return", res.success(req.i18n.t('importSuccess'), 201));
            case 86:
            case "end":
              return _context6.stop();
          }
        }, _callee6, null, [[28, 39, 42, 45], [49, 77, 80, 83]]);
      }));
      function _import(_x11, _x12) {
        return _import2.apply(this, arguments);
      }
      return _import;
    }()
  }, {
    key: "create",
    value: function () {
      var _create = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
        var region_id, user_id, _req$query3, main_schet_id, budjet_id, _req$body2, year, month, budjet, main_schet, last_saldo, last_date, attempt, dates;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              region_id = req.user.region_id;
              user_id = req.user.id;
              _req$query3 = req.query, main_schet_id = _req$query3.main_schet_id, budjet_id = _req$query3.budjet_id;
              _req$body2 = req.body, year = _req$body2.year, month = _req$body2.month;
              _context7.next = 6;
              return BudjetService.getById({
                id: budjet_id
              });
            case 6:
              budjet = _context7.sent;
              if (budjet) {
                _context7.next = 9;
                break;
              }
              return _context7.abrupt("return", res.error(req.i18n.t('budjetNotFound'), 404));
            case 9:
              _context7.next = 11;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 11:
              main_schet = _context7.sent;
              if (main_schet) {
                _context7.next = 14;
                break;
              }
              return _context7.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 14:
              attempt = 0;
            case 15:
              if (!(attempt < 1000)) {
                _context7.next = 27;
                break;
              }
              last_date = HelperFunctions.lastDate({
                year: year,
                month: month
              });
              _context7.next = 19;
              return SaldoService.lastSaldo({
                region_id: region_id,
                year: last_date.year,
                month: last_date.month
              });
            case 19:
              last_saldo = _context7.sent;
              if (!(last_saldo.length > 0)) {
                _context7.next = 22;
                break;
              }
              return _context7.abrupt("break", 27);
            case 22:
              year = last_date.year;
              month = last_date.month;
              attempt++;
              _context7.next = 15;
              break;
            case 27:
              if (last_saldo.length) {
                _context7.next = 31;
                break;
              }
              _context7.next = 30;
              return SaldoService.cleanData({
                region_id: region_id
              });
            case 30:
              return _context7.abrupt("return", res.success(req.i18n.t('celanSaldo'), 200));
            case 31:
              _context7.next = 33;
              return SaldoService.create(_objectSpread(_objectSpread({
                region_id: region_id,
                user_id: user_id
              }, req.body), {}, {
                last_saldo: last_saldo,
                last_date: last_date,
                budjet_id: budjet_id
              }));
            case 33:
              dates = _context7.sent;
              return _context7.abrupt("return", res.success(req.i18n.t('createSuccess'), 200, {
                code: dates.length ? CODE.SALDO_CREATE.code : CODE.OK.code,
                dates: dates
              }));
            case 35:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      }));
      function create(_x13, _x14) {
        return _create.apply(this, arguments);
      }
      return create;
    }()
  }, {
    key: "check",
    value: function () {
      var _check = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
        var region_id, _yield$SaldoService$c, meta, response;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              region_id = req.user.region_id;
              _context8.next = 3;
              return SaldoService.check(_objectSpread({
                region_id: region_id
              }, req.query));
            case 3:
              _yield$SaldoService$c = _context8.sent;
              meta = _yield$SaldoService$c.meta;
              response = _yield$SaldoService$c.result;
              return _context8.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, meta, response));
            case 7:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      }));
      function check(_x15, _x16) {
        return _check.apply(this, arguments);
      }
      return check;
    }()
  }, {
    key: "getById",
    value: function () {
      var _getById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
        var id, region_id, response;
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              id = req.params.id;
              region_id = req.user.region_id;
              _context9.next = 4;
              return SaldoService.getById({
                region_id: region_id,
                id: id,
                isdeleted: true
              });
            case 4:
              response = _context9.sent;
              return _context9.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, null, response));
            case 6:
            case "end":
              return _context9.stop();
          }
        }, _callee9);
      }));
      function getById(_x17, _x18) {
        return _getById.apply(this, arguments);
      }
      return getById;
    }()
  }]);
}();