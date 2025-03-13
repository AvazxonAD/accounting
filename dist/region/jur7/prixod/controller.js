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
var _require = require('@contract/service'),
  ContractService = _require.ContractService;
var _require2 = require('@group/service'),
  GroupService = _require2.GroupService;
var _require3 = require('./service'),
  PrixodJur7Service = _require3.PrixodJur7Service;
var _require4 = require('@main_schet/service'),
  MainSchetService = _require4.MainSchetService;
var _require5 = require('@organization/service'),
  OrganizationService = _require5.OrganizationService;
var _require6 = require('@budjet/service'),
  BudjetService = _require6.BudjetService;
var _require7 = require('@responsible/service'),
  ResponsibleService = _require7.ResponsibleService;
var _require8 = require('@gazna/service'),
  GaznaService = _require8.GaznaService;
var _require9 = require('@account_number/service'),
  AccountNumberService = _require9.AccountNumberService;
var _require10 = require('@helper/functions'),
  HelperFunctions = _require10.HelperFunctions;
var _require11 = require('@helper/constants'),
  CODE = _require11.CODE;
var _require12 = require('./schema'),
  PrixodJur7Schema = _require12.PrixodJur7Schema;
exports.Controller = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "rasxodDocs",
    value: function () {
      var _rasxodDocs = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
        var id, productIds, result, _iterator, _step, _id;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              id = req.params.id;
              _context.next = 3;
              return PrixodJur7Service.getProductIds({
                id: id
              });
            case 3:
              productIds = _context.sent;
              result = [];
              _iterator = _createForOfIteratorHelper(productIds);
              _context.prev = 6;
              _iterator.s();
            case 8:
              if ((_step = _iterator.n()).done) {
                _context.next = 17;
                break;
              }
              _id = _step.value;
              _context.t0 = result;
              _context.next = 13;
              return PrixodJur7Service.checkPrixodDoc({
                product_id: _id
              });
            case 13:
              _context.t1 = _context.sent;
              _context.t0.push.call(_context.t0, _context.t1);
            case 15:
              _context.next = 8;
              break;
            case 17:
              _context.next = 22;
              break;
            case 19:
              _context.prev = 19;
              _context.t2 = _context["catch"](6);
              _iterator.e(_context.t2);
            case 22:
              _context.prev = 22;
              _iterator.f();
              return _context.finish(22);
            case 25:
              return _context.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, null, result));
            case 26:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[6, 19, 22, 25]]);
      }));
      function rasxodDocs(_x, _x2) {
        return _rasxodDocs.apply(this, arguments);
      }
      return rasxodDocs;
    }()
  }, {
    key: "templateImport",
    value: function () {
      var _templateImport = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
        var _yield$HelperFunction, fileName, fileRes;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return HelperFunctions.returnTemplateFile('prixod.xlsx', req.i18n);
            case 2:
              _yield$HelperFunction = _context2.sent;
              fileName = _yield$HelperFunction.fileName;
              fileRes = _yield$HelperFunction.fileRes;
              res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
              res.setHeader('Content-Disposition', "attachment; filename=\"".concat(fileName, "\""));
              return _context2.abrupt("return", res.send(fileRes));
            case 8:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function templateImport(_x3, _x4) {
        return _templateImport.apply(this, arguments);
      }
      return templateImport;
    }()
  }, {
    key: "readFile",
    value: function () {
      var _readFile = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
        var filePath, _yield$HelperFunction2, data, header, _iterator2, _step2, item, _PrixodJur7Schema$imp, error, _iterator3, _step3, _item;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              filePath = req.file.path;
              _context3.next = 3;
              return HelperFunctions.readFile(filePath);
            case 3:
              _yield$HelperFunction2 = _context3.sent;
              data = _yield$HelperFunction2.result;
              header = _yield$HelperFunction2.header;
              _iterator2 = _createForOfIteratorHelper(data);
              _context3.prev = 7;
              _iterator2.s();
            case 9:
              if ((_step2 = _iterator2.n()).done) {
                _context3.next = 16;
                break;
              }
              item = _step2.value;
              _PrixodJur7Schema$imp = PrixodJur7Schema["import"](req.i18n).validate(item), error = _PrixodJur7Schema$imp.error;
              if (!error) {
                _context3.next = 14;
                break;
              }
              return _context3.abrupt("return", res.error(error.details[0].message, 400, {
                code: CODE.EXCEL_IMPORT.code,
                doc: item,
                header: header
              }));
            case 14:
              _context3.next = 9;
              break;
            case 16:
              _context3.next = 21;
              break;
            case 18:
              _context3.prev = 18;
              _context3.t0 = _context3["catch"](7);
              _iterator2.e(_context3.t0);
            case 21:
              _context3.prev = 21;
              _iterator2.f();
              return _context3.finish(21);
            case 24:
              _iterator3 = _createForOfIteratorHelper(data);
              _context3.prev = 25;
              _iterator3.s();
            case 27:
              if ((_step3 = _iterator3.n()).done) {
                _context3.next = 43;
                break;
              }
              _item = _step3.value;
              _item.iznos = _item.iznos === 'ha' ? true : false;
              _item.nds_summa = _item.nds_foiz ? _item.nds_foiz / 100 * _item.summa : 0;
              _item.summa_s_nds = _item.summa + _item.nds_summa;
              _context3.next = 34;
              return GroupService.getById({
                id: _item.group_jur7_id
              });
            case 34:
              _item.group = _context3.sent;
              _item.iznos = _item.group.iznos_foiz > 0 ? true : false;
              _item.iznos_schet = _item.group.schet;
              _item.iznos_sub_schet = _item.group.provodka_subschet;
              if (!(!_item.iznos && _item.eski_iznos_summa)) {
                _context3.next = 40;
                break;
              }
              return _context3.abrupt("return", res.error(req.i18n.t('IznosSummaError'), 400, _item));
            case 40:
              _item.sena = _item.summa / _item.kol;
            case 41:
              _context3.next = 27;
              break;
            case 43:
              _context3.next = 48;
              break;
            case 45:
              _context3.prev = 45;
              _context3.t1 = _context3["catch"](25);
              _iterator3.e(_context3.t1);
            case 48:
              _context3.prev = 48;
              _iterator3.f();
              return _context3.finish(48);
            case 51:
              return _context3.abrupt("return", res.success(req.i18n.t('readFileSuccess'), 200, null, data));
            case 52:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[7, 18, 21, 24], [25, 45, 48, 51]]);
      }));
      function readFile(_x5, _x6) {
        return _readFile.apply(this, arguments);
      }
      return readFile;
    }()
  }, {
    key: "create",
    value: function () {
      var _create = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
        var region_id, user_id, _req$query, main_schet_id, budjet_id, _req$body, kimdan_id, kimga_id, id_shartnomalar_organization, childs, shartnoma_grafik_id, organization_by_raschet_schet_id, organization_by_raschet_schet_gazna_id, budjet, main_schet, organization, responsible, contract, grafik, account_number, gazna, _iterator4, _step4, child, result;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              region_id = req.user.region_id;
              user_id = req.user.id;
              _req$query = req.query, main_schet_id = _req$query.main_schet_id, budjet_id = _req$query.budjet_id;
              _req$body = req.body, kimdan_id = _req$body.kimdan_id, kimga_id = _req$body.kimga_id, id_shartnomalar_organization = _req$body.id_shartnomalar_organization, childs = _req$body.childs, shartnoma_grafik_id = _req$body.shartnoma_grafik_id, organization_by_raschet_schet_id = _req$body.organization_by_raschet_schet_id, organization_by_raschet_schet_gazna_id = _req$body.organization_by_raschet_schet_gazna_id;
              _context4.next = 6;
              return BudjetService.getById({
                id: budjet_id
              });
            case 6:
              budjet = _context4.sent;
              if (budjet) {
                _context4.next = 9;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('budjetNotFound'), 404));
            case 9:
              _context4.next = 11;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 11:
              main_schet = _context4.sent;
              if (main_schet) {
                _context4.next = 14;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 14:
              _context4.next = 16;
              return OrganizationService.getById({
                region_id: region_id,
                id: kimdan_id
              });
            case 16:
              organization = _context4.sent;
              if (organization) {
                _context4.next = 19;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('organizationNotFound'), 404));
            case 19:
              _context4.next = 21;
              return ResponsibleService.getById({
                region_id: region_id,
                id: kimga_id
              });
            case 21:
              responsible = _context4.sent;
              if (responsible) {
                _context4.next = 24;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('responsibleNotFound'), 404));
            case 24:
              if (!id_shartnomalar_organization) {
                _context4.next = 34;
                break;
              }
              _context4.next = 27;
              return ContractService.getById({
                region_id: region_id,
                id: id_shartnomalar_organization
              });
            case 27:
              contract = _context4.sent;
              if (contract) {
                _context4.next = 30;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('contractNotFound'), 404));
            case 30:
              if (!shartnoma_grafik_id) {
                _context4.next = 34;
                break;
              }
              grafik = contract.grafiks.find(function (item) {
                return item.id === shartnoma_grafik_id;
              });
              if (grafik) {
                _context4.next = 34;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('grafikNotFound'), 404));
            case 34:
              if (!organization_by_raschet_schet_id) {
                _context4.next = 40;
                break;
              }
              _context4.next = 37;
              return AccountNumberService.getById({
                organ_id: kimdan_id,
                id: organization_by_raschet_schet_id
              });
            case 37:
              account_number = _context4.sent;
              if (account_number) {
                _context4.next = 40;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('account_number_not_found'), 404));
            case 40:
              if (!organization_by_raschet_schet_gazna_id) {
                _context4.next = 46;
                break;
              }
              _context4.next = 43;
              return GaznaService.getById({
                organ_id: kimdan_id,
                id: organization_by_raschet_schet_gazna_id
              });
            case 43:
              gazna = _context4.sent;
              if (gazna) {
                _context4.next = 46;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('gazna_not_found'), 404));
            case 46:
              _iterator4 = _createForOfIteratorHelper(childs);
              _context4.prev = 47;
              _iterator4.s();
            case 49:
              if ((_step4 = _iterator4.n()).done) {
                _context4.next = 61;
                break;
              }
              child = _step4.value;
              _context4.next = 53;
              return GroupService.getById({
                id: child.group_jur7_id
              });
            case 53:
              child.group = _context4.sent;
              if (child.group) {
                _context4.next = 56;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('groupNotFound'), 404));
            case 56:
              if (!(!child.iznos && child.eski_iznos_summa || child.iznos && !child.group.iznos_foiz)) {
                _context4.next = 58;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('IznosSummaError'), 400, child));
            case 58:
              child.old_iznos = child.eski_iznos_summa / child.kol;
            case 59:
              _context4.next = 49;
              break;
            case 61:
              _context4.next = 66;
              break;
            case 63:
              _context4.prev = 63;
              _context4.t0 = _context4["catch"](47);
              _iterator4.e(_context4.t0);
            case 66:
              _context4.prev = 66;
              _iterator4.f();
              return _context4.finish(66);
            case 69:
              _context4.next = 71;
              return PrixodJur7Service.create(_objectSpread(_objectSpread({}, req.body), {}, {
                user_id: user_id,
                main_schet_id: main_schet_id,
                budjet_id: budjet_id,
                childs: childs,
                region_id: region_id
              }));
            case 71:
              result = _context4.sent;
              return _context4.abrupt("return", res.success(req.i18n.t('createSuccess'), 200, result.dates, result.doc));
            case 73:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[47, 63, 66, 69]]);
      }));
      function create(_x7, _x8) {
        return _create.apply(this, arguments);
      }
      return create;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
        var region_id, _req$query2, page, limit, search, from, to, main_schet_id, main_schet, offset, _yield$PrixodJur7Serv, data, total, pageCount, meta;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              region_id = req.user.region_id;
              _req$query2 = req.query, page = _req$query2.page, limit = _req$query2.limit, search = _req$query2.search, from = _req$query2.from, to = _req$query2.to, main_schet_id = _req$query2.main_schet_id;
              _context5.next = 4;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 4:
              main_schet = _context5.sent;
              if (main_schet) {
                _context5.next = 7;
                break;
              }
              return _context5.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 7:
              offset = (page - 1) * limit;
              _context5.next = 10;
              return PrixodJur7Service.get({
                search: search,
                region_id: region_id,
                from: from,
                to: to,
                main_schet_id: main_schet_id,
                offset: offset,
                limit: limit
              });
            case 10:
              _yield$PrixodJur7Serv = _context5.sent;
              data = _yield$PrixodJur7Serv.data;
              total = _yield$PrixodJur7Serv.total;
              pageCount = Math.ceil(total / limit);
              meta = {
                pageCount: pageCount,
                count: total,
                currentPage: page,
                nextPage: page >= pageCount ? null : page + 1,
                backPage: page === 1 ? null : page - 1
              };
              return _context5.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, meta, data || []));
            case 16:
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
    key: "getById",
    value: function () {
      var _getById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
        var region_id, id, main_schet_id, main_schet, data;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              region_id = req.user.region_id;
              id = req.params.id;
              main_schet_id = req.query.main_schet_id;
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
              return _context6.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 8:
              _context6.next = 10;
              return PrixodJur7Service.getById({
                region_id: region_id,
                id: id,
                main_schet_id: main_schet_id,
                isdeleted: true
              });
            case 10:
              data = _context6.sent;
              if (data) {
                _context6.next = 13;
                break;
              }
              return _context6.abrupt("return", res.error(req.i18n.t('docNotFound'), 404));
            case 13:
              return _context6.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, null, data));
            case 14:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      function getById(_x11, _x12) {
        return _getById.apply(this, arguments);
      }
      return getById;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
        var region_id, id, user_id, _req$query3, main_schet_id, budjet_id, _req$body2, kimdan_id, kimga_id, id_shartnomalar_organization, childs, shartnoma_grafik_id, organization_by_raschet_schet_id, organization_by_raschet_schet_gazna_id, budjet, main_schet, old_data, productIds, _iterator5, _step5, _id2, check, responsible, organization, contract, grafik, account_number, gazna, _iterator6, _step6, child, result;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              region_id = req.user.region_id;
              id = req.params.id;
              user_id = req.user.id;
              _req$query3 = req.query, main_schet_id = _req$query3.main_schet_id, budjet_id = _req$query3.budjet_id;
              _req$body2 = req.body, kimdan_id = _req$body2.kimdan_id, kimga_id = _req$body2.kimga_id, id_shartnomalar_organization = _req$body2.id_shartnomalar_organization, childs = _req$body2.childs, shartnoma_grafik_id = _req$body2.shartnoma_grafik_id, organization_by_raschet_schet_id = _req$body2.organization_by_raschet_schet_id, organization_by_raschet_schet_gazna_id = _req$body2.organization_by_raschet_schet_gazna_id;
              _context7.next = 7;
              return BudjetService.getById({
                id: budjet_id
              });
            case 7:
              budjet = _context7.sent;
              if (budjet) {
                _context7.next = 10;
                break;
              }
              return _context7.abrupt("return", res.error(req.i18n.t('budjetNotFound'), 404));
            case 10:
              _context7.next = 12;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 12:
              main_schet = _context7.sent;
              if (main_schet) {
                _context7.next = 15;
                break;
              }
              return _context7.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 15:
              _context7.next = 17;
              return PrixodJur7Service.getById({
                region_id: region_id,
                id: id,
                main_schet_id: main_schet_id,
                isdeleted: true
              });
            case 17:
              old_data = _context7.sent;
              if (old_data) {
                _context7.next = 20;
                break;
              }
              return _context7.abrupt("return", res.error(req.i18n.t('docNotFound'), 404));
            case 20:
              _context7.next = 22;
              return PrixodJur7Service.getProductIds({
                id: id
              });
            case 22:
              productIds = _context7.sent;
              _iterator5 = _createForOfIteratorHelper(productIds);
              _context7.prev = 24;
              _iterator5.s();
            case 26:
              if ((_step5 = _iterator5.n()).done) {
                _context7.next = 35;
                break;
              }
              _id2 = _step5.value;
              _context7.next = 30;
              return PrixodJur7Service.checkPrixodDoc({
                product_id: _id2
              });
            case 30:
              check = _context7.sent;
              if (!check.length) {
                _context7.next = 33;
                break;
              }
              return _context7.abrupt("return", res.error(req.i18n.t('rasxodProductError'), 409, {
                code: CODE.DOCS_HAVE.code,
                docs: check
              }));
            case 33:
              _context7.next = 26;
              break;
            case 35:
              _context7.next = 40;
              break;
            case 37:
              _context7.prev = 37;
              _context7.t0 = _context7["catch"](24);
              _iterator5.e(_context7.t0);
            case 40:
              _context7.prev = 40;
              _iterator5.f();
              return _context7.finish(40);
            case 43:
              _context7.next = 45;
              return ResponsibleService.getById({
                region_id: region_id,
                id: kimga_id
              });
            case 45:
              responsible = _context7.sent;
              if (responsible) {
                _context7.next = 48;
                break;
              }
              return _context7.abrupt("return", res.error(req.i18n.t('responsibleNotFound'), 404));
            case 48:
              _context7.next = 50;
              return OrganizationService.getById({
                region_id: region_id,
                id: kimdan_id
              });
            case 50:
              organization = _context7.sent;
              if (organization) {
                _context7.next = 53;
                break;
              }
              return _context7.abrupt("return", res.error(req.i18n.t('organizationNotFound'), 404));
            case 53:
              if (!id_shartnomalar_organization) {
                _context7.next = 63;
                break;
              }
              _context7.next = 56;
              return ContractService.getById({
                region_id: region_id,
                id: id_shartnomalar_organization
              });
            case 56:
              contract = _context7.sent;
              if (contract) {
                _context7.next = 59;
                break;
              }
              return _context7.abrupt("return", res.error(req.i18n.t('contractNotFound'), 404));
            case 59:
              if (!shartnoma_grafik_id) {
                _context7.next = 63;
                break;
              }
              grafik = contract.grafiks.find(function (item) {
                return item.id === shartnoma_grafik_id;
              });
              if (grafik) {
                _context7.next = 63;
                break;
              }
              return _context7.abrupt("return", res.error(req.i18n.t('grafikNotFound'), 404));
            case 63:
              if (!organization_by_raschet_schet_id) {
                _context7.next = 69;
                break;
              }
              _context7.next = 66;
              return AccountNumberService.getById({
                organ_id: kimdan_id,
                id: organization_by_raschet_schet_id
              });
            case 66:
              account_number = _context7.sent;
              if (account_number) {
                _context7.next = 69;
                break;
              }
              return _context7.abrupt("return", res.error(req.i18n.t('account_number_not_found'), 404));
            case 69:
              if (!organization_by_raschet_schet_gazna_id) {
                _context7.next = 75;
                break;
              }
              _context7.next = 72;
              return GaznaService.getById({
                organ_id: kimdan_id,
                id: organization_by_raschet_schet_gazna_id
              });
            case 72:
              gazna = _context7.sent;
              if (gazna) {
                _context7.next = 75;
                break;
              }
              return _context7.abrupt("return", res.error(req.i18n.t('gazna_not_found'), 404));
            case 75:
              _iterator6 = _createForOfIteratorHelper(childs);
              _context7.prev = 76;
              _iterator6.s();
            case 78:
              if ((_step6 = _iterator6.n()).done) {
                _context7.next = 90;
                break;
              }
              child = _step6.value;
              _context7.next = 82;
              return GroupService.getById({
                id: child.group_jur7_id
              });
            case 82:
              child.group = _context7.sent;
              if (child.group) {
                _context7.next = 85;
                break;
              }
              return _context7.abrupt("return", res.error(req.i18n.t('groupNotFound'), 404));
            case 85:
              if (!(!child.iznos && child.eski_iznos_summa || child.iznos && !child.group.iznos_foiz)) {
                _context7.next = 87;
                break;
              }
              return _context7.abrupt("return", res.error(req.i18n.t('IznosSummaError'), 400, child));
            case 87:
              child.old_iznos = child.eski_iznos_summa / child.kol;
            case 88:
              _context7.next = 78;
              break;
            case 90:
              _context7.next = 95;
              break;
            case 92:
              _context7.prev = 92;
              _context7.t1 = _context7["catch"](76);
              _iterator6.e(_context7.t1);
            case 95:
              _context7.prev = 95;
              _iterator6.f();
              return _context7.finish(95);
            case 98:
              _context7.next = 100;
              return PrixodJur7Service.update(_objectSpread(_objectSpread({}, req.body), {}, {
                budjet_id: budjet_id,
                main_schet_id: main_schet_id,
                user_id: user_id,
                id: id,
                childs: childs,
                old_data: old_data,
                region_id: region_id
              }));
            case 100:
              result = _context7.sent;
              return _context7.abrupt("return", res.success(req.i18n.t('updateSuccess'), 200, result.dates, result.doc));
            case 102:
            case "end":
              return _context7.stop();
          }
        }, _callee7, null, [[24, 37, 40, 43], [76, 92, 95, 98]]);
      }));
      function update(_x13, _x14) {
        return _update.apply(this, arguments);
      }
      return update;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
        var region_id, id, main_schet_id, main_schet, old_data, productIds, _iterator7, _step7, _id3, check, result;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              region_id = req.user.region_id;
              id = req.params.id;
              main_schet_id = req.query.main_schet_id;
              _context8.next = 5;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 5:
              main_schet = _context8.sent;
              if (main_schet) {
                _context8.next = 8;
                break;
              }
              return _context8.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 8:
              _context8.next = 10;
              return PrixodJur7Service.getById({
                region_id: region_id,
                id: id,
                main_schet_id: main_schet_id
              });
            case 10:
              old_data = _context8.sent;
              if (old_data) {
                _context8.next = 13;
                break;
              }
              return _context8.abrupt("return", res.error(req.i18n.t('docNotFound'), 404));
            case 13:
              _context8.next = 15;
              return PrixodJur7Service.getProductIds({
                id: id
              });
            case 15:
              productIds = _context8.sent;
              _iterator7 = _createForOfIteratorHelper(productIds);
              _context8.prev = 17;
              _iterator7.s();
            case 19:
              if ((_step7 = _iterator7.n()).done) {
                _context8.next = 28;
                break;
              }
              _id3 = _step7.value;
              _context8.next = 23;
              return PrixodJur7Service.checkPrixodDoc({
                product_id: _id3
              });
            case 23:
              check = _context8.sent;
              if (!check.length) {
                _context8.next = 26;
                break;
              }
              return _context8.abrupt("return", res.error(req.i18n.t('rasxodProductError'), 409, {
                code: CODE.DOCS_HAVE.code,
                docs: check
              }));
            case 26:
              _context8.next = 19;
              break;
            case 28:
              _context8.next = 33;
              break;
            case 30:
              _context8.prev = 30;
              _context8.t0 = _context8["catch"](17);
              _iterator7.e(_context8.t0);
            case 33:
              _context8.prev = 33;
              _iterator7.f();
              return _context8.finish(33);
            case 36:
              _context8.next = 38;
              return PrixodJur7Service.deleteDoc({
                id: id,
                region_id: region_id,
                old_data: old_data
              });
            case 38:
              result = _context8.sent;
              return _context8.abrupt("return", res.success(req.i18n.t('deleteSuccess'), 200, result.dates, result.doc));
            case 40:
            case "end":
              return _context8.stop();
          }
        }, _callee8, null, [[17, 30, 33, 36]]);
      }));
      function _delete(_x15, _x16) {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }()
  }, {
    key: "getPrixodReport",
    value: function () {
      var _getPrixodReport = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
        var region_id, _req$query4, from, to, main_schet_id, main_schet, _yield$PrixodJur7Serv2, fileName, filePath;
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              region_id = req.user.region_id;
              _req$query4 = req.query, from = _req$query4.from, to = _req$query4.to, main_schet_id = _req$query4.main_schet_id;
              _context9.next = 4;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 4:
              main_schet = _context9.sent;
              if (main_schet) {
                _context9.next = 7;
                break;
              }
              return _context9.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 7:
              _context9.next = 9;
              return PrixodJur7Service.prixodReport({
                main_schet_id: main_schet_id,
                region_id: region_id,
                from: from,
                to: to
              });
            case 9:
              _yield$PrixodJur7Serv2 = _context9.sent;
              fileName = _yield$PrixodJur7Serv2.fileName;
              filePath = _yield$PrixodJur7Serv2.filePath;
              res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
              res.setHeader('Content-Disposition', "attachment; filename=\"".concat(fileName, "\""));
              return _context9.abrupt("return", res.sendFile(filePath));
            case 15:
            case "end":
              return _context9.stop();
          }
        }, _callee9);
      }));
      function getPrixodReport(_x17, _x18) {
        return _getPrixodReport.apply(this, arguments);
      }
      return getPrixodReport;
    }()
  }]);
}();