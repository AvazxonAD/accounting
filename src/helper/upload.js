const multer = require("multer");
const path = require("path");

const excelStorage = multer.diskStorage({
  destination: "./public/uploads/excel",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const videoStorage = multer.diskStorage({
  destination: "./public/uploads/videos",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

function checkExcelFileType(file, cb) {
  const filetypes = /xlsx|xls/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype =
    /application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|application\/vnd\.ms-excel/.test(
      file.mimetype
    );

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Xato: Faqat excel fayllarini yuklash mumkin"));
  }
}

function checkVideoFileType(file, cb) {
  const filetypes = /mp4|avi|mkv|mov/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype =
    /video\/mp4|video\/x-msvideo|video\/x-matroska|video\/quicktime/.test(
      file.mimetype
    );

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Xato: Faqat video fayllarini yuklash mumkin"));
  }
}

exports.uploadExcel = multer({
  storage: excelStorage,
  limits: { fileSize: 100000000 },
  fileFilter: function (req, file, cb) {
    checkExcelFileType(file, cb);
  },
});

exports.uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 1073741824 },
  fileFilter: function (req, file, cb) {
    checkVideoFileType(file, cb);
  },
});
