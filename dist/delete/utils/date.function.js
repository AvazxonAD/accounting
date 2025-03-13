"use strict";

var tashkentTime = function tashkentTime() {
  var currentUtcDate = new Date();
  var tashkentOffset = 10 * 60 * 60 * 1000;
  var tashkentDate = new Date(currentUtcDate.getTime() + tashkentOffset);
  return tashkentDate.toISOString();
};
// return string  date
var returnStringDate = function returnStringDate(date) {
  var day = date.getDate().toString().padStart(2, "0"); // "05"
  var month = (date.getMonth() + 1).toString().padStart(2, "0"); // "01"
  var year = date.getFullYear().toString(); // "2024"
  month = getMonth(month);
  return topshiriqSana = "".concat(year, " ").concat(day, "-").concat(month);
};
var returnSleshDate = function returnSleshDate(date) {
  var day = date.getDate().toString().padStart(2, "0"); // "05"
  var month = (date.getMonth() + 1).toString().padStart(2, "0"); // "01"
  var year = date.getFullYear().toString(); // "2024"
  return "".concat(day, ".").concat(month, ".").concat(year);
};

// need function
function getMonth(month) {
  switch (month) {
    case "01":
      return "январь";
    case "02":
      return "февраль";
    case "03":
      return "март";
    case "04":
      return "апрель";
    case "05":
      return "май";
    case "06":
      return "июнь";
    case "07":
      return "июль";
    case "08":
      return "август";
    case "09":
      return "сентябрь";
    case "10":
      return "октябрь";
    case "11":
      return "ноябрь";
    case "12":
      return "декабрь";
    default:
      return "server xatolik";
  }
}

//     return local date
var returnLocalDate = function returnLocalDate(date) {
  var day = date.getDate().toString().padStart(2, "0");
  var month = (date.getMonth() + 1).toString().padStart(2, "0");
  var year = date.getFullYear().toString();
  return topshiriqSana = "".concat(day, ".").concat(month, ".").concat(year);
};
var returnLocalAllDate = function returnLocalAllDate(date) {
  var day = date.getDate().toString().padStart(2, "0");
  var month = (date.getMonth() + 1).toString().padStart(2, "0");
  var year = date.getFullYear().toString();
  var hours = date.getHours().toString().padStart(2, "0");
  var minutes = date.getMinutes().toString().padStart(2, "0");
  return "".concat(day, ".").concat(month, ".").concat(year, " ").concat(hours, ":").concat(minutes);
};
var newDate = function newDate() {
  var hozirgiVaqt = new Date();
  var uzbekistanVaqti = new Date(hozirgiVaqt.getTime() + 5 * 60 * 60 * 1000); // UTC+5

  var yil = uzbekistanVaqti.getFullYear();
  var oy = String(uzbekistanVaqti.getMonth() + 1).padStart(2, "0");
  var kun = String(uzbekistanVaqti.getDate()).padStart(2, "0");
  var soat = String(uzbekistanVaqti.getHours()).padStart(2, "0");
  var daqiqa = String(uzbekistanVaqti.getMinutes()).padStart(2, "0");
  var soniya = String(uzbekistanVaqti.getSeconds()).padStart(2, "0");
  var millisekundlar = String(uzbekistanVaqti.getMilliseconds()).padStart(6, "0");
  return "".concat(yil, "-").concat(oy, "-").concat(kun, " ").concat(soat, ":").concat(daqiqa, ":").concat(soniya, ".").concat(millisekundlar);
};
module.exports = {
  returnLocalDate: returnLocalDate,
  returnStringDate: returnStringDate,
  newDate: newDate,
  returnLocalAllDate: returnLocalAllDate,
  tashkentTime: tashkentTime,
  returnSleshDate: returnSleshDate
};