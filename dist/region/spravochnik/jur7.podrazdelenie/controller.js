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
  PodrazdelenieDB = _require.PodrazdelenieDB;
var _require2 = require('@helper/functions'),
  tashkentTime = _require2.tashkentTime;
exports.Controller = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "importData",
    value: function () {
      var _importData = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
        var region_id, user_id, filePath, _req$query, budjet_id, main_schet_id, budjet, main_schet, data, _PrixodJur7Schema$imp, error, value, result_data, _iterator, _step, doc, organization, responsible, _iterator2, _step2, child, group;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              region_id = req.user.region_id;
              user_id = req.user.id;
              filePath = req.file.path;
              _req$query = req.query, budjet_id = _req$query.budjet_id, main_schet_id = _req$query.main_schet_id;
              _context.next = 6;
              return BudjetService.getById({
                id: budjet_id
              });
            case 6:
              budjet = _context.sent;
              if (budjet) {
                _context.next = 9;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('budjetNotFound'), 404));
            case 9:
              _context.next = 11;
              return MainSchetService.getById({
                region_id: region_id,
                id: main_schet_id
              });
            case 11:
              main_schet = _context.sent;
              if (main_schet) {
                _context.next = 14;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('mainSchetNotFound'), 404));
            case 14:
              _context.next = 16;
              return PrixodJur7Service.readFile({
                filePath: filePath
              });
            case 16:
              data = _context.sent;
              _PrixodJur7Schema$imp = PrixodJur7Schema["import"](req.i18n).validate(data), error = _PrixodJur7Schema$imp.error, value = _PrixodJur7Schema$imp.value;
              if (!error) {
                _context.next = 20;
                break;
              }
              return _context.abrupt("return", res.error(error.details[0].message, 400));
            case 20:
              result_data = PrixodJur7Service.groupData(value);
              _iterator = _createForOfIteratorHelper(result_data);
              _context.prev = 22;
              _iterator.s();
            case 24:
              if ((_step = _iterator.n()).done) {
                _context.next = 61;
                break;
              }
              doc = _step.value;
              _context.next = 28;
              return OrganizationService.getById({
                region_id: region_id,
                id: doc.kimdan_id
              });
            case 28:
              organization = _context.sent;
              if (organization) {
                _context.next = 31;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('organizationNotFound'), 404));
            case 31:
              _context.next = 33;
              return ResponsibleService.getById({
                region_id: region_id,
                id: doc.kimga_id
              });
            case 33:
              responsible = _context.sent;
              if (responsible) {
                _context.next = 36;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('responsibleNotFound'), 404));
            case 36:
              _iterator2 = _createForOfIteratorHelper(doc.childs);
              _context.prev = 37;
              _iterator2.s();
            case 39:
              if ((_step2 = _iterator2.n()).done) {
                _context.next = 51;
                break;
              }
              child = _step2.value;
              _context.next = 43;
              return GroupService.getById({
                id: child.group_jur7_id
              });
            case 43:
              group = _context.sent;
              if (group) {
                _context.next = 46;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('groupNotFound'), 404));
            case 46:
              if (!(!child.iznos && child.eski_iznos_summa > 0)) {
                _context.next = 48;
                break;
              }
              return _context.abrupt("return", res.error("".concat(req.i18n.t('iznosSummaError')), 400));
            case 48:
              child.iznos_foiz = group.iznos_foiz;
            case 49:
              _context.next = 39;
              break;
            case 51:
              _context.next = 56;
              break;
            case 53:
              _context.prev = 53;
              _context.t0 = _context["catch"](37);
              _iterator2.e(_context.t0);
            case 56:
              _context.prev = 56;
              _iterator2.f();
              return _context.finish(56);
            case 59:
              _context.next = 24;
              break;
            case 61:
              _context.next = 66;
              break;
            case 63:
              _context.prev = 63;
              _context.t1 = _context["catch"](22);
              _iterator.e(_context.t1);
            case 66:
              _context.prev = 66;
              _iterator.f();
              return _context.finish(66);
            case 69:
              _context.next = 71;
              return PrixodJur7Service.importData({
                data: result_data,
                user_id: user_id,
                budjet_id: budjet_id,
                main_schet_id: main_schet_id,
                region_id: region_id
              });
            case 71:
              return _context.abrupt("return", res.success(req.i18n.t('createSuccess'), 201));
            case 72:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[22, 63, 66, 69], [37, 53, 56, 59]]);
      }));
      function importData(_x, _x2) {
        return _importData.apply(this, arguments);
      }
      return importData;
    }()
  }, {
    key: "createPodrazdelenie",
    value: function () {
      var _createPodrazdelenie = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
        var user_id, name, region_id, check, result;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              user_id = req.user.id;
              name = req.body.name;
              region_id = req.user.region_id;
              _context2.next = 5;
              return PodrazdelenieDB.getByNamePodrazdelenie([region_id, name]);
            case 5:
              check = _context2.sent;
              if (!check) {
                _context2.next = 8;
                break;
              }
              return _context2.abrupt("return", res.status(409).json({
                message: "this data already exists"
              }));
            case 8:
              _context2.next = 10;
              return PodrazdelenieDB.createPodrazdelenie([user_id, name, tashkentTime(), tashkentTime()]);
            case 10:
              result = _context2.sent;
              return _context2.abrupt("return", res.status(201).json({
                message: "Create podrazdelenie successfully",
                data: result
              }));
            case 12:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function createPodrazdelenie(_x3, _x4) {
        return _createPodrazdelenie.apply(this, arguments);
      }
      return createPodrazdelenie;
    }()
  }, {
    key: "getPodrazdelenie",
    value: function () {
      var _getPodrazdelenie = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
        var region_id, _req$query2, page, limit, search, offset, _yield$PodrazdelenieD, data, total, pageCount, meta;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              region_id = req.user.region_id;
              _req$query2 = req.query, page = _req$query2.page, limit = _req$query2.limit, search = _req$query2.search;
              offset = (page - 1) * limit;
              _context3.next = 5;
              return PodrazdelenieDB.getPodrazdelenie([region_id, offset, limit], search);
            case 5:
              _yield$PodrazdelenieD = _context3.sent;
              data = _yield$PodrazdelenieD.data;
              total = _yield$PodrazdelenieD.total;
              pageCount = Math.ceil(total / limit);
              meta = {
                pageCount: pageCount,
                count: total,
                currentPage: page,
                nextPage: page >= pageCount ? null : page + 1,
                backPage: page === 1 ? null : page - 1
              };
              return _context3.abrupt("return", res.status(200).json({
                message: "podrazdelenie successfully get",
                meta: meta,
                data: data || []
              }));
            case 11:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function getPodrazdelenie(_x5, _x6) {
        return _getPodrazdelenie.apply(this, arguments);
      }
      return getPodrazdelenie;
    }()
  }, {
    key: "getByIdPodrazdelenie",
    value: function () {
      var _getByIdPodrazdelenie = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
        var region_id, id, data;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              region_id = req.user.region_id;
              id = req.params.id;
              _context4.next = 4;
              return PodrazdelenieDB.getByIdPodrazdelenie([region_id, id], true);
            case 4:
              data = _context4.sent;
              if (data) {
                _context4.next = 7;
                break;
              }
              return _context4.abrupt("return", res.status(404).json({
                message: "podrazdelenie not found"
              }));
            case 7:
              return _context4.abrupt("return", res.status(201).json({
                message: "podrazdelenie successfully get",
                data: data
              }));
            case 8:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function getByIdPodrazdelenie(_x7, _x8) {
        return _getByIdPodrazdelenie.apply(this, arguments);
      }
      return getByIdPodrazdelenie;
    }()
  }, {
    key: "updatePodrazdelenie",
    value: function () {
      var _updatePodrazdelenie = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
        var region_id, name, id, old_podrazdelenie, result;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              region_id = req.user.region_id;
              name = req.body.name;
              id = req.params.id;
              _context5.next = 5;
              return PodrazdelenieDB.getByIdPodrazdelenie([region_id, id]);
            case 5:
              old_podrazdelenie = _context5.sent;
              if (old_podrazdelenie) {
                _context5.next = 8;
                break;
              }
              return _context5.abrupt("return", res.status(404).json({
                message: "podrazdelenie not found"
              }));
            case 8:
              _context5.next = 10;
              return PodrazdelenieDB.updatePodrazdelenie([name, tashkentTime(), id]);
            case 10:
              result = _context5.sent;
              return _context5.abrupt("return", res.status(200).json({
                message: 'Update successful',
                data: result
              }));
            case 12:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      function updatePodrazdelenie(_x9, _x10) {
        return _updatePodrazdelenie.apply(this, arguments);
      }
      return updatePodrazdelenie;
    }()
  }, {
    key: "deletePodrazdelenie",
    value: function () {
      var _deletePodrazdelenie = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
        var region_id, id, podrazdelenie;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              region_id = req.user.region_id;
              id = req.params.id;
              _context6.next = 4;
              return PodrazdelenieDB.getByIdPodrazdelenie([region_id, id]);
            case 4:
              podrazdelenie = _context6.sent;
              if (podrazdelenie) {
                _context6.next = 7;
                break;
              }
              return _context6.abrupt("return", res.status(404).json({
                message: "podrazdelenie not found"
              }));
            case 7:
              _context6.next = 9;
              return PodrazdelenieDB.deletePodrazdelenie([id]);
            case 9:
              return _context6.abrupt("return", res.status(200).json({
                message: 'delete podrazdelenie successfully'
              }));
            case 10:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      function deletePodrazdelenie(_x11, _x12) {
        return _deletePodrazdelenie.apply(this, arguments);
      }
      return deletePodrazdelenie;
    }()
  }]);
}();