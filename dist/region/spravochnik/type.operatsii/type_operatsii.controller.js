"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var _require = require("./type_operatsii.service"),
  getByAlltypeOperatsiiService = _require.getByAlltypeOperatsiiService,
  createTypeOperatsiiService = _require.createTypeOperatsiiService,
  getAlltypeOperatsiiService = _require.getAlltypeOperatsiiService,
  getByIdTypeOperatsiiService = _require.getByIdTypeOperatsiiService,
  updatetypeOperatsiiService = _require.updatetypeOperatsiiService,
  deletetypeOperatsiiService = _require.deletetypeOperatsiiService;
var pool = require("@config/db");
var ErrorResponse = require("@utils/errorResponse");
var xlsx = require("xlsx");
var _require2 = require("@utils/validation"),
  typeOperatsiiValidation = _require2.typeOperatsiiValidation;
;
var _require3 = require("@utils/response-for-validation"),
  validationResponse = _require3.validationResponse;
var _require4 = require("@utils/errorCatch"),
  errorCatch = _require4.errorCatch;
var _require5 = require("@utils/resFunc"),
  resFunc = _require5.resFunc;
var _require6 = require("@utils/validation"),
  queryValidation = _require6.queryValidation;

// createTypeOperatsii
var createTypeOperatsii = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var region_id, user_id, data, name, rayon, result;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          region_id = req.user.region_id;
          user_id = req.user.id;
          data = validationResponse(typeOperatsiiValidation, req.body);
          name = data.name, rayon = data.rayon;
          _context.next = 7;
          return getByAlltypeOperatsiiService(region_id, name, rayon);
        case 7:
          _context.next = 9;
          return createTypeOperatsiiService(user_id, name, rayon);
        case 9:
          result = _context.sent;
          return _context.abrupt("return", res.success(req.i18n.t('createSuccess'), 200, null, result));
        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          errorCatch(_context.t0, res);
        case 16:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 13]]);
  }));
  return function createTypeOperatsii(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// get all
var getTypeOperatsii = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var region_id, _validationResponse, page, limit, search, offset, result, total, pageCount, meta;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          region_id = req.user.region_id;
          _validationResponse = validationResponse(queryValidation, req.query), page = _validationResponse.page, limit = _validationResponse.limit, search = _validationResponse.search;
          offset = (page - 1) * limit;
          _context2.next = 6;
          return getAlltypeOperatsiiService(region_id, offset, limit, search);
        case 6:
          result = _context2.sent;
          total = result.total_count;
          pageCount = Math.ceil(total / limit);
          meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1
          };
          return _context2.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, meta, (result === null || result === void 0 ? void 0 : result.data) || []));
        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          errorCatch(_context2.t0, res);
        case 16:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 13]]);
  }));
  return function getTypeOperatsii(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

// updateTypeOperatsii
var updateTypeOperatsii = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var region_id, id, type_operatsii, _validationResponse2, name, rayon, result;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          region_id = req.user.region_id;
          id = req.params.id;
          _context3.next = 5;
          return getByIdTypeOperatsiiService(region_id, id);
        case 5:
          type_operatsii = _context3.sent;
          _validationResponse2 = validationResponse(typeOperatsiiValidation, req.body), name = _validationResponse2.name, rayon = _validationResponse2.rayon;
          if (!(type_operatsii.name !== name || type_operatsii.rayon !== rayon)) {
            _context3.next = 10;
            break;
          }
          _context3.next = 10;
          return getByAlltypeOperatsiiService(region_id, name, rayon);
        case 10:
          _context3.next = 12;
          return updatetypeOperatsiiService(id, name, rayon);
        case 12:
          result = _context3.sent;
          return _context3.abrupt("return", res.success(req.i18n.t('updateSuccess'), 200, null, result));
        case 16:
          _context3.prev = 16;
          _context3.t0 = _context3["catch"](0);
          errorCatch(_context3.t0, res);
        case 19:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 16]]);
  }));
  return function updateTypeOperatsii(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

// delete value
var deleteTypeOperatsii = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var region_id, id;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          region_id = req.user.region_id;
          id = req.params.id;
          _context4.next = 5;
          return getByIdTypeOperatsiiService(region_id, id);
        case 5:
          _context4.next = 7;
          return deletetypeOperatsiiService(id);
        case 7:
          return _context4.abrupt("return", res.success(req.i18n.t('deleteSuccess'), 200));
        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          errorCatch(_context4.t0, res);
        case 13:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 10]]);
  }));
  return function deleteTypeOperatsii(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

// get element by id
var getById = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var result;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return getByIdTypeOperatsiiService(req.user.region_id, req.params.id, true);
        case 3:
          result = _context5.sent;
          return _context5.abrupt("return", res.success(req.i18n.t('getSuccess'), 200, null, result));
        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          errorCatch(_context5.t0, res);
        case 10:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 7]]);
  }));
  return function getById(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

// import to excel
var importToExcel = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var filePath, workbook, sheetName, sheet, data, _iterator, _step, rowData, name, rayon, test, _iterator2, _step2, _rowData, result;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          if (req.file) {
            _context6.next = 2;
            break;
          }
          return _context6.abrupt("return", next(new ErrorResponse("Fayl yuklanmadi", 400)));
        case 2:
          filePath = req.file.path;
          workbook = xlsx.readFile(filePath);
          sheetName = workbook.SheetNames[0];
          sheet = workbook.Sheets[sheetName];
          data = xlsx.utils.sheet_to_json(sheet).map(function (row) {
            var newRow = {};
            for (var key in row) {
              newRow[key.trim()] = row[key];
            }
            return newRow;
          });
          _iterator = _createForOfIteratorHelper(data);
          _context6.prev = 8;
          _iterator.s();
        case 10:
          if ((_step = _iterator.n()).done) {
            _context6.next = 22;
            break;
          }
          rowData = _step.value;
          checkValueString(rowData.name, rowData.rayon);
          name = rowData.name.trim();
          rayon = rowData.rayon.trim();
          _context6.next = 17;
          return pool.query("SELECT * FROM spravochnik_type_operatsii WHERE region_id = $1 AND name = $2 AND rayon = $3 AND isdeleted = false", [req.user.region_id, name, rayon]);
        case 17:
          test = _context6.sent;
          if (!test.rows[0]) {
            _context6.next = 20;
            break;
          }
          return _context6.abrupt("return", next(new ErrorResponse("Ushbu malumot kiritilgan: ".concat(name), 400)));
        case 20:
          _context6.next = 10;
          break;
        case 22:
          _context6.next = 27;
          break;
        case 24:
          _context6.prev = 24;
          _context6.t0 = _context6["catch"](8);
          _iterator.e(_context6.t0);
        case 27:
          _context6.prev = 27;
          _iterator.f();
          return _context6.finish(27);
        case 30:
          _iterator2 = _createForOfIteratorHelper(data);
          _context6.prev = 31;
          _iterator2.s();
        case 33:
          if ((_step2 = _iterator2.n()).done) {
            _context6.next = 42;
            break;
          }
          _rowData = _step2.value;
          _context6.next = 37;
          return pool.query("INSERT INTO spravochnik_type_operatsii(name, rayon, region_id) VALUES($1, $2, $3) RETURNING *\n        ", [_rowData.name, _rowData.rayon, req.user.region_id]);
        case 37:
          result = _context6.sent;
          if (result.rows[0]) {
            _context6.next = 40;
            break;
          }
          return _context6.abrupt("return", next(new ErrorResponse("Server xatolik. Malumot kiritilmadi", 500)));
        case 40:
          _context6.next = 33;
          break;
        case 42:
          _context6.next = 47;
          break;
        case 44:
          _context6.prev = 44;
          _context6.t1 = _context6["catch"](31);
          _iterator2.e(_context6.t1);
        case 47:
          _context6.prev = 47;
          _iterator2.f();
          return _context6.finish(47);
        case 50:
          return _context6.abrupt("return", res.status(200).json({
            success: true,
            data: "Muvaffaqiyatli kiritildi"
          }));
        case 51:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[8, 24, 27, 30], [31, 44, 47, 50]]);
  }));
  return function importToExcel(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
module.exports = {
  getById: getById,
  createTypeOperatsii: createTypeOperatsii,
  getTypeOperatsii: getTypeOperatsii,
  deleteTypeOperatsii: deleteTypeOperatsii,
  updateTypeOperatsii: updateTypeOperatsii,
  importToExcel: importToExcel
};