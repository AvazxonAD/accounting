"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var pool = require("@config/db");
var ErrorResponse = require('@utils/errorResponse');
var _require = require('@db/index'),
  db = _require.db;
var createOperatsiiService = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(data) {
    var result;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return pool.query("INSERT INTO spravochnik_operatsii(\n          name,  schet, sub_schet, type_schet, smeta_id, budjet_id\n          ) VALUES($1, $2, $3, $4, $5, $6) RETURNING * \n      ", [data.name, data.schet, data.sub_schet, data.type_schet, data.smeta_id, data.budjet_id]);
        case 3:
          result = _context.sent;
          return _context.abrupt("return", result.rows[0]);
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          throw new ErrorResponse(_context.t0, _context.t0.statusCode);
        case 10:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 7]]);
  }));
  return function createOperatsiiService(_x) {
    return _ref.apply(this, arguments);
  };
}();
var getByNameAndSchetOperatsiiService = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(name, type_schet, smeta_id) {
    var result;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return pool.query("SELECT * FROM spravochnik_operatsii WHERE name = $1 AND type_schet = $2 AND isdeleted = false AND smeta_id = $3", [name, type_schet, smeta_id]);
        case 3:
          result = _context2.sent;
          if (!result.rows[0]) {
            _context2.next = 6;
            break;
          }
          throw new ErrorResponse('This data has already been entered', 409);
        case 6:
          return _context2.abrupt("return", result.rows[0]);
        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          throw new ErrorResponse(_context2.t0, _context2.t0.statusCode);
        case 12:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 9]]);
  }));
  return function getByNameAndSchetOperatsiiService(_x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var getAllOperatsiiService = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(offset, limit, type_schet, search, meta_search, schet, sub_schet, budjet_id) {
    var _result$, _result$2, schet_filter, sub_schet_filter, type_schet_filter, search_filter, meta_search_filter, budjet_filter, params, query, result;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          schet_filter = "";
          sub_schet_filter = '';
          type_schet_filter = '';
          search_filter = "";
          meta_search_filter = "";
          budjet_filter = "";
          params = [offset, limit];
          if (search) {
            params.push(search);
            search_filter = "AND ( s.schet ILIKE '%' || $".concat(params.length, " || '%' OR s.name ILIKE '%' || $").concat(params.length, " || '%' OR s.sub_schet ILIKE '%' || $").concat(params.length, " || '%')");
          }
          if (type_schet) {
            type_schet_filter = "AND s.type_schet = $".concat(params.length + 1);
            params.push(type_schet);
          }
          if (meta_search) {
            params.push(meta_search);
            meta_search_filter = "AND s.sub_schet ILIKE '%' || $".concat(params.length, " || '%'");
          }
          if (schet) {
            params.push(schet);
            schet_filter = "AND s.schet = $".concat(params.length);
          }
          if (sub_schet) {
            params.push(sub_schet);
            sub_schet_filter = "AND s.sub_schet ILIKE '%' || $".concat(params.length, " || '%'");
          }
          if (budjet_id) {
            params.push(budjet_id);
            budjet_filter = "AND s.budjet_id = $".concat(params.length);
          }
          query = "\n      WITH data AS (\n        SELECT \n          s.id, \n          s.name, \n          s.schet, \n          s.sub_schet, \n          s.type_schet, \n          s.smeta_id, \n          b.id AS budjet_id, \n          b.name AS budjet_name\n        FROM spravochnik_operatsii s \n        LEFT JOIN spravochnik_budjet_name b ON b.id = s.budjet_id\n        WHERE s.isdeleted = false \n          AND (\n            s.type_schet = 'akt' OR \n            s.type_schet = 'bank_prixod' OR \n            s.type_schet = 'avans_otchet' OR \n            s.type_schet = 'kassa_prixod' OR \n            s.type_schet = 'kassa_rasxod' OR \n            s.type_schet = 'bank_rasxod' OR \n            s.type_schet = 'general' OR \n            s.type_schet = 'show_service'\n          )\n          ".concat(schet_filter, "\n          ").concat(sub_schet_filter, "\n          ").concat(search_filter, " \n          ").concat(type_schet_filter, "\n          ").concat(meta_search_filter, " \n          ").concat(budjet_filter, "\n        OFFSET $1 LIMIT $2\n      )\n      SELECT \n        COALESCE( JSON_AGG( row_to_json( data ) ), '[]'::JSON ) AS data,\n        (\n          SELECT \n            COALESCE(COUNT(s.id), 0)::INTEGER\n          FROM spravochnik_operatsii s\n          WHERE s.isdeleted = false\n            AND (\n              s.type_schet = 'akt' OR \n              s.type_schet = 'bank_prixod' OR \n              s.type_schet = 'avans_otchet' OR \n              s.type_schet = 'kassa_prixod' OR \n              s.type_schet = 'kassa_rasxod' OR \n              s.type_schet = 'bank_rasxod' OR \n              s.type_schet = 'general' OR \n              s.type_schet = 'show_service'\n            )\n            ").concat(schet_filter, "\n            ").concat(sub_schet_filter, "\n            ").concat(search_filter, " \n            ").concat(type_schet_filter, "\n            ").concat(meta_search_filter, "\n            ").concat(budjet_filter, "\n        )::INTEGER AS total_count\n      FROM data\n    ");
          _context3.next = 17;
          return db.query(query, params);
        case 17:
          result = _context3.sent;
          return _context3.abrupt("return", {
            result: ((_result$ = result[0]) === null || _result$ === void 0 ? void 0 : _result$.data) || [],
            total: ((_result$2 = result[0]) === null || _result$2 === void 0 ? void 0 : _result$2.total_count) || 0
          });
        case 21:
          _context3.prev = 21;
          _context3.t0 = _context3["catch"](0);
          throw new ErrorResponse(_context3.t0, _context3.t0.statusCode);
        case 24:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 21]]);
  }));
  return function getAllOperatsiiService(_x5, _x6, _x7, _x8, _x9, _x10, _x11, _x12) {
    return _ref3.apply(this, arguments);
  };
}();
var getOperatsiiByChildArray = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(childs, type) {
    var ids, placeHolders, values, operatsii;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          ids = childs.map(function (item) {
            return item.spravochnik_operatsii_id;
          });
          placeHolders = ids.map(function (_, i) {
            return "$".concat(i + 2);
          }).join(', ');
          values = [type].concat(_toConsumableArray(ids));
          _context4.next = 6;
          return pool.query("SELECT schet\n      FROM spravochnik_operatsii \n      WHERE type_schet = $1 AND isdeleted = false AND id IN (".concat(placeHolders, ")\n    "), values);
        case 6:
          operatsii = _context4.sent;
          return _context4.abrupt("return", operatsii.rows);
        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          throw new ErrorResponse(_context4.t0, _context4.t0.statusCode || 500);
        case 13:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 10]]);
  }));
  return function getOperatsiiByChildArray(_x13, _x14) {
    return _ref4.apply(this, arguments);
  };
}();
var getByIdOperatsiiService = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(id) {
    var type_schet,
      ignoreDeleted,
      params,
      ignore,
      type_schet_filter,
      result,
      _args5 = arguments;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          type_schet = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : null;
          ignoreDeleted = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : false;
          _context5.prev = 2;
          params = [id];
          ignore = "";
          type_schet_filter = "";
          if (!ignoreDeleted) {
            ignore = "AND s.isdeleted = false";
          }
          if (type_schet) {
            type_schet_filter = " AND s.type_schet = $".concat(params.length + 1);
            params.push(type_schet);
          }
          _context5.next = 10;
          return pool.query("\n      SELECT \n        s.id, \n        s.name, \n        s.schet, \n        s.sub_schet, \n        s.type_schet, \n        s.smeta_id, \n        b.id AS budjet_id, \n        b.name AS budjet_name\n      FROM spravochnik_operatsii s \n      LEFT JOIN spravochnik_budjet_name b ON b.id = s.budjet_id\n      WHERE s.isdeleted = false\n        AND s.id = $1 \n        ".concat(type_schet_filter, " \n        ").concat(ignore, "\n      "), params);
        case 10:
          result = _context5.sent;
          if (result.rows[0]) {
            _context5.next = 13;
            break;
          }
          throw new ErrorResponse("Spravochnik operatsii not found", 404);
        case 13:
          return _context5.abrupt("return", result.rows[0]);
        case 16:
          _context5.prev = 16;
          _context5.t0 = _context5["catch"](2);
          throw new ErrorResponse(_context5.t0, _context5.t0.statusCode);
        case 19:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[2, 16]]);
  }));
  return function getByIdOperatsiiService(_x15) {
    return _ref5.apply(this, arguments);
  };
}();
var updateOperatsiiService = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(data) {
    var result;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return pool.query("UPDATE spravochnik_operatsii \n      SET name = $1, schet = $2, sub_schet = $3, type_schet = $4, smeta_id = $5, budjet_id = $6\n      WHERE id = $7 RETURNING * \n    ", [data.name, data.schet, data.sub_schet, data.type_schet, data.smeta_id, data.budjet_id, data.id]);
        case 2:
          result = _context6.sent;
          return _context6.abrupt("return", result.rows[0]);
        case 4:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function updateOperatsiiService(_x16) {
    return _ref6.apply(this, arguments);
  };
}();
var deleteOperatsiiService = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(id) {
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return pool.query("UPDATE spravochnik_operatsii SET isdeleted = $1 WHERE id = $2", [true, id]);
        case 2:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function deleteOperatsiiService(_x17) {
    return _ref7.apply(this, arguments);
  };
}();
var getBySchetService = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(schet) {
    var result;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return pool.query("\n          SELECT id, name, schet, sub_schet, type_schet, smeta_id, budjet_id\n          FROM spravochnik_operatsii \n          WHERE schet = $1  AND isdeleted = false\n        ", [schet]);
        case 3:
          result = _context8.sent;
          if (result.rows[0]) {
            _context8.next = 6;
            break;
          }
          throw new ErrorResponse('Schet not found', 404);
        case 6:
          return _context8.abrupt("return", result.rows[0]);
        case 9:
          _context8.prev = 9;
          _context8.t0 = _context8["catch"](0);
          throw new ErrorResponse(_context8.t0, _context8.t0.statusCode);
        case 12:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 9]]);
  }));
  return function getBySchetService(_x18) {
    return _ref8.apply(this, arguments);
  };
}();
var getSchetService = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
    var result;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return pool.query("SELECT DISTINCT schet FROM spravochnik_operatsii WHERE  isdeleted = false");
        case 3:
          result = _context9.sent;
          return _context9.abrupt("return", result.rows);
        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9["catch"](0);
          throw new ErrorResponse(_context9.t0, _context9.t0.statusCode);
        case 10:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 7]]);
  }));
  return function getSchetService() {
    return _ref9.apply(this, arguments);
  };
}();
module.exports = {
  getByNameAndSchetOperatsiiService: getByNameAndSchetOperatsiiService,
  createOperatsiiService: createOperatsiiService,
  getAllOperatsiiService: getAllOperatsiiService,
  getByIdOperatsiiService: getByIdOperatsiiService,
  updateOperatsiiService: updateOperatsiiService,
  deleteOperatsiiService: deleteOperatsiiService,
  getBySchetService: getBySchetService,
  getSchetService: getSchetService,
  getOperatsiiByChildArray: getOperatsiiByChildArray
};