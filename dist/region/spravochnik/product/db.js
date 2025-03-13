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
exports.ProductDB = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "create",
    value: function () {
      var _create = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(params, client) {
        var query, result;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              query = "--sql\n            INSERT INTO naimenovanie_tovarov_jur7 (\n                user_id, \n                spravochnik_budjet_name_id, \n                name, \n                edin, \n                group_jur7_id, \n                inventar_num,\n                serial_num,\n                iznos,\n                created_at, \n                updated_at\n            ) \n            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) \n            RETURNING *\n        ";
              _context.next = 3;
              return client.query(query, params);
            case 3:
              result = _context.sent;
              return _context.abrupt("return", result.rows[0]);
            case 5:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function create(_x, _x2) {
        return _create.apply(this, arguments);
      }
      return create;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(params) {
        var search,
          iznos,
          search_filter,
          iznos_filter,
          query,
          result,
          _args2 = arguments;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              search = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : null;
              iznos = _args2.length > 2 ? _args2[2] : undefined;
              search_filter = "";
              iznos_filter = "";
              if (iznos) {
                params.push(iznos);
                iznos_filter = "AND iznos = $".concat(params.length);
              }
              if (search) {
                search_filter = "AND pr.name ILIKE '%' || $".concat(params.length + 1, " || '%'");
                params.push(search);
              }
              ;
              query = "--sql\n            WITH data AS (\n                SELECT \n                    pr.id, \n                    pr.name, \n                    pr.edin,\n                    pr.group_jur7_id,\n                    pr.spravochnik_budjet_name_id,\n                    pr.inventar_num,\n                    pr.serial_num,\n                    g.id AS group_jur7_id,\n                    g.name AS group_jur7_name,\n                    g.iznos_foiz,\n                    b.name AS spravochnik_budjet_name,\n                    pr.iznos,\n                    (g) AS group\n                FROM naimenovanie_tovarov_jur7 AS pr\n                JOIN users AS u ON u.id = pr.user_id\n                JOIN regions AS r ON r.id = u.region_id\n                JOIN group_jur7 AS g ON g.id = pr.group_jur7_id\n                LEFT JOIN spravochnik_budjet_name AS b ON b.id = pr.spravochnik_budjet_name_id \n                WHERE pr.isdeleted = false \n                    AND r.id = $1 \n                    ".concat(search_filter, "\n                    ").concat(iznos_filter, "\n                OFFSET $2 LIMIT $3\n            )\n            SELECT \n                COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,\n                (\n                    SELECT \n                        COALESCE(COUNT(pr.id), 0)::INTEGER  \n                    FROM naimenovanie_tovarov_jur7 AS pr\n                    JOIN users AS u ON u.id = pr.user_id\n                    JOIN regions AS r ON r.id = u.region_id\n                    WHERE pr.isdeleted = false \n                        AND r.id = $1 \n                        ").concat(search_filter, "\n                        ").concat(iznos_filter, "\n                ) AS total\n            FROM data\n        ");
              _context2.next = 10;
              return db.query(query, params);
            case 10:
              result = _context2.sent;
              return _context2.abrupt("return", result[0]);
            case 12:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function get(_x3) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
  }, {
    key: "getById",
    value: function () {
      var _getById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(params, isdeleted) {
        var ignore, query, result;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              ignore = 'AND pr.isdeleted = false';
              query = "--sql\n            SELECT \n                pr.id, \n                pr.name, \n                pr.edin,\n                g.id AS group_jur7_id,\n                g.name group_name, \n                g.schet, \n                g.iznos_foiz, \n                g.provodka_debet, \n                g.group_number, \n                g.provodka_kredit,\n                g.provodka_subschet,\n                g.roman_numeral,\n                g.pod_group,\n                pr.group_jur7_id,\n                pr.spravochnik_budjet_name_id,\n                pr.inventar_num,\n                pr.serial_num,\n                b.name AS spravochnik_budjet_name,\n                row_to_json(g) AS group\n            FROM naimenovanie_tovarov_jur7 AS pr\n            JOIN users AS u ON u.id = pr.user_id\n            JOIN regions AS r ON r.id = u.region_id\n            LEFT JOIN group_jur7 AS g ON g.id = pr.group_jur7_id\n            LEFT JOIN spravochnik_budjet_name AS b ON b.id = pr.spravochnik_budjet_name_id \n            WHERE r.id = $1 AND pr.id = $2  ".concat(isdeleted ? "" : ignore, "\n        ");
              _context3.next = 4;
              return db.query(query, params);
            case 4:
              result = _context3.sent;
              return _context3.abrupt("return", result[0]);
            case 6:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function getById(_x4, _x5) {
        return _getById.apply(this, arguments);
      }
      return getById;
    }()
  }, {
    key: "updateNaimenovanie",
    value: function () {
      var _updateNaimenovanie = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(params) {
        var query, result;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              query = "--sql\n            UPDATE naimenovanie_tovarov_jur7 \n            SET \n                name = $1, edin = $2, spravochnik_budjet_name_id = $3, \n                group_jur7_id = $4, inventar_num = $5, serial_num = $6, updated_at = $7\n            WHERE id = $8 AND isdeleted = false\n            RETURNING *\n        ";
              _context4.next = 3;
              return db.query(query, params);
            case 3:
              result = _context4.sent;
              return _context4.abrupt("return", result[0]);
            case 5:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function updateNaimenovanie(_x6) {
        return _updateNaimenovanie.apply(this, arguments);
      }
      return updateNaimenovanie;
    }()
  }, {
    key: "deleteNaimenovanie",
    value: function () {
      var _deleteNaimenovanie = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(params, client) {
        var query;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              query = "UPDATE naimenovanie_tovarov_jur7 SET isdeleted = true WHERE id = $1 AND isdeleted = false";
              _context5.next = 3;
              return client.query(query, params);
            case 3:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      function deleteNaimenovanie(_x7, _x8) {
        return _deleteNaimenovanie.apply(this, arguments);
      }
      return deleteNaimenovanie;
    }()
  }, {
    key: "getProductKol",
    value: function () {
      var _getProductKol = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(params, search, tovar_id, client) {
        var tovar_filter, search_filter, query, data;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              tovar_filter = '';
              search_filter = '';
              if (search) {
                search_filter = "AND pr.name ILIKE '%' || $".concat(params.length + 1, " || '%'");
                params.push(search);
              }
              if (tovar_id) {
                tovar_filter = "AND pr.id = $".concat(params.length + 1);
                params.push(tovar_id);
              }
              query = "--sql\n            WITH data AS (\n                SELECT \n                    pr.name, \n                    pr.id::INTEGER, \n                    pr.edin,\n                    pr.group_jur7_id,\n                    pr.inventar_num,\n                    pr.serial_num,\n                    g_j7.name AS group_jur7_name,\n                    pr.spravochnik_budjet_name_id,\n                    b.name AS spravochnik_budjet_name,\n                    TO_CHAR(d.doc_date, 'YYYY-MM-DD') AS doc_date,\n                    (d_ch.summa_s_nds / d_ch.kol)::FLOAT AS sena,\n                    (\n                        SELECT COALESCE(SUM(d_ch.kol), 0)\n                        FROM document_prixod_jur7 AS d\n                        JOIN document_prixod_jur7_child AS d_ch ON d.id = d_ch.document_prixod_jur7_id\n                        JOIN users AS u ON u.id = d.user_id \n                        JOIN regions AS r ON r.id = u.region_id\n                        WHERE r.id = $1 AND d_ch.naimenovanie_tovarov_jur7_id = pr.id AND d.kimga_id = $2 AND d.isdeleted = false\n                    )::FLOAT AS prixod1,\n                    (\n                        SELECT COALESCE(SUM(d_ch.kol), 0)\n                        FROM document_vnutr_peremesh_jur7 AS d\n                        JOIN document_vnutr_peremesh_jur7_child AS d_ch ON d.id = d_ch.document_vnutr_peremesh_jur7_id\n                        JOIN users AS u ON u.id = d.user_id \n                        JOIN regions AS r ON r.id = u.region_id\n                        WHERE r.id = $1 AND d_ch.naimenovanie_tovarov_jur7_id = pr.id AND d.kimga_id = $2 AND d.isdeleted = false\n                    )::FLOAT AS prixod2,\n                    (\n                        SELECT COALESCE(SUM(d_ch.kol), 0)\n                        FROM document_rasxod_jur7 AS d\n                        JOIN document_rasxod_jur7_child AS d_ch ON d.id = d_ch.document_rasxod_jur7_id\n                        JOIN users AS u ON u.id = d.user_id \n                        JOIN regions AS r ON r.id = u.region_id\n                        WHERE r.id = $1 AND d_ch.naimenovanie_tovarov_jur7_id = pr.id AND d.kimdan_id = $2 AND d.isdeleted = false\n                    )::FLOAT AS rasxod1,\n                    (\n                        SELECT COALESCE(SUM(d_ch.kol), 0)\n                        FROM document_vnutr_peremesh_jur7 AS d\n                        JOIN document_vnutr_peremesh_jur7_child AS d_ch ON d.id = d_ch.document_vnutr_peremesh_jur7_id\n                        JOIN users AS u ON u.id = d.user_id \n                        JOIN regions AS r ON r.id = u.region_id\n                        WHERE r.id = $1 AND d_ch.naimenovanie_tovarov_jur7_id = pr.id AND d.kimdan_id = $2 AND d.isdeleted = false\n                    )::FLOAT AS rasxod2\n                FROM naimenovanie_tovarov_jur7 AS pr\n                JOIN document_prixod_jur7_child AS d_ch ON d_ch.naimenovanie_tovarov_jur7_id = pr.id\n                JOIN document_prixod_jur7 AS d ON d_ch.document_prixod_jur7_id = d.id\n                JOIN users AS u ON u.id = pr.user_id\n                JOIN regions AS r ON r.id = u.region_id\n                JOIN group_jur7 AS g_j7 ON g_j7.id = pr.group_jur7_id\n                JOIN spravochnik_budjet_name AS b ON b.id = pr.spravochnik_budjet_name_id\n                WHERE pr.isdeleted = false AND r.id = $1 ".concat(tovar_filter, " ").concat(search_filter, " \n            )\n            SELECT *\n            FROM (\n                SELECT *, (prixod1 + prixod2 - rasxod1 - rasxod2)::FLOAT AS result\n                FROM data\n            ) AS subquery\n        ");
              if (!client) {
                _context6.next = 12;
                break;
              }
              _context6.next = 8;
              return client.query(query, params);
            case 8:
              data = _context6.sent;
              data = data.rows;
              _context6.next = 15;
              break;
            case 12:
              _context6.next = 14;
              return db.query(query, params);
            case 14:
              data = _context6.sent;
            case 15:
              return _context6.abrupt("return", data);
            case 16:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      function getProductKol(_x9, _x10, _x11, _x12) {
        return _getProductKol.apply(this, arguments);
      }
      return getProductKol;
    }()
  }]);
}();