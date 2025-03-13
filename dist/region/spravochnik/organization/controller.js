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
var _require = require('./schema'),
  OrganizationSchema = _require.OrganizationSchema;
var _require2 = require('./service'),
  OrganizationService = _require2.OrganizationService;
var _require3 = require('@bank/service'),
  BankService = _require3.BankService;
exports.Controller = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "setParentId",
    value: function () {
      var _setParentId = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
        var region_id, _req$body, parent_id, organization_ids, organization, _iterator, _step, doc, _organization, response;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              region_id = req.user.region_id;
              _req$body = req.body, parent_id = _req$body.parent_id, organization_ids = _req$body.organization_ids;
              _context.next = 4;
              return OrganizationService.getById({
                region_id: region_id,
                id: parent_id
              });
            case 4:
              organization = _context.sent;
              if (organization) {
                _context.next = 7;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('organizationNotFound'), 404));
            case 7:
              _iterator = _createForOfIteratorHelper(organization_ids);
              _context.prev = 8;
              _iterator.s();
            case 10:
              if ((_step = _iterator.n()).done) {
                _context.next = 19;
                break;
              }
              doc = _step.value;
              _context.next = 14;
              return OrganizationService.getById({
                region_id: region_id,
                id: doc.id
              });
            case 14:
              _organization = _context.sent;
              if (_organization) {
                _context.next = 17;
                break;
              }
              return _context.abrupt("return", res.error(req.i18n.t('organizationNotFound'), 404));
            case 17:
              _context.next = 10;
              break;
            case 19:
              _context.next = 24;
              break;
            case 21:
              _context.prev = 21;
              _context.t0 = _context["catch"](8);
              _iterator.e(_context.t0);
            case 24:
              _context.prev = 24;
              _iterator.f();
              return _context.finish(24);
            case 27:
              _context.next = 29;
              return OrganizationService.setParentId(req.body);
            case 29:
              response = _context.sent;
              return _context.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, null, response));
            case 31:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[8, 21, 24, 27]]);
      }));
      function setParentId(_x, _x2) {
        return _setParentId.apply(this, arguments);
      }
      return setParentId;
    }()
  }, {
    key: "template",
    value: function () {
      var _template = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
        var _yield$OrganizationSe, fileName, fileRes;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return OrganizationService.templateFile();
            case 2:
              _yield$OrganizationSe = _context2.sent;
              fileName = _yield$OrganizationSe.fileName;
              fileRes = _yield$OrganizationSe.fileRes;
              res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
              res.setHeader('Content-Disposition', "attachment; filename=\"".concat(fileName, "\""));
              return _context2.abrupt("return", res.send(fileRes));
            case 8:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function template(_x3, _x4) {
        return _template.apply(this, arguments);
      }
      return template;
    }()
  }, {
    key: "create",
    value: function () {
      var _create = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
        var user_id, result;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              user_id = req.user.id;
              _context3.next = 3;
              return OrganizationService.create(_objectSpread(_objectSpread({}, req.body), {}, {
                user_id: user_id
              }));
            case 3:
              result = _context3.sent;
              return _context3.abrupt("return", res.success(req.i18n.t('createSuccess'), 201, null, result));
            case 5:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function create(_x5, _x6) {
        return _create.apply(this, arguments);
      }
      return create;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
        var region_id, _req$query, page, limit, search, parent, parent_id, offset, organization, _yield$OrganizationSe2, data, total, pageCount, meta;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              region_id = req.user.region_id;
              _req$query = req.query, page = _req$query.page, limit = _req$query.limit, search = _req$query.search, parent = _req$query.parent, parent_id = _req$query.parent_id;
              offset = (page - 1) * limit;
              if (!parent_id) {
                _context4.next = 9;
                break;
              }
              _context4.next = 6;
              return OrganizationService.getById({
                region_id: region_id,
                id: parent_id
              });
            case 6:
              organization = _context4.sent;
              if (organization) {
                _context4.next = 9;
                break;
              }
              return _context4.abrupt("return", res.error(req.i18n.t('organizationNotFound'), 404));
            case 9:
              _context4.next = 11;
              return OrganizationService.get({
                region_id: region_id,
                search: search,
                offset: offset,
                limit: limit,
                parent: parent,
                parent_id: parent_id
              });
            case 11:
              _yield$OrganizationSe2 = _context4.sent;
              data = _yield$OrganizationSe2.data;
              total = _yield$OrganizationSe2.total;
              pageCount = Math.ceil(total / limit);
              meta = {
                pageCount: pageCount,
                count: total,
                currentPage: page,
                nextPage: page >= pageCount ? null : page + 1,
                backPage: Number(page) === 1 ? null : page - 1
              };
              return _context4.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, meta, data));
            case 17:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function get(_x7, _x8) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
        var id, region_id, _req$body2, gaznas, account_numbers, old_data, _iterator2, _step2, _loop, _ret, _iterator3, _step3, _loop2, _ret2, result;
        return _regeneratorRuntime().wrap(function _callee5$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              id = req.params.id;
              region_id = req.user.region_id;
              _req$body2 = req.body, gaznas = _req$body2.gaznas, account_numbers = _req$body2.account_numbers;
              _context7.next = 5;
              return OrganizationService.getById({
                region_id: region_id,
                id: id
              });
            case 5:
              old_data = _context7.sent;
              if (old_data) {
                _context7.next = 8;
                break;
              }
              return _context7.abrupt("return", res.error(req.i18n.t('organizationNotFound'), 404));
            case 8:
              _iterator2 = _createForOfIteratorHelper(gaznas);
              _context7.prev = 9;
              _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
                var gazna, check;
                return _regeneratorRuntime().wrap(function _loop$(_context5) {
                  while (1) switch (_context5.prev = _context5.next) {
                    case 0:
                      gazna = _step2.value;
                      if (!gazna.id) {
                        _context5.next = 5;
                        break;
                      }
                      check = old_data.gaznas.find(function (item) {
                        return item.id === gazna.id;
                      });
                      if (check) {
                        _context5.next = 5;
                        break;
                      }
                      return _context5.abrupt("return", {
                        v: res.error(req.i18n.t('gazna_not_found'), 404)
                      });
                    case 5:
                    case "end":
                      return _context5.stop();
                  }
                }, _loop);
              });
              _iterator2.s();
            case 12:
              if ((_step2 = _iterator2.n()).done) {
                _context7.next = 19;
                break;
              }
              return _context7.delegateYield(_loop(), "t0", 14);
            case 14:
              _ret = _context7.t0;
              if (!_ret) {
                _context7.next = 17;
                break;
              }
              return _context7.abrupt("return", _ret.v);
            case 17:
              _context7.next = 12;
              break;
            case 19:
              _context7.next = 24;
              break;
            case 21:
              _context7.prev = 21;
              _context7.t1 = _context7["catch"](9);
              _iterator2.e(_context7.t1);
            case 24:
              _context7.prev = 24;
              _iterator2.f();
              return _context7.finish(24);
            case 27:
              _iterator3 = _createForOfIteratorHelper(account_numbers);
              _context7.prev = 28;
              _loop2 = /*#__PURE__*/_regeneratorRuntime().mark(function _loop2() {
                var acccount_number, check;
                return _regeneratorRuntime().wrap(function _loop2$(_context6) {
                  while (1) switch (_context6.prev = _context6.next) {
                    case 0:
                      acccount_number = _step3.value;
                      if (!acccount_number.id) {
                        _context6.next = 5;
                        break;
                      }
                      check = old_data.account_numbers.find(function (item) {
                        return item.id === acccount_number.id;
                      });
                      if (check) {
                        _context6.next = 5;
                        break;
                      }
                      return _context6.abrupt("return", {
                        v: res.error(req.i18n.t('account_number_not_found'), 404)
                      });
                    case 5:
                    case "end":
                      return _context6.stop();
                  }
                }, _loop2);
              });
              _iterator3.s();
            case 31:
              if ((_step3 = _iterator3.n()).done) {
                _context7.next = 38;
                break;
              }
              return _context7.delegateYield(_loop2(), "t2", 33);
            case 33:
              _ret2 = _context7.t2;
              if (!_ret2) {
                _context7.next = 36;
                break;
              }
              return _context7.abrupt("return", _ret2.v);
            case 36:
              _context7.next = 31;
              break;
            case 38:
              _context7.next = 43;
              break;
            case 40:
              _context7.prev = 40;
              _context7.t3 = _context7["catch"](28);
              _iterator3.e(_context7.t3);
            case 43:
              _context7.prev = 43;
              _iterator3.f();
              return _context7.finish(43);
            case 46:
              _context7.next = 48;
              return OrganizationService.update(_objectSpread(_objectSpread({
                id: id
              }, req.body), {}, {
                old_data: old_data
              }));
            case 48:
              result = _context7.sent;
              return _context7.abrupt("return", res.success(req.i18n.t('updateSuccess'), 200, null, result));
            case 50:
            case "end":
              return _context7.stop();
          }
        }, _callee5, null, [[9, 21, 24, 27], [28, 40, 43, 46]]);
      }));
      function update(_x9, _x10) {
        return _update.apply(this, arguments);
      }
      return update;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
        var id, region_id, old_data, result;
        return _regeneratorRuntime().wrap(function _callee6$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              id = req.params.id;
              region_id = req.user.region_id;
              _context8.next = 4;
              return OrganizationService.getById({
                region_id: region_id,
                id: id
              });
            case 4:
              old_data = _context8.sent;
              if (old_data) {
                _context8.next = 7;
                break;
              }
              return _context8.abrupt("return", res.error(req.i18n.t('organizationNotFound'), 404));
            case 7:
              _context8.next = 9;
              return OrganizationService["delete"]({
                id: id
              });
            case 9:
              result = _context8.sent;
              return _context8.abrupt("return", res.success(req.i18n.t('deleteSuccess'), 200, null, result));
            case 11:
            case "end":
              return _context8.stop();
          }
        }, _callee6);
      }));
      function _delete(_x11, _x12) {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }()
  }, {
    key: "getById",
    value: function () {
      var _getById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
        var region_id, id, result;
        return _regeneratorRuntime().wrap(function _callee7$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              region_id = req.user.region_id;
              id = req.params.id;
              _context9.next = 4;
              return OrganizationService.getById({
                region_id: region_id,
                id: id,
                isdeleted: true
              });
            case 4:
              result = _context9.sent;
              if (result) {
                _context9.next = 7;
                break;
              }
              return _context9.abrupt("return", res.error(req.i18n.t('organizationNotFound'), 404));
            case 7:
              return _context9.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, null, result));
            case 8:
            case "end":
              return _context9.stop();
          }
        }, _callee7);
      }));
      function getById(_x13, _x14) {
        return _getById.apply(this, arguments);
      }
      return getById;
    }()
  }, {
    key: "import",
    value: function () {
      var _import2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
        var filePath, user_id, _yield$OrganizationSe3, data, header, validation_data, _iterator4, _step4, _item, _OrganizationSchema$i, error, value, _i, _validation_data, item, bank;
        return _regeneratorRuntime().wrap(function _callee8$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              filePath = req.file.path;
              user_id = req.user.id;
              _context10.next = 4;
              return OrganizationService.readFile({
                filePath: filePath
              });
            case 4:
              _yield$OrganizationSe3 = _context10.sent;
              data = _yield$OrganizationSe3.result;
              header = _yield$OrganizationSe3.header;
              validation_data = [];
              _iterator4 = _createForOfIteratorHelper(data);
              _context10.prev = 9;
              _iterator4.s();
            case 11:
              if ((_step4 = _iterator4.n()).done) {
                _context10.next = 19;
                break;
              }
              _item = _step4.value;
              _OrganizationSchema$i = OrganizationSchema.importData(req.i18n).validate(_item), error = _OrganizationSchema$i.error, value = _OrganizationSchema$i.value;
              if (!error) {
                _context10.next = 16;
                break;
              }
              return _context10.abrupt("return", res.error(error.details[0].message, 400, {
                code: CODE.EXCEL_IMPORT.code,
                doc: _item,
                header: header
              }));
            case 16:
              validation_data.push(value);
            case 17:
              _context10.next = 11;
              break;
            case 19:
              _context10.next = 24;
              break;
            case 21:
              _context10.prev = 21;
              _context10.t0 = _context10["catch"](9);
              _iterator4.e(_context10.t0);
            case 24:
              _context10.prev = 24;
              _iterator4.f();
              return _context10.finish(24);
            case 27:
              _i = 0, _validation_data = validation_data;
            case 28:
              if (!(_i < _validation_data.length)) {
                _context10.next = 39;
                break;
              }
              item = _validation_data[_i];
              _context10.next = 32;
              return BankService.getByMfo({
                mfo: item.mfo
              });
            case 32:
              bank = _context10.sent;
              if (bank) {
                _context10.next = 35;
                break;
              }
              return _context10.abrupt("return", res.error(req.i18n.t('bankNotFound'), 404, {
                doc: item.mfo
              }));
            case 35:
              item.bank_klient = bank.bank_name;
            case 36:
              _i++;
              _context10.next = 28;
              break;
            case 39:
              _context10.next = 41;
              return OrganizationService["import"]({
                data: validation_data,
                user_id: user_id
              });
            case 41:
              return _context10.abrupt("return", res.success(req.i18n.t('importSuccess'), 201));
            case 42:
            case "end":
              return _context10.stop();
          }
        }, _callee8, null, [[9, 21, 24, 27]]);
      }));
      function _import(_x15, _x16) {
        return _import2.apply(this, arguments);
      }
      return _import;
    }()
  }]);
}();