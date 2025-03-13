"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// validate
var Joi = require('joi');
exports.updateAccessSchema = Joi.object({
  body: Joi.object({
    role_get: Joi["boolean"]()["default"](false),
    users_create: Joi["boolean"]()["default"](false),
    users_update: Joi["boolean"]()["default"](false),
    users_get: Joi["boolean"]()["default"](false),
    users_delete: Joi["boolean"]()["default"](false),
    budjet_get: Joi["boolean"]()["default"](false),
    access_update: Joi["boolean"]()["default"](false),
    access_get: Joi["boolean"]()["default"](false),
    main_schet_create: Joi["boolean"]()["default"](false),
    main_schet_update: Joi["boolean"]()["default"](false),
    main_schet_get: Joi["boolean"]()["default"](false),
    main_schet_delete: Joi["boolean"]()["default"](false),
    operatsii_get: Joi["boolean"]()["default"](false),
    organization_create: Joi["boolean"]()["default"](false),
    organization_update: Joi["boolean"]()["default"](false),
    organization_get: Joi["boolean"]()["default"](false),
    organization_delete: Joi["boolean"]()["default"](false),
    podotchet_create: Joi["boolean"]()["default"](false),
    podotchet_update: Joi["boolean"]()["default"](false),
    podotchet_get: Joi["boolean"]()["default"](false),
    podotchet_delete: Joi["boolean"]()["default"](false),
    podpis_create: Joi["boolean"]()["default"](false),
    podpis_update: Joi["boolean"]()["default"](false),
    podpis_get: Joi["boolean"]()["default"](false),
    podpis_delete: Joi["boolean"]()["default"](false),
    podrazdelenie_create: Joi["boolean"]()["default"](false),
    podrazdelenie_update: Joi["boolean"]()["default"](false),
    podrazdelenie_get: Joi["boolean"]()["default"](false),
    podrazdelenie_delete: Joi["boolean"]()["default"](false),
    sostav_create: Joi["boolean"]()["default"](false),
    sostav_update: Joi["boolean"]()["default"](false),
    sostav_get: Joi["boolean"]()["default"](false),
    sostav_delete: Joi["boolean"]()["default"](false),
    type_operatsii_create: Joi["boolean"]()["default"](false),
    type_operatsii_update: Joi["boolean"]()["default"](false),
    type_operatsii_get: Joi["boolean"]()["default"](false),
    type_operatsii_delete: Joi["boolean"]()["default"](false),
    akt_create: Joi["boolean"]()["default"](false),
    akt_update: Joi["boolean"]()["default"](false),
    akt_get: Joi["boolean"]()["default"](false),
    akt_delete: Joi["boolean"]()["default"](false),
    admin_create: Joi["boolean"]()["default"](false),
    admin_update: Joi["boolean"]()["default"](false),
    admin_get: Joi["boolean"]()["default"](false),
    admin_delete: Joi["boolean"]()["default"](false),
    avans_create: Joi["boolean"]()["default"](false),
    avans_update: Joi["boolean"]()["default"](false),
    avans_get: Joi["boolean"]()["default"](false),
    avans_delete: Joi["boolean"]()["default"](false),
    bank_prixod_create: Joi["boolean"]()["default"](false),
    bank_prixod_update: Joi["boolean"]()["default"](false),
    bank_prixod_get: Joi["boolean"]()["default"](false),
    bank_prixod_delete: Joi["boolean"]()["default"](false),
    bank_rasxod_create: Joi["boolean"]()["default"](false),
    bank_rasxod_update: Joi["boolean"]()["default"](false),
    bank_rasxod_get: Joi["boolean"]()["default"](false),
    bank_rasxod_delete: Joi["boolean"]()["default"](false),
    bank_monitoring: Joi["boolean"]()["default"](false),
    internal_j7_create: Joi["boolean"]()["default"](false),
    internal_j7_update: Joi["boolean"]()["default"](false),
    internal_j7_get: Joi["boolean"]()["default"](false),
    internal_j7_delete: Joi["boolean"]()["default"](false),
    prixod_j7_create: Joi["boolean"]()["default"](false),
    prixod_j7_update: Joi["boolean"]()["default"](false),
    prixod_j7_get: Joi["boolean"]()["default"](false),
    prixod_j7_delete: Joi["boolean"]()["default"](false),
    rasxod_j7_create: Joi["boolean"]()["default"](false),
    rasxod_j7_update: Joi["boolean"]()["default"](false),
    rasxod_j7_get: Joi["boolean"]()["default"](false),
    rasxod_j7_delete: Joi["boolean"]()["default"](false),
    iznos_j7: Joi["boolean"]()["default"](false),
    group_j7_create: Joi["boolean"]()["default"](false),
    group_j7_update: Joi["boolean"]()["default"](false),
    group_j7_get: Joi["boolean"]()["default"](false),
    group_j7_delete: Joi["boolean"]()["default"](false),
    product_j7_create: Joi["boolean"]()["default"](false),
    product_j7_update: Joi["boolean"]()["default"](false),
    product_j7_get: Joi["boolean"]()["default"](false),
    product_j7_delete: Joi["boolean"]()["default"](false),
    pereotsenka_j7_create: Joi["boolean"]()["default"](false),
    pereotsenka_j7_update: Joi["boolean"]()["default"](false),
    pereotsenka_j7_get: Joi["boolean"]()["default"](false),
    pereotsenka_j7_delete: Joi["boolean"]()["default"](false),
    podrazdelenie_j7_create: Joi["boolean"]()["default"](false),
    podrazdelenie_j7_update: Joi["boolean"]()["default"](false),
    podrazdelenie_j7_get: Joi["boolean"]()["default"](false),
    podrazdelenie_j7_delete: Joi["boolean"]()["default"](false),
    responsible_j7_create: Joi["boolean"]()["default"](false),
    responsible_j7_update: Joi["boolean"]()["default"](false),
    responsible_j7_get: Joi["boolean"]()["default"](false),
    responsible_j7_delete: Joi["boolean"]()["default"](false),
    unit_storage_j7_create: Joi["boolean"]()["default"](false),
    unit_storage_j7_update: Joi["boolean"]()["default"](false),
    unit_storage_j7_get: Joi["boolean"]()["default"](false),
    unit_storage_j7_delete: Joi["boolean"]()["default"](false),
    kassa_prixod_create: Joi["boolean"]()["default"](false),
    kassa_prixod_update: Joi["boolean"]()["default"](false),
    kassa_prixod_get: Joi["boolean"]()["default"](false),
    kassa_prixod_delete: Joi["boolean"]()["default"](false),
    kassa_rasxod_create: Joi["boolean"]()["default"](false),
    kassa_rasxod_update: Joi["boolean"]()["default"](false),
    kassa_rasxod_get: Joi["boolean"]()["default"](false),
    kassa_rasxod_delete: Joi["boolean"]()["default"](false),
    kassa_monitoring: Joi["boolean"]()["default"](false),
    organ_monitoring: Joi["boolean"]()["default"](false),
    podotchet_monitoring: Joi["boolean"]()["default"](false),
    shartnoma_create: Joi["boolean"]()["default"](false),
    shartnoma_update: Joi["boolean"]()["default"](false),
    shartnoma_get: Joi["boolean"]()["default"](false),
    shartnoma_delete: Joi["boolean"]()["default"](false),
    shartnoma_grafik_create: Joi["boolean"]()["default"](false),
    shartnoma_grafik_update: Joi["boolean"]()["default"](false),
    shartnoma_grafik_get: Joi["boolean"]()["default"](false),
    shartnoma_grafik_delete: Joi["boolean"]()["default"](false),
    show_service_create: Joi["boolean"]()["default"](false),
    show_service_update: Joi["boolean"]()["default"](false),
    show_service_get: Joi["boolean"]()["default"](false),
    show_service_delete: Joi["boolean"]()["default"](false),
    smeta_create: Joi["boolean"]()["default"](false),
    smeta_update: Joi["boolean"]()["default"](false),
    smeta_get: Joi["boolean"]()["default"](false),
    smeta_delete: Joi["boolean"]()["default"](false),
    smeta_grafik_create: Joi["boolean"]()["default"](false),
    smeta_grafik_update: Joi["boolean"]()["default"](false),
    smeta_grafik_get: Joi["boolean"]()["default"](false),
    smeta_grafik_delete: Joi["boolean"]()["default"](false)
  }),
  params: Joi.object({
    id: Joi.number().integer().min(1).required()
  })
}).options({
  stripUnknown: true
});
exports.getByRoleIdAccessSchema = Joi.object({
  query: Joi.object({
    role_id: Joi.number().integer().min(1).required()
  })
}).options({
  stripUnknown: true
});

