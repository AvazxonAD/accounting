const tashkentTime = () => {
  const currentUtcDate = new Date(); 
  const tashkentOffset = 10 * 60 * 60 * 1000;
  const tashkentDate = new Date(currentUtcDate.getTime() + tashkentOffset); 
  return tashkentDate.toISOString(); 
};
// return string  date
const returnStringDate = (date) => {
  const day = date.getDate().toString().padStart(2, "0"); // "05"
  let month = (date.getMonth() + 1).toString().padStart(2, "0"); // "01"
  const year = date.getFullYear().toString(); // "2024"
  month = getMonth(month);
  return (topshiriqSana = `${year} ${day}-${month}`);
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
const returnLocalDate = (date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return (topshiriqSana = `${day}.${month}.${year}`);
};

const returnLocalAllDate = (date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

const newDate = () => {
  const hozirgiVaqt = new Date();
  const uzbekistanVaqti = new Date(hozirgiVaqt.getTime() + 5 * 60 * 60 * 1000); // UTC+5

  const yil = uzbekistanVaqti.getFullYear();
  const oy = String(uzbekistanVaqti.getMonth() + 1).padStart(2, "0");
  const kun = String(uzbekistanVaqti.getDate()).padStart(2, "0");
  const soat = String(uzbekistanVaqti.getHours()).padStart(2, "0");
  const daqiqa = String(uzbekistanVaqti.getMinutes()).padStart(2, "0");
  const soniya = String(uzbekistanVaqti.getSeconds()).padStart(2, "0");
  const millisekundlar = String(uzbekistanVaqti.getMilliseconds()).padStart(
    6,
    "0",
  );

  return `${yil}-${oy}-${kun} ${soat}:${daqiqa}:${soniya}.${millisekundlar}`;
};

module.exports = {
  returnLocalDate,
  returnStringDate,
  newDate,
  returnLocalAllDate,
  tashkentTime
};
