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
var _require = require('@db/index'),
  db = _require.db;
var _require2 = require('@helper/functions'),
  sqlFilter = _require2.sqlFilter;
exports.Jur7MonitoringDB = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "getSchets",
    value: function () {
      var _getSchets = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(params) {
        var responsible_id,
          index_responsible_id,
          query,
          result,
          _args = arguments;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              responsible_id = _args.length > 1 && _args[1] !== undefined ? _args[1] : null;
              index_responsible_id = null;
              if (responsible_id) {
                params.push(responsible_id);
                index_responsible_id = params.length;
              }
              query = "--sql\n            SELECT schet \n            FROM (\n                SELECT d_j_ch.debet_schet AS schet\n                FROM document_prixod_jur7 d_j\n                JOIN document_prixod_jur7_child d_j_ch ON d_j_ch.document_prixod_jur7_id = d_j.id\n                WHERE EXTRACT(YEAR FROM d_j.doc_date) = $1 AND EXTRACT(MONTH FROM d_j.doc_date) = $2 AND d_j.main_schet_id = $3 \n                ".concat(responsible_id ? sqlFilter('d_j.kimga_id', index_responsible_id) : '', "\n                UNION ALL\n                \n                SELECT d_j_ch.kredit_schet AS schet\n                FROM document_rasxod_jur7 d_j\n                JOIN document_rasxod_jur7_child d_j_ch ON d_j_ch.document_rasxod_jur7_id = d_j.id\n                WHERE EXTRACT(YEAR FROM d_j.doc_date) = $1 AND EXTRACT(MONTH FROM d_j.doc_date) = $2 AND d_j.main_schet_id = $3\n                ").concat(responsible_id ? sqlFilter('d_j.kimdan_id', index_responsible_id) : '', "\n                \n                UNION ALL\n                \n                SELECT d_j_ch.kredit_schet AS schet\n                FROM document_vnutr_peremesh_jur7 d_j\n                JOIN document_vnutr_peremesh_jur7_child d_j_ch ON d_j_ch.document_vnutr_peremesh_jur7_id = d_j.id\n                WHERE EXTRACT(YEAR FROM d_j.doc_date) = $1 AND EXTRACT(MONTH FROM d_j.doc_date) = $2 AND d_j.main_schet_id = $3\n                ").concat(responsible_id ? sqlFilter('d_j.kimdan_id', index_responsible_id) : '', "\n                \n                UNION ALL\n                \n                SELECT d_j_ch.debet_schet AS schet\n                FROM document_vnutr_peremesh_jur7 d_j\n                JOIN document_vnutr_peremesh_jur7_child d_j_ch ON d_j_ch.document_vnutr_peremesh_jur7_id = d_j.id\n                WHERE EXTRACT(YEAR FROM d_j.doc_date) = $1 AND EXTRACT(MONTH FROM d_j.doc_date) = $2 AND d_j.main_schet_id = $3\n                ").concat(responsible_id ? sqlFilter('d_j.kimga_id', index_responsible_id) : '', "\n\n            ) AS combined_schets\n            GROUP BY schet   \n        ");
              _context.next = 6;
              return db.query(query, params);
            case 6:
              result = _context.sent;
              return _context.abrupt("return", result);
            case 8:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function getSchets(_x) {
        return _getSchets.apply(this, arguments);
      }
      return getSchets;
    }()
  }, {
    key: "getSummaReport",
    value: function () {
      var _getSummaReport = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(params, operator) {
        var responsible_id,
          product_id,
          internal_filter,
          index_responsible_id,
          product_filter,
          query,
          result,
          _args2 = arguments;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              responsible_id = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : null;
              product_id = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : null;
              internal_filter = "";
              if (params.length === 3) {
                internal_filter = "".concat(operator, " $3");
              }
              if (params.length === 4) {
                internal_filter = 'BETWEEN $3 AND $4';
              }
              index_responsible_id = null;
              if (responsible_id) {
                params.push(responsible_id);
                index_responsible_id = params.length;
              }
              product_filter = "";
              if (product_id) {
                product_filter = "AND d_j_ch.naimenovanie_tovarov_jur7_id = $".concat(params.length + 1);
                params.push(product_id);
              }
              query = "--sql\n            WITH \n            jur7_prixodSum AS (\n                SELECT COALESCE(SUM(d_j_ch.summa), 0::FLOAT) AS summa, COALESCE(SUM(d_j_ch.kol), 0)::FLOAT AS kol\n                FROM document_prixod_jur7 d_j\n                JOIN document_prixod_jur7_child d_j_ch ON d_j_ch.document_prixod_jur7_id = d_j.id\n                WHERE d_j.main_schet_id = $1 AND  d_j_ch.debet_schet = $2 AND d_j.doc_date ".concat(internal_filter, "\n                ").concat(responsible_id ? sqlFilter('d_j.kimga_id', index_responsible_id) : '', " ").concat(product_filter, " \n            ),\n            jur7_rasxodSum AS (\n                SELECT COALESCE(SUM(d_j_ch.summa), 0)::FLOAT AS summa, COALESCE(SUM(d_j_ch.kol), 0)::FLOAT AS kol\n                FROM document_rasxod_jur7 d_j\n                JOIN document_rasxod_jur7_child d_j_ch ON d_j_ch.document_rasxod_jur7_id = d_j.id\n                WHERE d_j.main_schet_id = $1 AND  d_j_ch.kredit_schet = $2 AND d_j.doc_date ").concat(internal_filter, "\n                ").concat(responsible_id ? sqlFilter('d_j.kimdan_id', index_responsible_id) : '', " ").concat(product_filter, "\n            ),\n            jur7_internal_rasxodSum AS (\n                SELECT COALESCE(SUM(d_j_ch.summa), 0)::FLOAT AS summa, COALESCE(SUM(d_j_ch.kol), 0)::FLOAT AS kol\n                FROM document_vnutr_peremesh_jur7 d_j\n                JOIN document_vnutr_peremesh_jur7_child d_j_ch ON d_j_ch.document_vnutr_peremesh_jur7_id = d_j.id\n                WHERE d_j.main_schet_id = $1 AND  d_j_ch.kredit_schet = $2 AND d_j.doc_date ").concat(internal_filter, "\n                ").concat(responsible_id ? sqlFilter('d_j.kimdan_id', index_responsible_id) : '', " ").concat(product_filter, "\n            ),\n            jur7_internal_PrixodSum AS (\n                SELECT COALESCE(SUM(d_j_ch.summa), 0)::FLOAT AS summa, COALESCE(SUM(d_j_ch.kol), 0)::FLOAT AS kol\n                FROM document_vnutr_peremesh_jur7 d_j\n                JOIN document_vnutr_peremesh_jur7_child d_j_ch ON d_j_ch.document_vnutr_peremesh_jur7_id = d_j.id\n                WHERE d_j.main_schet_id = $1 AND  d_j_ch.debet_schet = $2 AND d_j.doc_date ").concat(internal_filter, "\n                ").concat(responsible_id ? sqlFilter('d_j.kimga_id', index_responsible_id) : '', " ").concat(product_filter, "\n            )\n            SELECT \n                ((jur7_prixodSum.summa + jur7_internal_PrixodSum.summa) - (jur7_rasxodSum.summa + jur7_internal_rasxodSum.summa)) AS summa,\n                ((jur7_prixodSum.kol + jur7_internal_PrixodSum.kol) - (jur7_rasxodSum.kol + jur7_internal_rasxodSum.kol)) AS kol,\n                (jur7_prixodSum.summa + jur7_internal_PrixodSum.summa) AS prixod,\n                (jur7_prixodSum.kol + jur7_internal_PrixodSum.kol) AS prixod_kol,\n                (jur7_rasxodSum.summa + jur7_internal_rasxodSum.summa) AS rasxod,\n                (jur7_rasxodSum.kol + jur7_internal_rasxodSum.kol) AS rasxod_kol\n            FROM jur7_prixodSum, jur7_rasxodSum, jur7_internal_rasxodSum, jur7_internal_PrixodSum\n        ");
              _context2.next = 12;
              return db.query(query, params);
            case 12:
              result = _context2.sent;
              return _context2.abrupt("return", result[0]);
            case 14:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function getSummaReport(_x2, _x3) {
        return _getSummaReport.apply(this, arguments);
      }
      return getSummaReport;
    }()
  }, {
    key: "getBySchetProducts",
    value: function () {
      var _getBySchetProducts = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(params) {
        var query, result;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              query = "--sql\n            SELECT \n              n.id,\n              TO_CHAR(d_j.doc_date, 'YYYY-MM-DD') AS doc_date, \n              n.id, \n              n.edin,\n              n.name\n            FROM document_prixod_jur7  d_j\n            JOIN users AS u ON u.id = d_j.user_id\n            JOIN regions r ON r.id = u.region_id\n            JOIN document_prixod_jur7_child d_ch ON d_ch.document_prixod_jur7_id = d_j.id\n            JOIN naimenovanie_tovarov_jur7 n ON n.id = d_ch.naimenovanie_tovarov_jur7_id\n            WHERE d_j.isdeleted = false \n              AND r.id = $1\n              AND d_j.main_schet_id = $2\n              AND d_ch.debet_schet = $3\n              AND d_j.kimga_id = $4\n        ";
              _context3.next = 3;
              return db.query(query, params);
            case 3:
              result = _context3.sent;
              return _context3.abrupt("return", result);
            case 5:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function getBySchetProducts(_x4) {
        return _getBySchetProducts.apply(this, arguments);
      }
      return getBySchetProducts;
    }()
  }, {
    key: "getSchetsForCap",
    value: function () {
      var _getSchetsForCap = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(params) {
        var query, result;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              query = "--sql\n            SELECT DISTINCT debet_schet, kredit_schet \n            FROM (\n                SELECT ch.debet_schet, ch.kredit_schet\n                FROM document_rasxod_jur7 d\n                JOIN document_rasxod_jur7_child ch ON ch.document_rasxod_jur7_id = d.id\n                JOIN users AS u ON u.id = d.user_id \n                JOIN regions AS r ON r.id = u.region_id\n                JOIN main_schet AS m ON m.id = d.main_schet_id\n                WHERE m.spravochnik_budjet_name_id = $1\n                    AND r.id = $2\n                    AND d.doc_date BETWEEN $3 AND $4\n    \n                UNION ALL\n    \n                SELECT ch.debet_schet, ch.kredit_schet\n                FROM document_vnutr_peremesh_jur7 d\n                JOIN document_vnutr_peremesh_jur7_child ch ON ch.document_vnutr_peremesh_jur7_id = d.id\n                JOIN users AS u ON u.id = d.user_id \n                JOIN regions AS r ON r.id = u.region_id\n                JOIN main_schet AS m ON m.id = d.main_schet_id\n                WHERE m.spravochnik_budjet_name_id = $1\n                    AND r.id = $2\n                    AND d.doc_date BETWEEN $3 AND $4\n    \n                UNION ALL \n    \n                SELECT g.provodka_debet AS debet_schet, g.provodka_kredit AS kredit_schet\n                FROM iznos_tovar_jur7 i\n                JOIN naimenovanie_tovarov_jur7 p ON i.naimenovanie_tovarov_jur7_id = p.id\n                JOIN group_jur7 AS g ON g.id = p.group_jur7_id\n                JOIN users AS u ON u.id = i.user_id \n                JOIN regions AS r ON r.id = u.region_id\n                WHERE i.budjet_id = $1\n                    AND r.id = $2\n                    AND i.full_date BETWEEN $3 AND $4\n            ); \n        ";
              _context4.next = 3;
              return db.query(query, params);
            case 3:
              result = _context4.sent;
              return _context4.abrupt("return", result);
            case 5:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function getSchetsForCap(_x5) {
        return _getSchetsForCap.apply(this, arguments);
      }
      return getSchetsForCap;
    }()
  }, {
    key: "getCapSchetSumma",
    value: function () {
      var _getCapSchetSumma = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(params) {
        var query, result;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              query = "--sql\n            SELECT COALESCE(SUM(summa_s_nds), 0)::FLOAt AS summa \n            FROM (\n                SELECT ch.summa_s_nds, ch.debet_schet, ch.kredit_schet\n            FROM document_rasxod_jur7 d\n            JOIN document_rasxod_jur7_child ch ON ch.document_rasxod_jur7_id = d.id\n            JOIN users AS u ON u.id = d.user_id \n            JOIN regions AS r ON r.id = u.region_id\n            JOIN main_schet AS m ON m.id = d.main_schet_id\n            WHERE m.spravochnik_budjet_name_id = $1\n                AND  r.id = $2\n                AND d.doc_date BETWEEN $3 AND $4\n\n            UNION ALL\n\n            SELECT ch.summa_s_nds, ch.debet_schet, ch.kredit_schet\n            FROM document_vnutr_peremesh_jur7 d\n            JOIN document_vnutr_peremesh_jur7_child ch ON ch.document_vnutr_peremesh_jur7_id = d.id\n            JOIN users AS u ON u.id = d.user_id \n            JOIN regions AS r ON r.id = u.region_id\n            JOIN main_schet AS m ON m.id = d.main_schet_id\n            WHERE m.spravochnik_budjet_name_id = $1\n                AND  r.id = $2\n                AND d.doc_date BETWEEN $3 AND $4\n            \n            UNION ALL \n\n                SELECT  i.iznos_summa AS summa_s_nds, g.provodka_debet AS debet_schet, g.provodka_kredit AS kredit_schet\n                FROM iznos_tovar_jur7 i\n                JOIN naimenovanie_tovarov_jur7 p ON i.naimenovanie_tovarov_jur7_id = p.id\n                JOIN group_jur7 AS g ON g.id = p.group_jur7_id\n                JOIN users AS u ON u.id = i.user_id \n                JOIN regions AS r ON r.id = u.region_id\n                WHERE i.budjet_id = $1\n                    AND r.id = $2\n                    AND i.full_date BETWEEN $3 AND $4\n            )\n            WHERE debet_schet = $5 AND kredit_schet = $6;\n        ";
              _context5.next = 3;
              return db.query(query, params);
            case 3:
              result = _context5.sent;
              return _context5.abrupt("return", result[0].summa);
            case 5:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      function getCapSchetSumma(_x6) {
        return _getCapSchetSumma.apply(this, arguments);
      }
      return getCapSchetSumma;
    }()
  }, {
    key: "getDebetSubSchetsForCap",
    value: function () {
      var _getDebetSubSchetsForCap = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(params) {
        var query, result;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              query = "--sql\n            SELECT DISTINCT debet_sub_schet  \n            FROM (\n                SELECT ch.debet_sub_schet\n                FROM document_rasxod_jur7 d\n                JOIN document_rasxod_jur7_child ch ON ch.document_rasxod_jur7_id = d.id\n                JOIN users AS u ON u.id = d.user_id \n                JOIN regions AS r ON r.id = u.region_id\n                JOIN main_schet AS m ON m.id = d.main_schet_id\n                WHERE m.spravochnik_budjet_name_id = $1\n                    AND  r.id = $2\n                    AND d.doc_date BETWEEN $3 AND $4\n\n                UNION ALL\n\n                SELECT ch.debet_sub_schet\n                FROM document_vnutr_peremesh_jur7 d\n                JOIN document_vnutr_peremesh_jur7_child ch ON ch.document_vnutr_peremesh_jur7_id = d.id\n                JOIN users AS u ON u.id = d.user_id \n                JOIN regions AS r ON r.id = u.region_id\n                JOIN main_schet AS m ON m.id = d.main_schet_id\n                WHERE m.spravochnik_budjet_name_id = $1\n                    AND  r.id = $2\n                    AND d.doc_date BETWEEN $3 AND $4\n            ); \n        ";
              _context6.next = 3;
              return db.query(query, params);
            case 3:
              result = _context6.sent;
              return _context6.abrupt("return", result);
            case 5:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      function getDebetSubSchetsForCap(_x7) {
        return _getDebetSubSchetsForCap.apply(this, arguments);
      }
      return getDebetSubSchetsForCap;
    }()
  }, {
    key: "getDebetSubSchetSumma",
    value: function () {
      var _getDebetSubSchetSumma = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(params) {
        var query, result;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              query = "--sql\n            SELECT COALESCE(SUM(summa_s_nds), 0)::FLOAt AS summa \n            FROM (\n                SELECT ch.summa_s_nds, ch.debet_sub_schet\n            FROM document_rasxod_jur7 d\n            JOIN document_rasxod_jur7_child ch ON ch.document_rasxod_jur7_id = d.id\n            JOIN users AS u ON u.id = d.user_id \n            JOIN regions AS r ON r.id = u.region_id\n            JOIN main_schet AS m ON m.id = d.main_schet_id\n            WHERE m.spravochnik_budjet_name_id = $1\n                AND  r.id = $2\n                AND d.doc_date BETWEEN $3 AND $4\n\n            UNION ALL\n\n            SELECT ch.summa_s_nds, ch.debet_sub_schet\n            FROM document_vnutr_peremesh_jur7 d\n            JOIN document_vnutr_peremesh_jur7_child ch ON ch.document_vnutr_peremesh_jur7_id = d.id\n            JOIN users AS u ON u.id = d.user_id \n            JOIN regions AS r ON r.id = u.region_id\n            JOIN main_schet AS m ON m.id = d.main_schet_id\n            WHERE m.spravochnik_budjet_name_id = $1\n                AND  r.id = $2\n                AND d.doc_date BETWEEN $3 AND $4\n            )\n            WHERE debet_sub_schet = $5;\n        ";
              _context7.next = 3;
              return db.query(query, params);
            case 3:
              result = _context7.sent;
              return _context7.abrupt("return", result[0].summa);
            case 5:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      }));
      function getDebetSubSchetSumma(_x8) {
        return _getDebetSubSchetSumma.apply(this, arguments);
      }
      return getDebetSubSchetSumma;
    }()
  }, {
    key: "getKreditSubSchetsForCap",
    value: function () {
      var _getKreditSubSchetsForCap = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(params) {
        var query, result;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              query = "--sql\n            SELECT DISTINCT kredit_sub_schet  \n            FROM (\n                SELECT ch.kredit_sub_schet\n                FROM document_rasxod_jur7 d\n                JOIN document_rasxod_jur7_child ch ON ch.document_rasxod_jur7_id = d.id\n                JOIN users AS u ON u.id = d.user_id \n                JOIN regions AS r ON r.id = u.region_id\n                JOIN main_schet AS m ON m.id = d.main_schet_id\n                WHERE m.spravochnik_budjet_name_id = $1\n                    AND  r.id = $2\n                    AND d.doc_date BETWEEN $3 AND $4\n\n                UNION ALL\n\n                SELECT ch.kredit_sub_schet\n                FROM document_vnutr_peremesh_jur7 d\n                JOIN document_vnutr_peremesh_jur7_child ch ON ch.document_vnutr_peremesh_jur7_id = d.id\n                JOIN users AS u ON u.id = d.user_id \n                JOIN regions AS r ON r.id = u.region_id\n                JOIN main_schet AS m ON m.id = d.main_schet_id\n                WHERE m.spravochnik_budjet_name_id = $1\n                    AND  r.id = $2\n                    AND d.doc_date BETWEEN $3 AND $4\n            ); \n        ";
              _context8.next = 3;
              return db.query(query, params);
            case 3:
              result = _context8.sent;
              return _context8.abrupt("return", result);
            case 5:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      }));
      function getKreditSubSchetsForCap(_x9) {
        return _getKreditSubSchetsForCap.apply(this, arguments);
      }
      return getKreditSubSchetsForCap;
    }()
  }, {
    key: "getKreditSubSchetSumma",
    value: function () {
      var _getKreditSubSchetSumma = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(params) {
        var query, result;
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              query = "--sql\n            SELECT COALESCE(SUM(summa_s_nds), 0)::FLOAt AS summa \n            FROM (\n                SELECT ch.summa_s_nds, ch.kredit_sub_schet\n            FROM document_rasxod_jur7 d\n            JOIN document_rasxod_jur7_child ch ON ch.document_rasxod_jur7_id = d.id\n            JOIN users AS u ON u.id = d.user_id \n            JOIN regions AS r ON r.id = u.region_id\n            JOIN main_schet AS m ON m.id = d.main_schet_id\n            WHERE m.spravochnik_budjet_name_id = $1\n                AND  r.id = $2\n                AND d.doc_date BETWEEN $3 AND $4\n\n            UNION ALL\n\n            SELECT ch.summa_s_nds, ch.kredit_sub_schet\n            FROM document_vnutr_peremesh_jur7 d\n            JOIN document_vnutr_peremesh_jur7_child ch ON ch.document_vnutr_peremesh_jur7_id = d.id\n            JOIN users AS u ON u.id = d.user_id \n            JOIN regions AS r ON r.id = u.region_id\n            JOIN main_schet AS m ON m.id = d.main_schet_id\n            WHERE m.spravochnik_budjet_name_id = $1\n                AND  r.id = $2\n                AND d.doc_date BETWEEN $3 AND $4\n            )\n            WHERE kredit_sub_schet = $5;\n        ";
              _context9.next = 3;
              return db.query(query, params);
            case 3:
              result = _context9.sent;
              return _context9.abrupt("return", result[0].summa);
            case 5:
            case "end":
              return _context9.stop();
          }
        }, _callee9);
      }));
      function getKreditSubSchetSumma(_x10) {
        return _getKreditSubSchetSumma.apply(this, arguments);
      }
      return getKreditSubSchetSumma;
    }()
  }, {
    key: "getIznosSummaByProvodkaSubSchet",
    value: function () {
      var _getIznosSummaByProvodkaSubSchet = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(params) {
        var query, result;
        return _regeneratorRuntime().wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              query = "\n            SELECT \n                g.provodka_subschet,\n                COALESCE(SUM(i.iznos_summa), 0)::FLOAT AS summa\n            FROM iznos_tovar_jur7 i\n            JOIN naimenovanie_tovarov_jur7 p ON i.naimenovanie_tovarov_jur7_id = p.id\n            JOIN group_jur7 AS g ON g.id = p.group_jur7_id\n            JOIN users AS u ON u.id = i.user_id \n            JOIN regions AS r ON r.id = u.region_id\n            WHERE i.budjet_id = $1\n                AND r.id = $2\n                AND i.full_date BETWEEN $3 AND $4\n            GROUP BY g.provodka_subschet\n        ";
              _context10.next = 3;
              return db.query(query, params);
            case 3:
              result = _context10.sent;
              return _context10.abrupt("return", result);
            case 5:
            case "end":
              return _context10.stop();
          }
        }, _callee10);
      }));
      function getIznosSummaByProvodkaSubSchet(_x11) {
        return _getIznosSummaByProvodkaSubSchet.apply(this, arguments);
      }
      return getIznosSummaByProvodkaSubSchet;
    }()
  }, {
    key: "getSchetsForBackCap",
    value: function () {
      var _getSchetsForBackCap = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(params) {
        var query, result;
        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              query = "--sql\n            SELECT \n                jsonb_agg(DISTINCT jsonb_build_object('schet', debet_schet)) AS debet_schets,\n                jsonb_agg(DISTINCT jsonb_build_object('schet', kredit_schet)) AS kredit_schets\n            FROM (\n                SELECT ch.debet_schet, ch.kredit_schet\n                FROM document_rasxod_jur7 d\n                JOIN document_rasxod_jur7_child ch ON ch.document_rasxod_jur7_id = d.id\n                JOIN users AS u ON u.id = d.user_id \n                JOIN regions AS r ON r.id = u.region_id\n                JOIN main_schet AS m ON m.id = d.main_schet_id\n                WHERE m.spravochnik_budjet_name_id = $1\n                    AND r.id = $2\n                    AND d.doc_date BETWEEN $3 AND $4\n    \n                UNION ALL\n    \n                SELECT ch.debet_schet, ch.kredit_schet\n                FROM document_vnutr_peremesh_jur7 d\n                JOIN document_vnutr_peremesh_jur7_child ch ON ch.document_vnutr_peremesh_jur7_id = d.id\n                JOIN users AS u ON u.id = d.user_id \n                JOIN regions AS r ON r.id = u.region_id\n                JOIN main_schet AS m ON m.id = d.main_schet_id\n                WHERE m.spravochnik_budjet_name_id = $1\n                    AND r.id = $2\n                    AND d.doc_date BETWEEN $3 AND $4\n    \n                UNION ALL \n    \n                SELECT g.provodka_debet AS debet_schet, g.provodka_kredit AS kredit_schet\n                FROM iznos_tovar_jur7 i\n                JOIN naimenovanie_tovarov_jur7 p ON i.naimenovanie_tovarov_jur7_id = p.id\n                JOIN group_jur7 AS g ON g.id = p.group_jur7_id\n                JOIN users AS u ON u.id = i.user_id \n                JOIN regions AS r ON r.id = u.region_id\n                WHERE i.budjet_id = $1\n                    AND r.id = $2\n                    AND i.full_date BETWEEN $3 AND $4\n            ); \n        ";
              _context11.next = 3;
              return db.query(query, params);
            case 3:
              result = _context11.sent;
              return _context11.abrupt("return", result[0]);
            case 5:
            case "end":
              return _context11.stop();
          }
        }, _callee11);
      }));
      function getSchetsForBackCap(_x12) {
        return _getSchetsForBackCap.apply(this, arguments);
      }
      return getSchetsForBackCap;
    }()
  }, {
    key: "getBackCapSchetSumma",
    value: function () {
      var _getBackCapSchetSumma = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12(params, columnName) {
        var filter, query, result;
        return _regeneratorRuntime().wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              filter = "".concat(columnName, " = $5");
              query = "--sql\n            SELECT COALESCE(SUM(summa_s_nds), 0)::FLOAt AS summa \n            FROM (\n                SELECT ch.summa_s_nds, ch.debet_schet, ch.kredit_schet\n            FROM document_rasxod_jur7 d\n            JOIN document_rasxod_jur7_child ch ON ch.document_rasxod_jur7_id = d.id\n            JOIN users AS u ON u.id = d.user_id \n            JOIN regions AS r ON r.id = u.region_id\n            JOIN main_schet AS m ON m.id = d.main_schet_id\n            WHERE m.spravochnik_budjet_name_id = $1\n                AND  r.id = $2\n                AND d.doc_date BETWEEN $3 AND $4\n\n            UNION ALL\n\n            SELECT ch.summa_s_nds, ch.debet_schet, ch.kredit_schet\n            FROM document_vnutr_peremesh_jur7 d\n            JOIN document_vnutr_peremesh_jur7_child ch ON ch.document_vnutr_peremesh_jur7_id = d.id\n            JOIN users AS u ON u.id = d.user_id \n            JOIN regions AS r ON r.id = u.region_id\n            JOIN main_schet AS m ON m.id = d.main_schet_id\n            WHERE m.spravochnik_budjet_name_id = $1\n                AND  r.id = $2\n                AND d.doc_date BETWEEN $3 AND $4\n            \n            UNION ALL \n\n                SELECT  i.iznos_summa AS summa_s_nds, g.provodka_debet AS debet_schet, g.provodka_kredit AS kredit_schet\n                FROM iznos_tovar_jur7 i\n                JOIN naimenovanie_tovarov_jur7 p ON i.naimenovanie_tovarov_jur7_id = p.id\n                JOIN group_jur7 AS g ON g.id = p.group_jur7_id\n                JOIN users AS u ON u.id = i.user_id \n                JOIN regions AS r ON r.id = u.region_id\n                WHERE i.budjet_id = $1\n                    AND r.id = $2\n                    AND i.full_date BETWEEN $3 AND $4\n            )\n            WHERE ".concat(filter, ";\n        ");
              _context12.next = 4;
              return db.query(query, params);
            case 4:
              result = _context12.sent;
              return _context12.abrupt("return", result[0].summa);
            case 6:
            case "end":
              return _context12.stop();
          }
        }, _callee12);
      }));
      function getBackCapSchetSumma(_x13, _x14) {
        return _getBackCapSchetSumma.apply(this, arguments);
      }
      return getBackCapSchetSumma;
    }()
  }, {
    key: "getKolSumma",
    value: function () {
      var _getKolSumma = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee13(params) {
        var date,
          dates,
          date_filter,
          dates_filter,
          query,
          result,
          _args13 = arguments;
        return _regeneratorRuntime().wrap(function _callee13$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              date = _args13.length > 1 && _args13[1] !== undefined ? _args13[1] : null;
              dates = _args13.length > 2 && _args13[2] !== undefined ? _args13[2] : null;
              date_filter = "";
              dates_filter = "";
              if (date) {
                params.push(date);
                date_filter = "AND d.doc_date <= $".concat(params.length);
              }
              if (dates && dates.length > 0) {
                params.push(dates[0], dates[1]);
                dates_filter = "AND d.doc_date BETWEEN $".concat(params.length - 1, " AND $").concat(params.length);
              }
              query = "--sql\n            WITH prixod AS (\n                SELECT\n                    COALESCE(SUM(d_ch.kol), 0) AS kol,\n                    COALESCE(SUM(d_ch.summa_s_nds), 0) AS summa\n                FROM document_prixod_jur7 AS d\n                JOIN document_prixod_jur7_child AS d_ch ON d.id = d_ch.document_prixod_jur7_id\n                WHERE d_ch.naimenovanie_tovarov_jur7_id = $1\n                    AND d.kimga_id = $2\n                    AND d.isdeleted = false\n                    ".concat(date_filter, "\n                    ").concat(dates_filter, "    \n            ),\n            prixod_internal AS (\n                SELECT\n                    COALESCE(SUM(d_ch.kol), 0) AS kol,\n                    COALESCE(SUM(d_ch.summa), 0) AS summa\n                FROM document_vnutr_peremesh_jur7 AS d\n                JOIN document_vnutr_peremesh_jur7_child AS d_ch ON d.id = d_ch.document_vnutr_peremesh_jur7_id\n                WHERE d_ch.naimenovanie_tovarov_jur7_id = $1\n                    AND d.kimga_id = $2\n                    AND d.isdeleted = false\n                    ").concat(date_filter, "\n                    ").concat(dates_filter, "    \n            ),\n            rasxod AS (\n                SELECT\n                    COALESCE(SUM(d_ch.kol), 0) AS kol,\n                    COALESCE(SUM(d_ch.summa), 0) AS summa\n                FROM document_rasxod_jur7 AS d\n                JOIN document_rasxod_jur7_child AS d_ch ON d.id = d_ch.document_rasxod_jur7_id\n                WHERE d_ch.naimenovanie_tovarov_jur7_id = $1\n                    AND d.kimdan_id = $2\n                    AND d.isdeleted = false\n                    ").concat(date_filter, "\n                    ").concat(dates_filter, "    \n            ),\n            rasxod_internal AS (\n                SELECT\n                    COALESCE(SUM(d_ch.kol), 0) AS kol,\n                    COALESCE(SUM(d_ch.summa), 0) AS summa\n                FROM document_vnutr_peremesh_jur7 AS d\n                JOIN document_vnutr_peremesh_jur7_child AS d_ch ON d.id = d_ch.document_vnutr_peremesh_jur7_id\n                WHERE d_ch.naimenovanie_tovarov_jur7_id = $1\n                    AND d.kimdan_id = $2\n                    AND d.isdeleted = false\n                    ").concat(date_filter, "\n                    ").concat(dates_filter, "    \n            )\n            SELECT\n                (COALESCE(p.kol, 0) + COALESCE(pi.kol, 0) - COALESCE(r.kol, 0) - COALESCE(ri.kol, 0))::FLOAT AS kol,\n                (COALESCE(r.kol, 0) - COALESCE(ri.kol, 0))::FLOAT AS kol_rasxod,\n                (COALESCE(p.kol, 0) + COALESCE(pi.kol, 0))::FLOAT AS kol_prixod,\n                (COALESCE(p.summa, 0) + COALESCE(pi.summa, 0) - COALESCE(r.summa, 0) - COALESCE(ri.summa, 0))::FLOAT AS summa,\n                (COALESCE(p.summa, 0) + COALESCE(pi.summa, 0))::FLOAT AS summa_prixod,\n                (COALESCE(r.summa, 0) - COALESCE(ri.summa, 0))::FLOAT AS summa_rasxod\n            FROM\n                prixod p,\n                prixod_internal pi,\n                rasxod r,\n                rasxod_internal ri        \n        ");
              _context13.next = 9;
              return db.query(query, params);
            case 9:
              result = _context13.sent;
              return _context13.abrupt("return", result[0]);
            case 11:
            case "end":
              return _context13.stop();
          }
        }, _callee13);
      }));
      function getKolSumma(_x15) {
        return _getKolSumma.apply(this, arguments);
      }
      return getKolSumma;
    }()
  }, {
    key: "getPrixodInfo",
    value: function () {
      var _getPrixodInfo = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee14(params) {
        var query, result;
        return _regeneratorRuntime().wrap(function _callee14$(_context14) {
          while (1) switch (_context14.prev = _context14.next) {
            case 0:
              query = "\n            SELECT \n                dch.data_pereotsenka,\n                d.doc_num\n            FROM document_prixod_jur7_child dch\n            JOIN document_prixod_jur7 d ON d.id = dch.document_prixod_jur7_id \n            WHERE dch.naimenovanie_tovarov_jur7_id = $1 \n        ";
              _context14.next = 3;
              return db.query(query, params);
            case 3:
              result = _context14.sent;
              return _context14.abrupt("return", result[0]);
            case 5:
            case "end":
              return _context14.stop();
          }
        }, _callee14);
      }));
      function getPrixodInfo(_x16) {
        return _getPrixodInfo.apply(this, arguments);
      }
      return getPrixodInfo;
    }()
  }, {
    key: "getProducts",
    value: function () {
      var _getProducts = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee15(params) {
        var _result$, _result$2;
        var product_id,
          search,
          product_filter,
          search_filter,
          query,
          result,
          _args15 = arguments;
        return _regeneratorRuntime().wrap(function _callee15$(_context15) {
          while (1) switch (_context15.prev = _context15.next) {
            case 0:
              product_id = _args15.length > 1 && _args15[1] !== undefined ? _args15[1] : null;
              search = _args15.length > 2 && _args15[2] !== undefined ? _args15[2] : null;
              product_filter = "";
              search_filter = "";
              if (product_id) {
                params.push(product_id);
                product_filter = "AND n.id = $".concat(params.length);
              }
              if (search) {
                params.push(search);
                search_filter = "AND n.name ILIKE '%' || $".concat(params.length, " || '%'");
              }
              query = "\n            WITH data AS (\n                SELECT \n                    n.id AS naimenovanie_tovarov_jur7_id, \n                    n.name AS naimenovanie_tovarov, \n                    n.edin,\n                    g.id AS group_jur7_id,\n                    g.name group_name, \n                    g.schet, \n                    g.iznos_foiz, \n                    g.provodka_debet, \n                    g.group_number, \n                    g.provodka_kredit,\n                    g.provodka_subschet,\n                    g.roman_numeral,\n                    g.pod_group,\n                    n.group_jur7_id,\n                    n.spravochnik_budjet_name_id,\n                    n.inventar_num,\n                    n.serial_num\n                FROM document_prixod_jur7_child ch\n                JOIN document_prixod_jur7 d ON d.id = ch.document_prixod_jur7_id\n                JOIN naimenovanie_tovarov_jur7 n ON n.id = ch.naimenovanie_tovarov_jur7_id\n                JOIN group_jur7 g ON g.id = n.group_jur7_id\n                WHERE d.kimga_id = $1 \n                    ".concat(product_filter, " \n                    ").concat(search_filter, "\n                    AND ch.isdeleted = false\n                OFFSET $2 LIMIT $3\n            )\n            SELECT \n                COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,\n                (\n                    SELECT \n                        COALESCE(COUNT(n.id))::FLOAT\n                    FROM document_prixod_jur7_child ch\n                    JOIN document_prixod_jur7 d ON d.id = ch.document_prixod_jur7_id\n                    JOIN naimenovanie_tovarov_jur7 n ON n.id = ch.naimenovanie_tovarov_jur7_id\n                    JOIN group_jur7 g ON g.id = n.group_jur7_id\n                    WHERE d.kimga_id = $1 \n                        ").concat(product_filter, "\n                        ").concat(search_filter, "\n                        AND ch.isdeleted = false\n                ) AS total\n            FROM data\n        ");
              _context15.next = 9;
              return db.query(query, params);
            case 9:
              result = _context15.sent;
              return _context15.abrupt("return", {
                products: ((_result$ = result[0]) === null || _result$ === void 0 ? void 0 : _result$.data) || [],
                total: ((_result$2 = result[0]) === null || _result$2 === void 0 ? void 0 : _result$2.total) || 0
              });
            case 11:
            case "end":
              return _context15.stop();
          }
        }, _callee15);
      }));
      function getProducts(_x17) {
        return _getProducts.apply(this, arguments);
      }
      return getProducts;
    }()
  }]);
}();