// db 

var _require = require('@helper/functions'),
  returnParamsValues = _require.returnParamsValues;
var _require2 = require('@db/index'),
  db = _require2.db;
exports.AccessDB = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "createAccess",
    value: function () {
      var _createAccess = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(params, client) {
        var values, query, result;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              values = returnParamsValues(params, 4);
              query = "INSERT INTO access (role_id, region_id, created_at, updated_at) VALUES ".concat(values);
              _context.next = 4;
              return client.query(query, params);
            case 4:
              result = _context.sent;
              return _context.abrupt("return", result);
            case 6:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function createAccess(_x, _x2) {
        return _createAccess.apply(this, arguments);
      }
      return createAccess;
    }()
  }, {
    key: "deleteAccess",
    value: function () {
      var _deleteAccess = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(params, client) {
        var query;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              query = "UPDATE access SET isdeleted = true WHERE role_id = $1";
              _context2.next = 3;
              return client.query(query, params);
            case 3:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function deleteAccess(_x3, _x4) {
        return _deleteAccess.apply(this, arguments);
      }
      return deleteAccess;
    }()
  }, {
    key: "getByRoleIdAccess",
    value: function () {
      var _getByRoleIdAccess = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(params, region_id) {
        var index_region_id, query, data;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (region_id) {
                params.push(region_id);
                index_region_id = params.length;
              }
              query = "--sql\n            SELECT a.*, r.name AS role_name\n            FROM access AS a\n            JOIN role AS r ON r.id = a.role_id\n            WHERE r.id = $1 ".concat(region_id ? "AND a.region_id = $".concat(index_region_id) : "", ";\n        ");
              _context3.next = 4;
              return db.query(query, params);
            case 4:
              data = _context3.sent;
              return _context3.abrupt("return", data[0]);
            case 6:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function getByRoleIdAccess(_x5, _x6) {
        return _getByRoleIdAccess.apply(this, arguments);
      }
      return getByRoleIdAccess;
    }()
  }, {
    key: "updateAccess",
    value: function () {
      var _updateAccess = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(params) {
        var query, data;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              query = "--sql\n            UPDATE access SET   \n              role_get = $1,\n              users_create = $2,\n              users_update = $3,\n              users_get = $4,\n              users_delete = $5,\n              budjet_get = $6,\n              access_update = $7,\n              access_get = $8,\n              main_schet_get = $9,\n              operatsii_get = $10,\n              organization_create = $11,\n              organization_update = $12,\n              organization_get = $13,\n              organization_delete = $14,\n              podotchet_create = $15,\n              podotchet_update = $16,\n              podotchet_get = $17,\n              podotchet_delete = $18,\n              podpis_create = $19,\n              podpis_update = $20,\n              podpis_get = $21,\n              podpis_delete = $22,\n              podrazdelenie_create = $23,\n              podrazdelenie_update = $24,\n              podrazdelenie_get = $25,\n              podrazdelenie_delete = $26,\n              sostav_create = $27,\n              sostav_update = $28,\n              sostav_get = $29,\n              sostav_delete = $30,\n              type_operatsii_create = $31,\n              type_operatsii_update = $32,\n              type_operatsii_get = $33,\n              type_operatsii_delete = $34,\n              akt_create = $35,\n              akt_update = $36,\n              akt_get = $37,\n              akt_delete = $38,\n              avans_create = $39,\n              avans_update = $40,\n              avans_get = $41,\n              avans_delete = $42,\n              bank_prixod_create = $43,\n              bank_prixod_update = $44,\n              bank_prixod_get = $45,\n              bank_prixod_delete = $46,\n              bank_rasxod_create = $47,\n              bank_rasxod_update = $48,\n              bank_rasxod_get = $49,\n              bank_rasxod_delete = $50,\n              bank_monitoring = $51,\n              internal_j7_create = $52,\n              internal_j7_update = $53,\n              internal_j7_get = $54,\n              internal_j7_delete = $55,\n              prixod_j7_create = $56,\n              prixod_j7_update = $57,\n              prixod_j7_get = $58,\n              prixod_j7_delete = $59,\n              rasxod_j7_create = $60,\n              rasxod_j7_update = $61,\n              rasxod_j7_get = $62,\n              rasxod_j7_delete = $63,\n              iznos_j7 = $64,\n              group_j7_create = $65,\n              group_j7_update = $66,\n              group_j7_get = $67,\n              group_j7_delete = $68,\n              product_j7_create = $69,\n              product_j7_update = $70,\n              product_j7_get = $71,\n              product_j7_delete = $72,\n              pereotsenka_j7_create = $73,\n              pereotsenka_j7_update = $74,\n              pereotsenka_j7_get = $75,\n              pereotsenka_j7_delete = $76,\n              podrazdelenie_j7_create = $77,\n              podrazdelenie_j7_update = $78,\n              podrazdelenie_j7_get = $79,\n              podrazdelenie_j7_delete = $80,\n              responsible_j7_create = $81,\n              responsible_j7_update = $82,\n              responsible_j7_get = $83,\n              responsible_j7_delete = $84,\n              kassa_prixod_create = $85,\n              kassa_prixod_update = $86,\n              kassa_prixod_get = $87,\n              kassa_prixod_delete = $88,\n              kassa_rasxod_create = $89,\n              kassa_rasxod_update = $90,\n              kassa_rasxod_get = $91,\n              kassa_rasxod_delete = $92,\n              kassa_monitoring = $93,\n              organ_monitoring = $94,\n              podotchet_monitoring = $95,\n              shartnoma_create = $96,\n              shartnoma_update = $97,\n              shartnoma_get = $98,\n              shartnoma_delete = $99,\n              shartnoma_grafik_create = $100,\n              shartnoma_grafik_update = $101,\n              shartnoma_grafik_get = $102,\n              shartnoma_grafik_delete = $103,\n              show_service_create = $104,\n              show_service_update = $105,\n              show_service_get = $106,\n              show_service_delete = $107,\n              smeta_get = $108,\n              smeta_grafik_create = $109,\n              smeta_grafik_update = $110,\n              smeta_grafik_get = $111,\n              smeta_grafik_delete = $112,\n              unit_storage_j7_get = $113,\n              main_schet_create = $114,\n              main_schet_update = $115,\n              main_schet_delete = $116,\n              updated_at = $117\n            WHERE id = $118\n            RETURNING *\n        ";
              _context4.next = 3;
              return db.query(query, params);
            case 3:
              data = _context4.sent;
              return _context4.abrupt("return", data[0]);
            case 5:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function updateAccess(_x7) {
        return _updateAccess.apply(this, arguments);
      }
      return updateAccess;
    }()
  }, {
    key: "getByIdAccess",
    value: function () {
      var _getByIdAccess = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(params, isdeleted) {
        var query, data;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              query = "SELECT * FROM access WHERE region_id = $1 AND access.id = $2";
              _context5.next = 3;
              return db.query(query, params);
            case 3:
              data = _context5.sent;
              return _context5.abrupt("return", data[0]);
            case 5:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      function getByIdAccess(_x8, _x9) {
        return _getByIdAccess.apply(this, arguments);
      }
      return getByIdAccess;
    }()
  }]);
}();

// service 
var _require3 = require('./db'),
  AccessDB = _require3.AccessDB;
var _require4 = require('@helper/functions'),
  tashkentTime = _require4.tashkentTime;
var _require5 = require('@role/db'),
  RoleDB = _require5.RoleDB;
exports.AccessService = /*#__PURE__*/function () {
  function _class2() {
    _classCallCheck(this, _class2);
  }
  return _createClass(_class2, null, [{
    key: "updateAccess",
    value: function () {
      var _updateAccess2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
        var data, region_id, access_id, old_data, result;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              data = req.body;
              region_id = req.user.region_id;
              access_id = req.params.id;
              _context6.next = 5;
              return AccessDB.getByIdAccess([region_id, access_id]);
            case 5:
              old_data = _context6.sent;
              if (old_data) {
                _context6.next = 8;
                break;
              }
              return _context6.abrupt("return", res.status(404).json({
                message: "access not found"
              }));
            case 8:
              _context6.next = 10;
              return AccessDB.updateAccess([data.role_get, data.users_create, data.users_update, data.users_get, data.users_delete, data.budjet_get, data.access_update, data.access_get, data.main_schet_get, data.operatsii_get, data.organization_create, data.organization_update, data.organization_get, data.organization_delete, data.podotchet_create, data.podotchet_update, data.podotchet_get, data.podotchet_delete, data.podpis_create, data.podpis_update, data.podpis_get, data.podpis_delete, data.podrazdelenie_create, data.podrazdelenie_update, data.podrazdelenie_get, data.podrazdelenie_delete, data.sostav_create, data.sostav_update, data.sostav_get, data.sostav_delete, data.type_operatsii_create, data.type_operatsii_update, data.type_operatsii_get, data.type_operatsii_delete, data.akt_create, data.akt_update, data.akt_get, data.akt_delete, data.avans_create, data.avans_update, data.avans_get, data.avans_delete, data.bank_prixod_create, data.bank_prixod_update, data.bank_prixod_get, data.bank_prixod_delete, data.bank_rasxod_create, data.bank_rasxod_update, data.bank_rasxod_get, data.bank_rasxod_delete, data.bank_monitoring, data.internal_j7_create, data.internal_j7_update, data.internal_j7_get, data.internal_j7_delete, data.prixod_j7_create, data.prixod_j7_update, data.prixod_j7_get, data.prixod_j7_delete, data.rasxod_j7_create, data.rasxod_j7_update, data.rasxod_j7_get, data.rasxod_j7_delete, data.iznos_j7, data.group_j7_create, data.group_j7_update, data.group_j7_get, data.group_j7_delete, data.product_j7_create, data.product_j7_update, data.product_j7_get, data.product_j7_delete, data.pereotsenka_j7_create, data.pereotsenka_j7_update, data.pereotsenka_j7_get, data.pereotsenka_j7_delete, data.podrazdelenie_j7_create, data.podrazdelenie_j7_update, data.podrazdelenie_j7_get, data.podrazdelenie_j7_delete, data.responsible_j7_create, data.responsible_j7_update, data.responsible_j7_get, data.responsible_j7_delete, data.kassa_prixod_create, data.kassa_prixod_update, data.kassa_prixod_get, data.kassa_prixod_delete, data.kassa_rasxod_create, data.kassa_rasxod_update, data.kassa_rasxod_get, data.kassa_rasxod_delete, data.kassa_monitoring, data.organ_monitoring, data.podotchet_monitoring, data.shartnoma_create, data.shartnoma_update, data.shartnoma_get, data.shartnoma_delete, data.shartnoma_grafik_create, data.shartnoma_grafik_update, data.shartnoma_grafik_get, data.shartnoma_grafik_delete, data.show_service_create, data.show_service_update, data.show_service_get, data.show_service_delete, data.smeta_get, data.smeta_grafik_create, data.smeta_grafik_update, data.smeta_grafik_get, data.smeta_grafik_delete, data.unit_storage_j7_get, data.main_schet_create, data.main_schet_update, data.main_schet_delete, tashkentTime(), access_id]);
            case 10:
              result = _context6.sent;
              return _context6.abrupt("return", res.status(200).json({
                message: 'update seccessfully !',
                data: result
              }));
            case 12:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      function updateAccess(_x10, _x11) {
        return _updateAccess2.apply(this, arguments);
      }
      return updateAccess;
    }()
  }, {
    key: "getByRoleIdAccess",
    value: function () {
      var _getByRoleIdAccess2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
        var region_id, role_id, role, access;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              region_id = req.user.region_id;
              role_id = req.query.role_id;
              _context7.next = 4;
              return RoleDB.getByIdRole([role_id]);
            case 4:
              role = _context7.sent;
              if (role) {
                _context7.next = 7;
                break;
              }
              return _context7.abrupt("return", res.status(404).json({
                message: "role not found"
              }));
            case 7:
              _context7.next = 9;
              return AccessDB.getByRoleIdAccess([role_id], region_id);
            case 9:
              access = _context7.sent;
              if (access) {
                _context7.next = 12;
                break;
              }
              return _context7.abrupt("return", res.status(404).json({
                message: 'access not found'
              }));
            case 12:
              return _context7.abrupt("return", res.status(200).json({
                message: "access get successfully!",
                data: access
              }));
            case 13:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      }));
      function getByRoleIdAccess(_x12, _x13) {
        return _getByRoleIdAccess2.apply(this, arguments);
      }
      return getByRoleIdAccess;
    }()
  }]);
}();