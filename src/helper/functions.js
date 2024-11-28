exports.tashkentTime = () => {
    const currentUtcDate = new Date();
    const tashkentOffset = 10 * 60 * 60 * 1000;
    const tashkentDate = new Date(currentUtcDate.getTime() + tashkentOffset);
    return tashkentDate.toISOString();
};

exports.sum = (...args) => {
    let sum = 0;
    console.log(args)
    args.map((arg) => (sum += Number(arg)));
    return sum;
};

exports.childsSumma = (args) => {
    let sum = 0;
    args.map((arg) => (sum += Number(arg.summa)));
    return sum;
};

exports.returnStringDate = (date) => {
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
    const day = date.getDate().toString().padStart(2, "0"); // "05"
    let month = (date.getMonth() + 1).toString().padStart(2, "0"); // "01"
    const year = date.getFullYear().toString(); // "2024"
    month = getMonth(month);
    return (topshiriqSana = `${year} ${day}-${month}`);
};
