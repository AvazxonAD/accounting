const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./public/uploads/excel",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

function checkFileType(file, cb) {
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

exports.uploadExcel = multer({
  storage,
  limits: { fileSize: 100000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});
