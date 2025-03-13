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
exports.ContractDB = /*#__PURE__*/function () {
  function _class() {
    _classCallCheck(this, _class);
  }
  return _createClass(_class, null, [{
    key: "checkGrafik",
    value: function () {
      var _checkGrafik = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(params) {
        var query, result;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              query = "\n            SELECT \n                id, \n                'bank_rasxod' AS type\n            FROM bank_rasxod\n            WHERE isdeleted = false \n                AND shartnoma_grafik_id = $1\n\n            UNION ALL \n\n            SELECT \n                id, \n                'bank_prixod' AS type\n            FROM bank_prixod\n            WHERE isdeleted = false \n                AND shartnoma_grafik_id = $1\n\n            UNION ALL \n\n            SELECT \n                id, \n                'show_service' AS type\n            FROM kursatilgan_hizmatlar_jur152\n            WHERE isdeleted = false \n                AND shartnoma_grafik_id = $1\n            \n            UNION ALL \n\n            SELECT \n                id, \n                'akt' AS type\n            FROM bajarilgan_ishlar_jur3\n            WHERE isdeleted = false \n                AND shartnoma_grafik_id = $1\n\n            UNION ALL \n\n            SELECT \n                id, \n                'jur7_prixod' AS type\n            FROM document_prixod_jur7\n            WHERE isdeleted = false \n                AND shartnoma_grafik_id = $1\n        ";
              _context.next = 3;
              return db.query(query, params);
            case 3:
              result = _context.sent;
              return _context.abrupt("return", result);
            case 5:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function checkGrafik(_x) {
        return _checkGrafik.apply(this, arguments);
      }
      return checkGrafik;
    }()
  }, {
    key: "create",
    value: function () {
      var _create = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(params, client) {
        var query, result;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              query = "\n            INSERT INTO shartnomalar_organization(\n                doc_num, \n                doc_date, \n                summa, \n                opisanie, \n                user_id, \n                spravochnik_organization_id, \n                pudratchi_bool, \n                budjet_id\n            )\n            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)\n            RETURNING id, doc_date\n        ";
              _context2.next = 3;
              return client.query(query, params);
            case 3:
              result = _context2.sent;
              return _context2.abrupt("return", result.rows[0]);
            case 5:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function create(_x2, _x3) {
        return _create.apply(this, arguments);
      }
      return create;
    }()
  }, {
    key: "updateGrafik",
    value: function () {
      var _updateGrafik = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(params, client) {
        var query, result;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              query = "\n            UPDATE shartnoma_grafik\n            SET \n                oy_1 = $1,\n                oy_2 = $2,\n                oy_3 = $3,\n                oy_4 = $4,\n                oy_5 = $5,\n                oy_6 = $6,\n                oy_7 = $7,\n                oy_8 = $8,\n                oy_9 = $9,\n                oy_10 = $10,\n                oy_11 = $11,\n                oy_12 = $12,\n                year = $13, \n                yillik_oylik = $14,\n                smeta_id = $15,\n                itogo = $16\n            WHERE id = $17\n            RETURNING id\n        ";
              _context3.next = 3;
              return client.query(query, params);
            case 3:
              result = _context3.sent;
              return _context3.abrupt("return", result.rows[0]);
            case 5:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function updateGrafik(_x4, _x5) {
        return _updateGrafik.apply(this, arguments);
      }
      return updateGrafik;
    }()
  }, {
    key: "createGrafik",
    value: function () {
      var _createGrafik = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(params, _values, client) {
        var query, result;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              query = "\n            INSERT INTO shartnoma_grafik(\n                id_shartnomalar_organization, \n                user_id, \n                budjet_id, \n                year, \n                oy_1,\n                oy_2,\n                oy_3,\n                oy_4,\n                oy_5,\n                oy_6,\n                oy_7,\n                oy_8,\n                oy_9,\n                oy_10,\n                oy_11,\n                oy_12,\n                yillik_oylik,\n                smeta_id,\n                itogo\n            ) \n            VALUES ".concat(_values, "\n        ");
              _context4.next = 3;
              return client.query(query, params);
            case 3:
              result = _context4.sent;
              return _context4.abrupt("return", result.rows);
            case 5:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function createGrafik(_x6, _x7, _x8) {
        return _createGrafik.apply(this, arguments);
      }
      return createGrafik;
    }()
  }, {
    key: "getById",
    value: function () {
      var _getById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(params, isdeleted, budjet_id, organ_id) {
        var ignore, budjet_filter, organ_filter, query, result;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              ignore = "AND sho.isdeleted = false";
              budjet_filter = "";
              organ_filter = "";
              if (budjet_id) {
                budjet_filter = "AND sho.budjet_id = $".concat(params.length + 1);
                params.push(budjet_id);
              }
              if (organ_id) {
                organ_filter = "AND so.id = $".concat(params.length + 1);
                params.push(organ_id);
              }
              query = "--sql\n            SELECT \n                sho.*,\n                sho.summa::FLOAT,\n                row_to_json(so) AS organization,\n                (\n                    SELECT \n                        COALESCE(JSON_AGG(garfik), '[]'::JSON)\n                        FROM (\n                            SELECT \n                                g.*,\n                                row_to_json(s) AS smeta\n                            FROM shartnoma_grafik g\n                            JOIN smeta s ON s.id = g.smeta_id\n                            WHERE g.id_shartnomalar_organization = sho.id\n                                AND g.isdeleted = false\n                        ) AS garfik\n                ) AS grafiks\n            FROM shartnomalar_organization AS sho\n            JOIN users AS u ON sho.user_id = u.id\n            JOIN regions AS r ON u.region_id = r.id\n            JOIN spravochnik_organization so ON so.id = sho.spravochnik_organization_id\n            WHERE r.id = $1 \n                AND sho.id = $2 \n                ".concat(isdeleted ? '' : ignore, " \n                ").concat(budjet_filter, " \n                ").concat(organ_filter, "\n        ");
              _context5.next = 8;
              return db.query(query, params);
            case 8:
              result = _context5.sent;
              return _context5.abrupt("return", result[0]);
            case 10:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      function getById(_x9, _x10, _x11, _x12) {
        return _getById.apply(this, arguments);
      }
      return getById;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(params, organ_id, pudratchi, search) {
        var _data$, _data$2;
        var search_filter, filter_organization, pudratchi_filter, query, data;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              search_filter = "";
              filter_organization = "";
              pudratchi_filter = "";
              if (organ_id) {
                params.push(organ_id);
                filter_organization = "AND sho.spravochnik_organization_id = $".concat(params.length);
              }
              if (pudratchi === 'true') {
                pudratchi_filter = "AND sho.pudratchi_bool = true";
              }
              if (pudratchi === 'false') {
                pudratchi_filter = "AND sho.pudratchi_bool = false";
              }
              if (search) {
                params.push(search);
                search_filter = "AND (sho.doc_num ILIKE '%' || $".concat(params.length, " || '%' OR sho.opisanie ILIKE '%' || $").concat(params.length, " || '%')");
              }
              query = "--sql\n            WITH \n                data AS (\n                    SELECT \n                        sho.*,\n                        row_to_json(so) AS organization,\n                        (\n                            SELECT \n                                COALESCE(JSON_AGG(garfik), '[]'::JSON)\n                                FROM (\n                                    SELECT \n                                        g.*,\n                                        row_to_json(s) AS smeta\n                                    FROM shartnoma_grafik g\n                                    JOIN smeta s ON s.id = g.smeta_id\n                                    WHERE g.id_shartnomalar_organization = sho.id\n                                        AND g.isdeleted = false\n                                ) AS garfik\n                        ) AS grafiks\n                    FROM shartnomalar_organization AS sho\n                    JOIN users AS u ON sho.user_id = u.id\n                    JOIN regions AS r ON u.region_id = r.id\n                    JOIN spravochnik_organization so ON so.id = sho.spravochnik_organization_id\n                    WHERE sho.isdeleted = false \n                        ".concat(filter_organization, "\n                        ").concat(pudratchi_filter, "\n                        ").concat(search_filter, "\n                        AND r.id = $1\n                        AND sho.budjet_id = $2\n                    ORDER BY sho.doc_date \n                    OFFSET $3 \n                    LIMIT $4\n                ) \n                SELECT \n                    COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,\n                    (\n                        SELECT COUNT(sho.id) \n                        FROM shartnomalar_organization AS sho\n                        JOIN users AS u  ON sho.user_id = u.id\n                        JOIN regions AS r ON u.region_id = r.id\n                        WHERE sho.isdeleted = false ").concat(filter_organization, " ").concat(pudratchi_filter, " ").concat(search_filter, "\n                            AND r.id = $1\n                            AND sho.budjet_id = $2\n                    )::INTEGER AS total_count\n                FROM data\n        ");
              _context6.next = 10;
              return db.query(query, params);
            case 10:
              data = _context6.sent;
              return _context6.abrupt("return", {
                data: ((_data$ = data[0]) === null || _data$ === void 0 ? void 0 : _data$.data) || [],
                total: (_data$2 = data[0]) === null || _data$2 === void 0 ? void 0 : _data$2.total_count
              });
            case 12:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }));
      function get(_x13, _x14, _x15, _x16) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
  }, {
    key: "getGrafiks",
    value: function () {
      var _getGrafiks = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(params) {
        var query, data;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              query = "\n            SELECT \n                g.id,\n                g.oy_1::FLOAT,\n                g.oy_2::FLOAT,\n                g.oy_3::FLOAT,\n                g.oy_4::FLOAT,\n                g.oy_5::FLOAT,\n                g.oy_6::FLOAT,\n                g.oy_7::FLOAT,\n                g.oy_8::FLOAT,\n                g.oy_9::FLOAT,\n                g.oy_10::FLOAT,\n                g.oy_11::FLOAT,\n                g.oy_12::FLOAT,\n                g.itogo::FLOAT AS summa,\n                g.year,\n                s.id smeta_id,\n                s.smeta_number sub_schet\n            FROM shartnoma_grafik AS g\n            JOIN smeta s ON s.id = g.smeta_id \n            WHERE g.id_shartnomalar_organization = $1 \n                AND g.budjet_id = $2 \n                AND g.isdeleted = false\n        ";
              _context7.next = 3;
              return db.query(query, params);
            case 3:
              data = _context7.sent;
              return _context7.abrupt("return", data);
            case 5:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      }));
      function getGrafiks(_x17) {
        return _getGrafiks.apply(this, arguments);
      }
      return getGrafiks;
    }()
  }, {
    key: "deleteGrafiks",
    value: function () {
      var _deleteGrafiks = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(params, client) {
        var query;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              query = "UPDATE shartnoma_grafik SET isdeleted = true WHERE id_shartnomalar_organization = $1";
              _context8.next = 3;
              return client.query(query, params);
            case 3:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      }));
      function deleteGrafiks(_x18, _x19) {
        return _deleteGrafiks.apply(this, arguments);
      }
      return deleteGrafiks;
    }()
  }, {
    key: "deleteGrafik",
    value: function () {
      var _deleteGrafik = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(params, client) {
        var query;
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              query = "\n            UPDATE shartnoma_grafik \n            SET isdeleted = true \n            WHERE id_shartnomalar_organization = $1\n                AND id = $2\n        ";
              _context9.next = 3;
              return client.query(query, params);
            case 3:
            case "end":
              return _context9.stop();
          }
        }, _callee9);
      }));
      function deleteGrafik(_x20, _x21) {
        return _deleteGrafik.apply(this, arguments);
      }
      return deleteGrafik;
    }()
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(params, client) {
        var query1, query2, data;
        return _regeneratorRuntime().wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              query1 = "UPDATE shartnoma_grafik SET isdeleted = true WHERE id_shartnomalar_organization = $1";
              query2 = "UPDATE shartnomalar_organization SET isdeleted = true WHERE id = $1 RETURNING id";
              _context10.next = 4;
              return client.query(query1, params);
            case 4:
              _context10.next = 6;
              return client.query(query2, params);
            case 6:
              data = _context10.sent;
              return _context10.abrupt("return", data.rows[0]);
            case 8:
            case "end":
              return _context10.stop();
          }
        }, _callee10);
      }));
      function _delete(_x22, _x23) {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }()
  }, {
    key: "getContractByOrganizations",
    value: function () {
      var _getContractByOrganizations = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(params, organ_id) {
        var organ_filter, query, result;
        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              organ_filter = "";
              if (organ_id) {
                params.push(organ_id);
                organ_filter = "AND so.id = $".concat(params.length);
              }
              query = "--sql\n            SELECT \n                sho.id AS contract_id,\n                sho.doc_num,\n                TO_CHAR(sho.doc_date, 'YYYY-MM-DD') AS doc_date,\n                so.id,\n                so.name\n            FROM shartnomalar_organization sho\n            JOIN users u ON sho.user_id = u.id\n            JOIN regions r ON u.region_id = r.id\n            JOIN spravochnik_organization so ON so.id = sho.spravochnik_organization_id \n            WHERE sho.isdeleted = false \n                AND r.id = $1\n                ".concat(organ_filter, "\n        ");
              _context11.next = 5;
              return db.query(query, params);
            case 5:
              result = _context11.sent;
              return _context11.abrupt("return", result);
            case 7:
            case "end":
              return _context11.stop();
          }
        }, _callee11);
      }));
      function getContractByOrganizations(_x24, _x25) {
        return _getContractByOrganizations.apply(this, arguments);
      }
      return getContractByOrganizations;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12(params, client) {
        var query, data;
        return _regeneratorRuntime().wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              query = "\n            UPDATE shartnomalar_organization \n            SET \n                doc_num = $1, \n                doc_date = $2, \n                summa = $3, \n                opisanie = $4, \n                spravochnik_organization_id = $5, \n                pudratchi_bool = $6,\n                yillik_oylik = $7\n            WHERE id = $8 \n            RETURNING id, doc_date\n        ";
              _context12.next = 3;
              return client.query(query, params);
            case 3:
              data = _context12.sent;
              return _context12.abrupt("return", data.rows[0]);
            case 5:
            case "end":
              return _context12.stop();
          }
        }, _callee12);
      }));
      function update(_x26, _x27) {
        return _update.apply(this, arguments);
      }
      return update;
    }()
  }]);
}();