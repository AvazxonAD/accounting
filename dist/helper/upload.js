"use strict";

var multer = require("multer");
var path = require("path");
var storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function filename(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 100000000
  },
  fileFilter: function fileFilter(req, file, cb) {
    checkFileType(file, cb);
  }
});
function checkFileType(file, cb) {
  var filetypes = /xlsx|xls/;
  var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  var mimetype = /application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|application\/vnd\.ms-excel/.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Xato: Faqat excel fayllarini yuklash mumkin"));
  }
}
module.exports = upload;