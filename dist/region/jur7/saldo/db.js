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
exports.SaldoDB = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "cleanData",
    value: function () {
      var _cleanData = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(params, client) {
        var query1, query2;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              query1 = "UPDATE saldo_naimenovanie_jur7 SET isdeleted = true WHERE region_id = $1";
              query2 = "UPDATE saldo_date SET isdeleted = true WHERE region_id = $1";
              _context.next = 4;
              return client.query(query1, params);
            case 4:
              _context.next = 6;
              return client.query(query2, params);
            case 6:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function cleanData(_x, _x2) {
        return _cleanData.apply(this, arguments);
      }
      return cleanData;
    }()
  }, {
    key: "checkDoc",
    value: function () {
      var _checkDoc = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(params) {
        var query, data;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              query = "\n                SELECT \n                    d.id,\n                    d.doc_num,\n                    d.doc_date,\n                    'internal' AS type\n                FROM document_vnutr_peremesh_jur7 d\n                JOIN document_vnutr_peremesh_jur7_child ch ON d.id = ch.document_vnutr_peremesh_jur7_id\n                WHERE ch.naimenovanie_tovarov_jur7_id = $1\n                    AND d.isdeleted = false\n                    AND ch.isdeleted = false\n\n                UNION ALL\n\n                SELECT \n                    d.id,\n                    d.doc_num,\n                    d.doc_date,\n                    'prixod' AS type\n                FROM document_prixod_jur7 d\n                JOIN document_prixod_jur7_child ch ON d.id = ch.document_prixod_jur7_id\n                WHERE ch.naimenovanie_tovarov_jur7_id = $1\n                    AND d.isdeleted = false\n                    AND ch.isdeleted = false\n\n                UNION ALL\n\n                SELECT \n                    d.id,\n                    d.doc_num,\n                    d.doc_date,\n                    'rasxod' AS type\n                FROM document_rasxod_jur7 d\n                JOIN document_rasxod_jur7_child ch ON d.id = ch.document_rasxod_jur7_id\n                WHERE ch.naimenovanie_tovarov_jur7_id = $1\n                    AND d.isdeleted = false\n                    AND ch.isdeleted = false\n        ";
              _context2.next = 3;
              return db.query(query, params);
            case 3:
              data = _context2.sent;
              return _context2.abrupt("return", data);
            case 5:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function checkDoc(_x3) {
        return _checkDoc.apply(this, arguments);
      }
      return checkDoc;
    }()
  }, {
    key: "updateIznosSumma",
    value: function () {
      var _updateIznosSumma = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(params) {
        var query, data;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              query = "\n            UPDATE saldo_naimenovanie_jur7\n            SET \n                eski_iznos_summa = $1,\n                iznos_summa = $1 + month_iznos_summa\n            WHERE id = $2\n                AND isdeleted = false\n                AND iznos = true\n            RETURNING *\n        ";
              _context3.next = 3;
              return db.query(query, params);
            case 3:
              data = _context3.sent;
              return _context3.abrupt("return", data[0]);
            case 5:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function updateIznosSumma(_x4) {
        return _updateIznosSumma.apply(this, arguments);
      }
      return updateIznosSumma;
    }()
  }, {
    key: "createSaldoDate",
    value: function () {
      var _createSaldoDate = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(params, client) {
        var query, result;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              query = "\n            INSERT INTO saldo_date(\n                region_id, \n                year, \n                month,\n                created_at,\n                updated_at\n            ) \n            VALUES($1, $2, $3, $4, $5) RETURNING *\n        ";
              _context4.next = 3;
              return client.query(query, params);
            case 3:
              result = _context4.sent;
              return _context4.abrupt("return", result.rows[0]);
            case 5:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function createSaldoDate(_x5, _x6) {
        return _createSaldoDate.apply(this, arguments);
      }
      return createSaldoDate;
    }()
  }, {
    key: "getSaldoDate",
    value: function () {
      var _getSaldoDate = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(params, client) {
        var _db, query, data, response;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _db = client || db;
              query = "\n            SELECT \n                DISTINCT year, month\n            FROM saldo_naimenovanie_jur7 \n            WHERE region_id = $1\n                AND date_saldo > $2\n                AND isdeleted = false\n            ORDER BY year, month\n        ";
              _context5.next = 4;
              return _db.query(query, params);
            case 4:
              data = _context5.sent;
              response = client ? data.rows : data;
              return _context5.abrupt("return", response);
            case 7:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      function getSaldoDate(_x7, _x8) {
        return _getSaldoDate.apply(this, arguments);
      }
      return getSaldoDate;
    }()
  }, {
    key: "getFirstSaldoDate",
    value: function () {
      var _getFirstSaldoDate = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(params) {
        var query, result;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              query = "\n           SELECT \n                DISTINCT TO_CHAR(date_saldo, 'YYYY-MM-DD') AS date_saldo\n            FROM saldo_naimenovanie_jur7 \n            WHERE region_id = $1\n                AND isdeleted = false\n            ORDER BY date_saldo\n            LIMIT 1\n        ";
              _context6.next = 3;
              return db.query(query, params);
            case 3:
              result = _context6.sent;
              return _context6.abrupt("return", result[0]);
            case 5:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      function getFirstSaldoDate(_x9) {
        return _getFirstSaldoDate.apply(this, arguments);
      }
      return getFirstSaldoDate;
    }()
  }, {
    key: "getEndSaldoDate",
    value: function () {
      var _getEndSaldoDate = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(params) {
        var query, result;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              query = "\n           SELECT \n                DISTINCT TO_CHAR(date_saldo, 'YYYY-MM-DD') AS date_saldo\n            FROM saldo_naimenovanie_jur7 \n            WHERE region_id = $1\n                AND isdeleted = false\n            ORDER BY date_saldo DESC \n            LIMIT 1\n        ";
              _context7.next = 3;
              return db.query(query, params);
            case 3:
              result = _context7.sent;
              return _context7.abrupt("return", result[0]);
            case 5:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      }));
      function getEndSaldoDate(_x10) {
        return _getEndSaldoDate.apply(this, arguments);
      }
      return getEndSaldoDate;
    }()
  }, {
    key: "getBlock",
    value: function () {
      var _getBlock = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(params) {
        var query, data;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              query = "\n            SELECT \n                DISTINCT year, month\n            FROM saldo_date \n            WHERE region_id = $1\n                AND isdeleted = false\n            ORDER BY year, month\n        ";
              _context8.next = 3;
              return db.query(query, params);
            case 3:
              data = _context8.sent;
              return _context8.abrupt("return", data);
            case 5:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      }));
      function getBlock(_x11) {
        return _getBlock.apply(this, arguments);
      }
      return getBlock;
    }()
  }, {
    key: "unblock",
    value: function () {
      var _unblock = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(params) {
        var query;
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              query = "UPDATE saldo_date SET isdeleted = true WHERE region_id = $1 AND year = $2 AND month = $3";
              _context9.next = 3;
              return db.query(query, params);
            case 3:
            case "end":
              return _context9.stop();
          }
        }, _callee9);
      }));
      function unblock(_x12) {
        return _unblock.apply(this, arguments);
      }
      return unblock;
    }()
  }, {
    key: "check",
    value: function () {
      var _check = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(params) {
        var year,
          month,
          year_filter,
          month_filter,
          query,
          result,
          _args10 = arguments;
        return _regeneratorRuntime().wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              year = _args10.length > 1 && _args10[1] !== undefined ? _args10[1] : null;
              month = _args10.length > 2 && _args10[2] !== undefined ? _args10[2] : null;
              year_filter = "";
              month_filter = "";
              if (year) {
                params.push(year);
                year_filter = "AND year = $".concat(params.length);
              }
              if (month) {
                params.push(month);
                month_filter = "AND month = $".concat(params.length);
              }
              query = "\n            SELECT\n                *\n            FROM saldo_naimenovanie_jur7 \n            WHERE region_id = $1 \n                AND  isdeleted = false \n                ".concat(year_filter, "\n                ").concat(month_filter, "  \n        ");
              _context10.next = 9;
              return db.query(query, params);
            case 9:
              result = _context10.sent;
              return _context10.abrupt("return", result);
            case 11:
            case "end":
              return _context10.stop();
          }
        }, _callee10);
      }));
      function check(_x13) {
        return _check.apply(this, arguments);
      }
      return check;
    }()
  }, {
    key: "getById",
    value: function () {
      var _getById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(params) {
        var isdeleted,
          iznos,
          query,
          result,
          _args11 = arguments;
        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              isdeleted = _args11.length > 1 && _args11[1] !== undefined ? _args11[1] : null;
              iznos = _args11.length > 2 && _args11[2] !== undefined ? _args11[2] : null;
              query = "\n            SELECT \n                s.*, \n                s.id::INTEGER,\n                s.sena::FLOAT,\n                s.summa::FLOAT,\n                s.iznos_summa::FLOAT,\n                s.kol::FLOAT,\n                s.naimenovanie_tovarov_jur7_id::INTEGER,\n                s.eski_iznos_summa::FLOAT,\n                s.region_id::INTEGER, \n                s.kimning_buynida AS responsible_id,\n                row_to_json(n) AS product,\n                n.name,\n                n.edin,\n                g.name AS group_jur7_name,\n                JSON_BUILD_OBJECT(\n                    'doc_num', s.doc_num,\n                    'doc_date', s.doc_date,\n                    'doc_id', s.prixod_id\n                ) AS prixod_data,\n                row_to_json(g) AS group,\n                row_to_json(jsh) AS responsible\n            FROM saldo_naimenovanie_jur7 s \n            JOIN users AS u ON u.id = s.user_id\n            JOIN regions AS r ON r.id = u.region_id\n            JOIN naimenovanie_tovarov_jur7 n ON n.id = s.naimenovanie_tovarov_jur7_id  \n            JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = s.kimning_buynida\n            JOIN group_jur7 g ON g.id = n.group_jur7_id  \n            WHERE r.id = $1 \n                AND s.id = $2\n                ".concat(!isdeleted ? 'AND s.isdeleted = false' : '', "\n                ").concat(!iznos ? '' : 'AND s.iznos = true', "\n        ");
              _context11.next = 5;
              return db.query(query, params);
            case 5:
              result = _context11.sent;
              return _context11.abrupt("return", result[0]);
            case 7:
            case "end":
              return _context11.stop();
          }
        }, _callee11);
      }));
      function getById(_x14) {
        return _getById.apply(this, arguments);
      }
      return getById;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12(params) {
        var responsible_id,
          search,
          product_id,
          group_id,
          iznos,
          responsible_filter,
          filter,
          product_filter,
          group_filter,
          iznos_filer,
          query,
          data,
          _args12 = arguments;
        return _regeneratorRuntime().wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              responsible_id = _args12.length > 1 && _args12[1] !== undefined ? _args12[1] : null;
              search = _args12.length > 2 && _args12[2] !== undefined ? _args12[2] : null;
              product_id = _args12.length > 3 && _args12[3] !== undefined ? _args12[3] : null;
              group_id = _args12.length > 4 && _args12[4] !== undefined ? _args12[4] : null;
              iznos = _args12.length > 5 && _args12[5] !== undefined ? _args12[5] : null;
              responsible_filter = "";
              filter = "";
              product_filter = "";
              group_filter = "";
              iznos_filer = "";
              if (product_id) {
                params.push(product_id);
                product_filter = "AND n.id = $".concat(params.length);
              }
              if (search) {
                params.push(search);
                filter = "AND (n.name ILIKE '%' || $".concat(params.length, " || '%' OR jsh.fio ILIKE '%' || $").concat(params.length, " || '%')");
              }
              if (responsible_id) {
                params.push(responsible_id);
                responsible_filter = "AND kimning_buynida = $".concat(params.length);
              }
              if (group_id) {
                params.push(group_id);
                group_filter = "AND g.id = $".concat(params.length);
              }
              if (iznos === 'true') {
                iznos_filer = "AND s.iznos = true";
              }
              query = "\n            WITH data AS (\n                SELECT \n                    s.*, \n                    s.id::INTEGER,\n                    s.sena::FLOAT,\n                    s.summa::FLOAT,\n                    s.kol::FLOAT,\n                    s.naimenovanie_tovarov_jur7_id::INTEGER,\n                    s.region_id::INTEGER, \n                    s.kimning_buynida AS responsible_id,\n                    s.eski_iznos_summa::FLOAT,\n                    row_to_json(n) AS product,\n                    n.name,\n                    n.edin,\n                    g.name AS group_jur7_name,\n                    JSON_BUILD_OBJECT(\n                        'doc_num', s.doc_num,\n                        'doc_date', s.doc_date,\n                        'doc_id', s.prixod_id\n                    ) AS prixod_data,\n                    row_to_json(g) AS group,\n                    row_to_json(jsh) AS responsible,\n                    row_to_json(p) AS podraz,\n                    JSON_BUILD_OBJECT(\n                        'kol', s.kol,\n                        'sena', s.sena,\n                        'summa', s.summa,\n                        'iznos_summa', s.iznos_summa,\n                        'iznos_schet', s.iznos_schet,\n                        'iznos_sub_schet', s.iznos_sub_schet\n                    ) AS from\n            FROM saldo_naimenovanie_jur7 s \n            JOIN users AS u ON u.id = s.user_id\n            JOIN regions AS r ON r.id = u.region_id\n            JOIN naimenovanie_tovarov_jur7 n ON n.id = s.naimenovanie_tovarov_jur7_id  \n            JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = s.kimning_buynida\n            JOIN spravochnik_podrazdelenie_jur7 p ON p.id = jsh.spravochnik_podrazdelenie_jur7_id  \n            JOIN group_jur7 g ON g.id = n.group_jur7_id  \n            WHERE r.id = $1 \n                AND s.year = $2\n                AND s.month = $3 \n                AND s.isdeleted = false\n                ".concat(responsible_filter, " \n                ").concat(filter, "\n                ").concat(product_filter, "\n                ").concat(group_filter, "\n                ").concat(iznos_filer, "\n                OFFSET $4 LIMIT $5\n            )\n            SELECT \n                COALESCE(JSON_AGG(row_to_json(data)), '[]'::JSON) AS data,\n                (\n                    SELECT \n                        COALESCE(COUNT(s.id), 0)::INTEGER\n                    FROM saldo_naimenovanie_jur7 s \n                    JOIN users AS u ON u.id = s.user_id\n                    JOIN regions AS r ON r.id = u.region_id\n                    JOIN naimenovanie_tovarov_jur7 n ON n.id = s.naimenovanie_tovarov_jur7_id  \n                    JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = s.kimning_buynida\n                    JOIN group_jur7 g ON g.id = n.group_jur7_id\n                    WHERE r.id = $1\n                        AND s.year = $2 \n                        AND s.month = $3 \n                        AND s.isdeleted = false\n                        ").concat(responsible_filter, " \n                        ").concat(filter, "\n                        ").concat(product_filter, "\n                        ").concat(group_filter, "\n                        ").concat(iznos_filer, "\n                ) AS total\n            FROM data\n        ");
              _context12.next = 18;
              return db.query(query, params);
            case 18:
              data = _context12.sent;
              return _context12.abrupt("return", data[0]);
            case 20:
            case "end":
              return _context12.stop();
          }
        }, _callee12);
      }));
      function get(_x15) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
  }, {
    key: "getKolAndSumma",
    value: function () {
      var _getKolAndSumma = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee13(params) {
        var start,
          end,
          responsible_id,
          prixod_id,
          start_filter,
          end_filter,
          between_filter,
          responsible_filter,
          prixod_filter,
          query,
          result,
          _args13 = arguments;
        return _regeneratorRuntime().wrap(function _callee13$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              start = _args13.length > 1 && _args13[1] !== undefined ? _args13[1] : null;
              end = _args13.length > 2 && _args13[2] !== undefined ? _args13[2] : null;
              responsible_id = _args13.length > 3 && _args13[3] !== undefined ? _args13[3] : null;
              prixod_id = _args13.length > 4 && _args13[4] !== undefined ? _args13[4] : null;
              start_filter = "";
              end_filter = "";
              between_filter = "";
              responsible_filter = "";
              prixod_filter = "";
              if (start && end) {
                params.push(start, end);
                between_filter = "AND d.doc_date BETWEEN $".concat(params.length - 1, " AND $").concat(params.length);
              } else if (start) {
                params.push(start);
                start_filter = "AND d.doc_date < $".concat(params.length);
              } else if (end) {
                params.push(end);
                end_filter = "AND d.doc_date <= $".concat(params.length);
              }
              if (prixod_id) {
                params.push(prixod_id);
                prixod_filter = "AND d.id = $".concat(params.length);
              }
              if (responsible_id) {
                params.push(responsible_id);
                responsible_filter = "AND jsh.id = $".concat(params.length);
              }
              query = "--sql\n            WITH prixod AS (\n                SELECT\n                    COALESCE(SUM(ch.kol), 0)::FLOAT AS kol,\n                    COALESCE(SUM(ch.summa_s_nds), 0)::FLOAT AS summa,\n                    COALESCE(SUM(ch.iznos_summa), 0)::FLOAT AS iznos_summa\n                FROM document_prixod_jur7 d\n                JOIN document_prixod_jur7_child ch ON d.id = ch.document_prixod_jur7_id\n                JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimga_id\n                WHERE ch.naimenovanie_tovarov_jur7_id = $1\n                    AND d.isdeleted = false\n                    AND ch.isdeleted = false\n                    ".concat(prixod_filter, "\n                    ").concat(start_filter, "\n                    ").concat(end_filter, "\n                    ").concat(between_filter, "\n                    ").concat(responsible_filter, "\n            ),\n            prixod_internal AS (\n                SELECT\n                    COALESCE(SUM(ch.kol), 0)::FLOAT AS kol,\n                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,\n                    COALESCE(SUM(ch.iznos_summa), 0)::FLOAT AS iznos_summa\n                FROM document_vnutr_peremesh_jur7 d\n                JOIN document_vnutr_peremesh_jur7_child ch ON d.id = ch.document_vnutr_peremesh_jur7_id\n                JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimga_id\n                WHERE ch.naimenovanie_tovarov_jur7_id = $1\n                    AND d.isdeleted = false\n                    AND ch.isdeleted = false\n                    ").concat(prixod_filter, "\n                    ").concat(start_filter, "\n                    ").concat(end_filter, "\n                    ").concat(between_filter, "\n                    ").concat(responsible_filter, "\n            ),\n            rasxod AS (\n                SELECT\n                    COALESCE(SUM(ch.kol), 0)::FLOAT AS kol,\n                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,\n                    COALESCE(SUM(ch.iznos_summa), 0)::FLOAT AS iznos_summa\n                FROM document_rasxod_jur7 d\n                JOIN document_rasxod_jur7_child ch ON d.id = ch.document_rasxod_jur7_id\n                JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimdan_id\n                WHERE ch.naimenovanie_tovarov_jur7_id = $1\n                    AND d.isdeleted = false\n                    AND ch.isdeleted = false\n                    ").concat(start_filter, "\n                    ").concat(end_filter, "\n                    ").concat(between_filter, "\n                    ").concat(responsible_filter, "\n            ),\n            rasxod_internal AS (\n                SELECT\n                    COALESCE(SUM(ch.kol), 0)::FLOAT AS kol,\n                    COALESCE(SUM(ch.summa), 0)::FLOAT AS summa,\n                    COALESCE(SUM(ch.iznos_summa), 0)::FLOAT AS iznos_summa\n                FROM document_vnutr_peremesh_jur7 d\n                JOIN document_vnutr_peremesh_jur7_child ch ON d.id = ch.document_vnutr_peremesh_jur7_id\n                JOIN spravochnik_javobgar_shaxs_jur7 jsh ON jsh.id = d.kimdan_id\n                WHERE ch.naimenovanie_tovarov_jur7_id = $1\n                    AND d.isdeleted = false\n                    AND ch.isdeleted = false\n                    ").concat(start_filter, "\n                    ").concat(end_filter, "\n                    ").concat(between_filter, "\n                    ").concat(responsible_filter, "\n            )\n            SELECT\n                (COALESCE(p.kol, 0) + COALESCE(pi.kol, 0) - COALESCE(r.kol, 0) - COALESCE(ri.kol, 0))::FLOAT AS kol,\n                (COALESCE(r.kol, 0) - COALESCE(ri.kol, 0))::FLOAT AS kol_rasxod,\n                (COALESCE(p.kol, 0) + COALESCE(pi.kol, 0))::FLOAT AS kol_prixod,\n                (COALESCE(p.summa, 0) + COALESCE(pi.summa, 0) - COALESCE(r.summa, 0) - COALESCE(ri.summa, 0))::FLOAT AS summa,\n                (COALESCE(p.summa, 0) + COALESCE(pi.summa, 0))::FLOAT AS summa_prixod,\n                (COALESCE(r.summa, 0) - COALESCE(ri.summa, 0))::FLOAT AS summa_rasxod,\n                (COALESCE(r.iznos_summa, 0) - COALESCE(ri.iznos_summa, 0))::FLOAT AS iznos_rasxod,\n                (COALESCE(p.iznos_summa, 0) + COALESCE(pi.iznos_summa, 0))::FLOAT AS iznos_prixod,\n                (COALESCE(p.iznos_summa, 0) + COALESCE(pi.iznos_summa, 0) - COALESCE(r.iznos_summa, 0) - COALESCE(ri.iznos_summa, 0))::FLOAT AS iznos_summa\n            FROM\n                prixod p,\n                prixod_internal pi,\n                rasxod r,\n                rasxod_internal ri\n        ");
              _context13.next = 15;
              return db.query(query, params);
            case 15:
              result = _context13.sent;
              return _context13.abrupt("return", result[0]);
            case 17:
            case "end":
              return _context13.stop();
          }
        }, _callee13);
      }));
      function getKolAndSumma(_x16) {
        return _getKolAndSumma.apply(this, arguments);
      }
      return getKolAndSumma;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee14(params, client) {
        var query;
        return _regeneratorRuntime().wrap(function _callee14$(_context14) {
          while (1) switch (_context14.prev = _context14.next) {
            case 0:
              query = "UPDATE saldo_naimenovanie_jur7 SET isdeleted = true WHERE year = $1 AND month = $2 AND region_id = $3"; // const query2 = `UPDATE iznos_tovar_jur7 SET isdeleted = true WHERE year = $1 AND month = $2 AND region_id = $3`;
              // await client.query(query2, params);
              _context14.next = 3;
              return client.query(query, params);
            case 3:
            case "end":
              return _context14.stop();
          }
        }, _callee14);
      }));
      function _delete(_x17, _x18) {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }()
  }, {
    key: "deleteById",
    value: function () {
      var _deleteById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee15(params, client) {
        var _db, query, data;
        return _regeneratorRuntime().wrap(function _callee15$(_context15) {
          while (1) switch (_context15.prev = _context15.next) {
            case 0:
              _db = client || db;
              query = "UPDATE saldo_naimenovanie_jur7 SET isdeleted = true WHERE id = $1";
              _context15.next = 4;
              return _db.query(query, params);
            case 4:
              data = _context15.sent;
              return _context15.abrupt("return", data.rows[0] || data[0]);
            case 6:
            case "end":
              return _context15.stop();
          }
        }, _callee15);
      }));
      function deleteById(_x19, _x20) {
        return _deleteById.apply(this, arguments);
      }
      return deleteById;
    }()
  }, {
    key: "create",
    value: function () {
      var _create = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee16(params, client) {
        var query, result;
        return _regeneratorRuntime().wrap(function _callee16$(_context16) {
          while (1) switch (_context16.prev = _context16.next) {
            case 0:
              query = "--sql\n            INSERT INTO saldo_naimenovanie_jur7 (\n                user_id,\n                naimenovanie_tovarov_jur7_id,\n                kol,\n                sena,\n                summa,\n                month,\n                year,\n                date_saldo,\n                doc_date,\n                doc_num,\n                kimning_buynida,\n                region_id,\n                prixod_id,\n                iznos,\n                iznos_summa,\n                iznos_schet,\n                iznos_sub_schet,\n                eski_iznos_summa,\n                iznos_start,\n                month_iznos_summa,\n                created_at,\n                updated_at\n            )\n            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING *\n        ";
              _context16.next = 3;
              return client.query(query, params);
            case 3:
              result = _context16.sent;
              return _context16.abrupt("return", result.rows[0]);
            case 5:
            case "end":
              return _context16.stop();
          }
        }, _callee16);
      }));
      function create(_x21, _x22) {
        return _create.apply(this, arguments);
      }
      return create;
    }()
  }, {
    key: "getProductPrixod",
    value: function () {
      var _getProductPrixod = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee17(params) {
        var query, result;
        return _regeneratorRuntime().wrap(function _callee17$(_context17) {
          while (1) switch (_context17.prev = _context17.next) {
            case 0:
              query = "--sql\n            SELECT\n                d.id,\n                TO_CHAR(ch.data_pereotsenka, 'YYYY-MM-DD') AS doc_date,\n                d.doc_num, \n                'prixod' AS type\n            FROM document_prixod_jur7_child ch\n            JOIN document_prixod_jur7 d ON ch.document_prixod_jur7_id = d.id\n            WHERE ch.naimenovanie_tovarov_jur7_id = $1 \n        ";
              _context17.next = 3;
              return db.query(query, params);
            case 3:
              result = _context17.sent;
              return _context17.abrupt("return", result[0] || null);
            case 5:
            case "end":
              return _context17.stop();
          }
        }, _callee17);
      }));
      function getProductPrixod(_x23) {
        return _getProductPrixod.apply(this, arguments);
      }
      return getProductPrixod;
    }()
  }, {
    key: "deleteByPrixodId",
    value: function () {
      var _deleteByPrixodId = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee18(params, client) {
        var query;
        return _regeneratorRuntime().wrap(function _callee18$(_context18) {
          while (1) switch (_context18.prev = _context18.next) {
            case 0:
              query = "UPDATE saldo_naimenovanie_jur7 SET isdeleted = true WHERE prixod_id = $1";
              _context18.next = 3;
              return client.query(query, params);
            case 3:
            case "end":
              return _context18.stop();
          }
        }, _callee18);
      }));
      function deleteByPrixodId(_x24, _x25) {
        return _deleteByPrixodId.apply(this, arguments);
      }
      return deleteByPrixodId;
    }()
  }]);
}();