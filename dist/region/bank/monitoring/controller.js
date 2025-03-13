"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _require = require('./service'),
  BankMonitoringService = _require.BankMonitoringService;
var _require2 = require('@main_schet/service'),
  MainSchetService = _require2.MainSchetService;
var _require3 = require('@region/service'),
  RegionService = _require3.RegionService;
var _require4 = require('@report_title/service'),
  ReportTitleService = _require4.ReportTitleService;
exports.Controller = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
        var region_id, _req$query, page, limit, main_schet_id, from, to, search, offset, main_schet, _yield$BankMonitoring, total_count, data, summa_from, summa_to, prixod_sum, rasxod_sum, page_prixod_sum, page_rasxod_sum, total_sum, page_total_sum, pageCount, meta;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              region_id = req.user.region_id;
              _req$query = req.query, page = _req$query.page, limit = _req$query.limit, main_schet_id = _req$query.main_schet_id, from = _req$query.from, to = _req$query.to, search = _req$query.search;
              offset = (page - 1) * limit;
              _context.next = 5;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 5:
              main_schet = _context.sent;
              if (main_schet) {
                _context.next = 8;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 400));
            case 8:
              _context.next = 10;
              return BankMonitoringService.get({
                region_id: region_id,
                main_schet_id: main_schet_id,
                offset: offset,
                limit: limit,
                from: from,
                to: to,
                search: search
              });
            case 10:
              _yield$BankMonitoring = _context.sent;
              total_count = _yield$BankMonitoring.total_count;
              data = _yield$BankMonitoring.data;
              summa_from = _yield$BankMonitoring.summa_from;
              summa_to = _yield$BankMonitoring.summa_to;
              prixod_sum = _yield$BankMonitoring.prixod_sum;
              rasxod_sum = _yield$BankMonitoring.rasxod_sum;
              page_prixod_sum = _yield$BankMonitoring.page_prixod_sum;
              page_rasxod_sum = _yield$BankMonitoring.page_rasxod_sum;
              total_sum = _yield$BankMonitoring.total_sum;
              page_total_sum = _yield$BankMonitoring.page_total_sum;
              pageCount = Math.ceil(total_count / limit);
              meta = _defineProperty(_defineProperty(_defineProperty(_defineProperty({
                pageCount: pageCount,
                count: total_count,
                currentPage: page,
                nextPage: page >= pageCount ? null : page + 1,
                backPage: page === 1 ? null : page - 1,
                prixod_sum: prixod_sum,
                rasxod_sum: rasxod_sum,
                total_sum: total_sum,
                summa_from: summa_from.summa,
                summa_to: summa_to.summa,
                page_prixod_sum: page_prixod_sum,
                page_rasxod_sum: page_rasxod_sum
              }, "total_sum", total_sum), "page_total_sum", page_total_sum), "summa_from_object", summa_from), "summa_to_object", summa_to);
              return _context.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, meta, data));
            case 24:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function get(_x, _x2) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
  }, {
    key: "cap",
    value: function () {
      var _cap = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
        var _req$query2, from, to, main_schet_id, excel, report_title_id, region_id, region, report_title, main_schet, data, _yield$BankMonitoring2, fileName, filePath;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _req$query2 = req.query, from = _req$query2.from, to = _req$query2.to, main_schet_id = _req$query2.main_schet_id, excel = _req$query2.excel, report_title_id = _req$query2.report_title_id;
              region_id = req.user.region_id;
              _context2.next = 4;
              return RegionService.getById({
                id: region_id
              });
            case 4:
              region = _context2.sent;
              _context2.next = 7;
              return ReportTitleService.getById({
                id: report_title_id
              });
            case 7:
              report_title = _context2.sent;
              if (report_title) {
                _context2.next = 10;
                break;
              }
              return _context2.abrupt("return", res.error(req.i18n.t('reportTitleNotFound'), 404));
            case 10:
              _context2.next = 12;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 12:
              main_schet = _context2.sent;
              if (main_schet) {
                _context2.next = 15;
                break;
              }
              return _context2.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 400));
            case 15:
              _context2.next = 17;
              return BankMonitoringService.cap({
                region_id: region_id,
                main_schet_id: main_schet_id,
                from: from,
                to: to
              });
            case 17:
              data = _context2.sent;
              if (!(excel === 'true')) {
                _context2.next = 27;
                break;
              }
              _context2.next = 21;
              return BankMonitoringService.capExcel(_objectSpread(_objectSpread({}, data), {}, {
                main_schet: main_schet,
                report_title: report_title,
                from: from,
                to: to,
                region: region
              }));
            case 21:
              _yield$BankMonitoring2 = _context2.sent;
              fileName = _yield$BankMonitoring2.fileName;
              filePath = _yield$BankMonitoring2.filePath;
              res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
              res.setHeader('Content-Disposition', "attachment; filename=\"".concat(fileName, "\""));
              return _context2.abrupt("return", res.sendFile(filePath));
            case 27:
              return _context2.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, req.query, data));
            case 28:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function cap(_x3, _x4) {
        return _cap.apply(this, arguments);
      }
      return cap;
    }()
  }, {
    key: "daily",
    value: function () {
      var _daily = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
        var _req$query3, from, to, main_schet_id, report_title_id, region_id, region, report_title, main_schet, data, _yield$BankMonitoring3, fileName, filePath;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _req$query3 = req.query, from = _req$query3.from, to = _req$query3.to, main_schet_id = _req$query3.main_schet_id, report_title_id = _req$query3.report_title_id;
              region_id = req.user.region_id;
              _context3.next = 4;
              return RegionService.getById({
                id: region_id
              });
            case 4:
              region = _context3.sent;
              _context3.next = 7;
              return ReportTitleService.getById({
                id: report_title_id
              });
            case 7:
              report_title = _context3.sent;
              if (report_title) {
                _context3.next = 10;
                break;
              }
              return _context3.abrupt("return", res.error(req.i18n.t('reportTitleNotFound'), 404));
            case 10:
              _context3.next = 12;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 12:
              main_schet = _context3.sent;
              if (main_schet) {
                _context3.next = 15;
                break;
              }
              return _context3.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 400));
            case 15:
              _context3.next = 17;
              return BankMonitoringService.daily({
                region_id: region_id,
                main_schet_id: main_schet_id,
                from: from,
                to: to
              });
            case 17:
              data = _context3.sent;
              _context3.next = 20;
              return BankMonitoringService.dailyExcel(_objectSpread(_objectSpread({}, data), {}, {
                from: from,
                region: region,
                to: to,
                main_schet: main_schet,
                report_title: report_title,
                region_id: region_id
              }));
            case 20:
              _yield$BankMonitoring3 = _context3.sent;
              fileName = _yield$BankMonitoring3.fileName;
              filePath = _yield$BankMonitoring3.filePath;
              res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
              res.setHeader('Content-Disposition', "attachment; filename=\"".concat(fileName, "\""));
              return _context3.abrupt("return", res.sendFile(filePath));
            case 26:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function daily(_x5, _x6) {
        return _daily.apply(this, arguments);
      }
      return daily;
    }()
  }]);
}();