"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
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
var _require = require('@helper/functions'),
  checkSchetsEquality = _require.checkSchetsEquality;
var _require2 = require('@main_schet/service'),
  MainSchetService = _require2.MainSchetService;
var _require3 = require('@operatsii/service'),
  OperatsiiService = _require3.OperatsiiService;
var _require4 = require('@podraz/service'),
  PodrazdelenieService = _require4.PodrazdelenieService;
var _require5 = require('@sostav/service'),
  SostavService = _require5.SostavService;
var _require6 = require('@type_operatsii/service'),
  TypeOperatsiiService = _require6.TypeOperatsiiService;
var _require7 = require('./service'),
  OrganSaldoService = _require7.OrganSaldoService;
var _require8 = require('@organization/service'),
  OrganizationService = _require8.OrganizationService;
var _require9 = require('@contract/service'),
  ContractService = _require9.ContractService;
var _require10 = require('@gazna/service'),
  GaznaService = _require10.GaznaService;
var _require11 = require('@account_number/service'),
  AccountNumberService = _require11.AccountNumberService;
exports.Controller = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "create",
    value: function () {
      var _create = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
        var main_schet_id, user_id, region_id, _req$body, childs, organ_id, contract_id, organ_account_number_id, organ_gazna_number_id, contract_grafik_id, prixod, rasxod, main_schet, organization, contract, grafik, account_number, gazna, operatsiis, _iterator, _step, child, operatsii, podraz, sostav, _operatsii, result;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              main_schet_id = req.query.main_schet_id;
              user_id = req.user.id;
              region_id = req.user.region_id;
              _req$body = req.body, childs = _req$body.childs, organ_id = _req$body.organ_id, contract_id = _req$body.contract_id, organ_account_number_id = _req$body.organ_account_number_id, organ_gazna_number_id = _req$body.organ_gazna_number_id, contract_grafik_id = _req$body.contract_grafik_id, prixod = _req$body.prixod, rasxod = _req$body.rasxod;
              if (!(prixod && rasxod || !prixod && !rasxod)) {
                _context.next = 6;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('validationError'), 400));
            case 6:
              _context.next = 8;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 8:
              main_schet = _context.sent;
              if (main_schet) {
                _context.next = 11;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 400));
            case 11:
              _context.next = 13;
              return OrganizationService.getById({
                region_id: region_id,
                id: organ_id
              });
            case 13:
              organization = _context.sent;
              if (organization) {
                _context.next = 16;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('organizationNotFound'), 404));
            case 16:
              if (!(!contract_id && contract_grafik_id)) {
                _context.next = 18;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('contractNotFound'), 404));
            case 18:
              if (!contract_id) {
                _context.next = 28;
                break;
              }
              _context.next = 21;
              return ContractService.getById({
                region_id: region_id,
                id: contract_id,
                organ_id: organ_id
              });
            case 21:
              contract = _context.sent;
              if (contract) {
                _context.next = 24;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('contractNotFound'), 404));
            case 24:
              if (!contract_grafik_id) {
                _context.next = 28;
                break;
              }
              grafik = contract.grafiks.find(function (item) {
                return item.id === contract_grafik_id;
              });
              if (grafik) {
                _context.next = 28;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('grafikNotFound'), 404));
            case 28:
              if (!organ_account_number_id) {
                _context.next = 34;
                break;
              }
              _context.next = 31;
              return AccountNumberService.getById({
                organ_id: organ_id,
                id: organ_account_number_id
              });
            case 31:
              account_number = _context.sent;
              if (account_number) {
                _context.next = 34;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('account_number_not_found'), 404));
            case 34:
              if (!organ_gazna_number_id) {
                _context.next = 40;
                break;
              }
              _context.next = 37;
              return GaznaService.getById({
                organ_id: organ_id,
                id: organ_gazna_number_id
              });
            case 37:
              gazna = _context.sent;
              if (gazna) {
                _context.next = 40;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('gazna_not_found'), 404));
            case 40:
              operatsiis = [];
              _iterator = _createForOfIteratorHelper(childs);
              _context.prev = 42;
              _iterator.s();
            case 44:
              if ((_step = _iterator.n()).done) {
                _context.next = 72;
                break;
              }
              child = _step.value;
              _context.next = 48;
              return OperatsiiService.getById({
                type: "general",
                id: child.operatsii_id
              });
            case 48:
              operatsii = _context.sent;
              if (operatsii) {
                _context.next = 51;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('operatsiiNotFound'), 404));
            case 51:
              operatsiis.push(operatsii);
              if (!child.podraz_id) {
                _context.next = 58;
                break;
              }
              _context.next = 55;
              return PodrazdelenieService.getById({
                region_id: region_id,
                id: child.podraz_id
              });
            case 55:
              podraz = _context.sent;
              if (podraz) {
                _context.next = 58;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('podrazNotFound'), 404));
            case 58:
              if (!child.sostav_id) {
                _context.next = 64;
                break;
              }
              _context.next = 61;
              return SostavService.getById({
                region_id: region_id,
                id: child.sostav_id
              });
            case 61:
              sostav = _context.sent;
              if (sostav) {
                _context.next = 64;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('sostavNotFound'), 404));
            case 64:
              if (!child.type_operatsii_id) {
                _context.next = 70;
                break;
              }
              _context.next = 67;
              return TypeOperatsiiService.getById({
                id: child.type_operatsii_id,
                region_id: region_id
              });
            case 67:
              _operatsii = _context.sent;
              if (_operatsii) {
                _context.next = 70;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('typeOperatsiiNotFound'), 404));
            case 70:
              _context.next = 44;
              break;
            case 72:
              _context.next = 77;
              break;
            case 74:
              _context.prev = 74;
              _context.t0 = _context["catch"](42);
              _iterator.e(_context.t0);
            case 77:
              _context.prev = 77;
              _iterator.f();
              return _context.finish(77);
            case 80:
              if (!checkSchetsEquality(operatsiis)) {
                res.error(req.i18n.t('schetDifferentError'), 400);
              }
              _context.next = 83;
              return OrganSaldoService.create(_objectSpread(_objectSpread({}, req.body), {}, {
                main_schet_id: main_schet_id,
                user_id: user_id
              }));
            case 83:
              result = _context.sent;
              return _context.abrupt("return", res.success(req.i18n.t('createSucccess'), 201, null, result));
            case 85:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[42, 74, 77, 80]]);
      }));
      function create(_x, _x2) {
        return _create.apply(this, arguments);
      }
      return create;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
        var region_id, _req$query, page, limit, from, to, main_schet_id, search, main_schet, offset, _yield$OrganSaldoServ, data, total_count, prixod_summa, rasxod_summa, page_prixod_summa, page_rasxod_summa, from_summa, to_summa, pageCount, meta;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              region_id = req.user.region_id;
              _req$query = req.query, page = _req$query.page, limit = _req$query.limit, from = _req$query.from, to = _req$query.to, main_schet_id = _req$query.main_schet_id, search = _req$query.search;
              _context2.next = 4;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 4:
              main_schet = _context2.sent;
              if (main_schet) {
                _context2.next = 7;
                break;
              }
              return _context2.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 400));
            case 7:
              offset = (page - 1) * limit;
              _context2.next = 10;
              return OrganSaldoService.get({
                search: search,
                region_id: region_id,
                main_schet_id: main_schet_id,
                from: from,
                to: to,
                offset: offset,
                limit: limit
              });
            case 10:
              _yield$OrganSaldoServ = _context2.sent;
              data = _yield$OrganSaldoServ.data;
              total_count = _yield$OrganSaldoServ.total_count;
              prixod_summa = _yield$OrganSaldoServ.prixod_summa;
              rasxod_summa = _yield$OrganSaldoServ.rasxod_summa;
              page_prixod_summa = _yield$OrganSaldoServ.page_prixod_summa;
              page_rasxod_summa = _yield$OrganSaldoServ.page_rasxod_summa;
              from_summa = _yield$OrganSaldoServ.from_summa;
              to_summa = _yield$OrganSaldoServ.to_summa;
              pageCount = Math.ceil(total_count / limit);
              meta = {
                pageCount: pageCount,
                count: total_count,
                currentPage: page,
                nextPage: page >= pageCount ? null : page + 1,
                backPage: page === 1 ? null : page - 1,
                prixod_summa: prixod_summa,
                rasxod_summa: rasxod_summa,
                summa: prixod_summa - rasxod_summa,
                page_prixod_summa: page_prixod_summa,
                page_rasxod_summa: page_rasxod_summa,
                from_summa: from_summa,
                to_summa: to_summa
              };
              return _context2.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, meta, data));
            case 22:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function get(_x3, _x4) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
  }, {
    key: "getById",
    value: function () {
      var _getById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
        var main_schet_id, region_id, id, main_schet, result;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              main_schet_id = req.query.main_schet_id;
              region_id = req.user.region_id;
              id = req.params.id;
              _context3.next = 5;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 5:
              main_schet = _context3.sent;
              if (main_schet) {
                _context3.next = 8;
                break;
              }
              return _context3.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 400));
            case 8:
              _context3.next = 10;
              return OrganSaldoService.getById({
                region_id: region_id,
                main_schet_id: main_schet_id,
                id: id,
                isdeleted: true
              });
            case 10:
              result = _context3.sent;
              if (result) {
                _context3.next = 13;
                break;
              }
              return _context3.abrupt("return", res.error(req.i18n.t('docNotFound'), 404));
            case 13:
              return _context3.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, null, result));
            case 14:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function getById(_x5, _x6) {
        return _getById.apply(this, arguments);
      }
      return getById;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
        var main_schet_id, user_id, region_id, id, _req$body2, childs, organ_id, contract_id, organ_account_number_id, organ_gazna_number_id, contract_grafik_id, prixod, rasxod, old_data, main_schet, organization, contract, grafik, account_number, gazna, operatsiis, _iterator2, _step2, _loop, _ret, result;
        return _regeneratorRuntime().wrap(function _callee4$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              main_schet_id = req.query.main_schet_id;
              user_id = req.user.id;
              region_id = req.user.region_id;
              id = req.params.id;
              _req$body2 = req.body, childs = _req$body2.childs, organ_id = _req$body2.organ_id, contract_id = _req$body2.contract_id, organ_account_number_id = _req$body2.organ_account_number_id, organ_gazna_number_id = _req$body2.organ_gazna_number_id, contract_grafik_id = _req$body2.contract_grafik_id, prixod = _req$body2.prixod, rasxod = _req$body2.rasxod;
              _context5.next = 7;
              return OrganSaldoService.getById({
                region_id: region_id,
                main_schet_id: main_schet_id,
                id: id,
                isdeleted: true
              });
            case 7:
              old_data = _context5.sent;
              if (old_data) {
                _context5.next = 10;
                break;
              }
              return _context5.abrupt("return", res.error(req.i18n.t('docNotFound'), 404));
            case 10:
              if (!(prixod && rasxod || !prixod && !rasxod)) {
                _context5.next = 12;
                break;
              }
              return _context5.abrupt("return", res.error(req.i18n.t('validationError'), 400));
            case 12:
              _context5.next = 14;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 14:
              main_schet = _context5.sent;
              if (main_schet) {
                _context5.next = 17;
                break;
              }
              return _context5.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 400));
            case 17:
              _context5.next = 19;
              return OrganizationService.getById({
                region_id: region_id,
                id: organ_id
              });
            case 19:
              organization = _context5.sent;
              if (organization) {
                _context5.next = 22;
                break;
              }
              return _context5.abrupt("return", res.error(req.i18n.t('organizationNotFound'), 404));
            case 22:
              if (!(!contract_id && contract_grafik_id)) {
                _context5.next = 24;
                break;
              }
              return _context5.abrupt("return", res.error(req.i18n.t('contractNotFound'), 404));
            case 24:
              if (!contract_id) {
                _context5.next = 34;
                break;
              }
              _context5.next = 27;
              return ContractService.getById({
                region_id: region_id,
                id: contract_id,
                organ_id: organ_id
              });
            case 27:
              contract = _context5.sent;
              if (contract) {
                _context5.next = 30;
                break;
              }
              return _context5.abrupt("return", res.error(req.i18n.t('contractNotFound'), 404));
            case 30:
              if (!contract_grafik_id) {
                _context5.next = 34;
                break;
              }
              grafik = contract.grafiks.find(function (item) {
                return item.id === contract_grafik_id;
              });
              if (grafik) {
                _context5.next = 34;
                break;
              }
              return _context5.abrupt("return", res.error(req.i18n.t('grafikNotFound'), 404));
            case 34:
              if (!organ_account_number_id) {
                _context5.next = 40;
                break;
              }
              _context5.next = 37;
              return AccountNumberService.getById({
                organ_id: organ_id,
                id: organ_account_number_id
              });
            case 37:
              account_number = _context5.sent;
              if (account_number) {
                _context5.next = 40;
                break;
              }
              return _context5.abrupt("return", res.error(req.i18n.t('account_number_not_found'), 404));
            case 40:
              if (!organ_gazna_number_id) {
                _context5.next = 46;
                break;
              }
              _context5.next = 43;
              return GaznaService.getById({
                organ_id: organ_id,
                id: organ_gazna_number_id
              });
            case 43:
              gazna = _context5.sent;
              if (gazna) {
                _context5.next = 46;
                break;
              }
              return _context5.abrupt("return", res.error(req.i18n.t('gazna_not_found'), 404));
            case 46:
              operatsiis = [];
              _iterator2 = _createForOfIteratorHelper(childs);
              _context5.prev = 48;
              _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
                var child, check, operatsii, podraz, sostav, _operatsii2;
                return _regeneratorRuntime().wrap(function _loop$(_context4) {
                  while (1) switch (_context4.prev = _context4.next) {
                    case 0:
                      child = _step2.value;
                      if (!child.id) {
                        _context4.next = 5;
                        break;
                      }
                      check = old_data.childs.find(function (item) {
                        return item.id === child.id;
                      });
                      if (check) {
                        _context4.next = 5;
                        break;
                      }
                      return _context4.abrupt("return", {
                        v: res.error(req.i18n.t('validationError'), 400)
                      });
                    case 5:
                      _context4.next = 7;
                      return OperatsiiService.getById({
                        type: "general",
                        id: child.operatsii_id
                      });
                    case 7:
                      operatsii = _context4.sent;
                      if (operatsii) {
                        _context4.next = 10;
                        break;
                      }
                      return _context4.abrupt("return", {
                        v: res.error(req.i18n.t('operatsiiNotFound'), 404)
                      });
                    case 10:
                      operatsiis.push(operatsii);
                      if (!child.podraz_id) {
                        _context4.next = 17;
                        break;
                      }
                      _context4.next = 14;
                      return PodrazdelenieService.getById({
                        region_id: region_id,
                        id: child.podraz_id
                      });
                    case 14:
                      podraz = _context4.sent;
                      if (podraz) {
                        _context4.next = 17;
                        break;
                      }
                      return _context4.abrupt("return", {
                        v: res.error(req.i18n.t('podrazNotFound'), 404)
                      });
                    case 17:
                      if (!child.sostav_id) {
                        _context4.next = 23;
                        break;
                      }
                      _context4.next = 20;
                      return SostavService.getById({
                        region_id: region_id,
                        id: child.sostav_id
                      });
                    case 20:
                      sostav = _context4.sent;
                      if (sostav) {
                        _context4.next = 23;
                        break;
                      }
                      return _context4.abrupt("return", {
                        v: res.error(req.i18n.t('sostavNotFound'), 404)
                      });
                    case 23:
                      if (!child.type_operatsii_id) {
                        _context4.next = 29;
                        break;
                      }
                      _context4.next = 26;
                      return TypeOperatsiiService.getById({
                        id: child.type_operatsii_id,
                        region_id: region_id
                      });
                    case 26:
                      _operatsii2 = _context4.sent;
                      if (_operatsii2) {
                        _context4.next = 29;
                        break;
                      }
                      return _context4.abrupt("return", {
                        v: res.error(req.i18n.t('typeOperatsiiNotFound'), 404)
                      });
                    case 29:
                    case "end":
                      return _context4.stop();
                  }
                }, _loop);
              });
              _iterator2.s();
            case 51:
              if ((_step2 = _iterator2.n()).done) {
                _context5.next = 58;
                break;
              }
              return _context5.delegateYield(_loop(), "t0", 53);
            case 53:
              _ret = _context5.t0;
              if (!_ret) {
                _context5.next = 56;
                break;
              }
              return _context5.abrupt("return", _ret.v);
            case 56:
              _context5.next = 51;
              break;
            case 58:
              _context5.next = 63;
              break;
            case 60:
              _context5.prev = 60;
              _context5.t1 = _context5["catch"](48);
              _iterator2.e(_context5.t1);
            case 63:
              _context5.prev = 63;
              _iterator2.f();
              return _context5.finish(63);
            case 66:
              if (!checkSchetsEquality(operatsiis)) {
                res.error(req.i18n.t('schetDifferentError'), 400);
              }
              _context5.next = 69;
              return OrganSaldoService.update(_objectSpread(_objectSpread({}, req.body), {}, {
                main_schet_id: main_schet_id,
                user_id: user_id,
                id: id,
                old_data: old_data
              }));
            case 69:
              result = _context5.sent;
              return _context5.abrupt("return", res.success(req.i18n.t('updateSuccess'), 200, null, result));
            case 71:
            case "end":
              return _context5.stop();
          }
        }, _callee4, null, [[48, 60, 63, 66]]);
      }));
      function update(_x7, _x8) {
        return _update.apply(this, arguments);
      }
      return update;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
        var main_schet_id, region_id, id, main_schet, doc, result;
        return _regeneratorRuntime().wrap(function _callee5$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              main_schet_id = req.query.main_schet_id;
              region_id = req.user.region_id;
              id = req.params.id;
              _context6.next = 5;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 5:
              main_schet = _context6.sent;
              if (main_schet) {
                _context6.next = 8;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 400));
            case 8:
              _context6.next = 10;
              return OrganSaldoService.getById({
                region_id: region_id,
                main_schet_id: main_schet_id,
                id: id
              });
            case 10:
              doc = _context6.sent;
              if (doc) {
                _context6.next = 13;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('docNotFound'), 404));
            case 13:
              _context6.next = 15;
              return OrganSaldoService["delete"]({
                id: id
              });
            case 15:
              result = _context6.sent;
              return _context6.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, null, result));
            case 17:
            case "end":
              return _context6.stop();
          }
        }, _callee5);
      }));
      function _delete(_x9, _x10) {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }()
  }]);
}();