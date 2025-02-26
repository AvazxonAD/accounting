const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;

exports.HelperFunctions = class {
    static lastDate(date) {
        if (date.month === 1) return { month: 12, year: date.year - 1 };
        else if (date.month > 1) return { month: date.month - 1, year: date.year };
        else return null;
    }

    static async getTemplateFile(fileName) {
        const folderPath = path.join(__dirname, `../../public/template`);

        const filePath = path.join(folderPath, fileName);

        const fileRes = await fs.readFile(filePath);

        return { fileName, fileRes };
    }

    static sum(...args) {
        let sum = 0;
        args.map((arg) => (sum += Number(arg)));
        return sum;
    };

    static tashkentTime() {
        const currentUtcDate = new Date();
        const tashkentOffset = 10 * 60 * 60 * 1000;
        const tashkentDate = new Date(currentUtcDate.getTime() + tashkentOffset);
        return tashkentDate.toISOString();
    }

    static returnMonth(month) {
        switch (month) {
            case 1:
                return "январь";
            case 2:
                return "февраль";
            case 3:
                return "март";
            case 4:
                return "апрель";
            case 5:
                return "май";
            case 6:
                return "июнь";
            case 7:
                return "июль";
            case 8:
                return "август";
            case 9:
                return "сентябрь";
            case 10:
                return "октябрь";
            case 11:
                return "ноябрь";
            case 12:
                return "декабрь";
            default:
                return "server xatolik";
        }
    }

    static formatSubSchet(str) {
        const result = ['', '', ''];
        for (let i = 0; i < str.length; i++) {
            if (i < 2) {
                result[0] += str[i];
            } else if (i < 4) {
                result[1] += str[i];
            } else {
                result[2] += str[i];
            }
        }
        return result;
    };

    static filters(data) {
        return data.length ? `AND ${data.join(' AND ')}` : '';
    }

    static summaDoc(data) {
        const summa = data.reduce((acc, item) => acc += item.summa, 0);

        return summa;
    }

    static paramsValues(data) {
        const index_max = data.params.length;
        let values = '('
        for (let i = 1; i <= index_max; i++) {
            if (index_max === i) {
                values += ` $${i})`
            } else if (i % data.column_count === 0) {
                values += ` $${i}), (`
            } else {
                values += `$${i}, `
            }
        }
        return values;
    }

    static excelSerialToDate(serial) {
        const excelEpoch = new Date(1899, 11, 30);
        const date = new Date(excelEpoch.getTime() + serial * 86400000);
        return date.toISOString().split('T')[0];
    }

    static probelNumber(num) {
        const strNum = String(num);
        return strNum.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    static getMonthStartEnd(year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        return [startDate, endDate];
    }

    static returnStringDate(date) {
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
        const day = date.getDate().toString().padStart(2, "0");
        let month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear().toString();
        month = getMonth(month);
        return (`${year} ${day}-${month}`);
    };
}

exports.tashkentTime = () => {
    const currentUtcDate = new Date();
    const tashkentOffset = 10 * 60 * 60 * 1000;
    const tashkentDate = new Date(currentUtcDate.getTime() + tashkentOffset);
    return tashkentDate.toISOString();
};

exports.sum = (...args) => {
    let sum = 0;
    args.map((arg) => (sum += Number(arg)));
    return sum;
};

exports.childsSumma = (args) => {
    let sum = 0;
    args.map((arg) => (sum += Number(arg.summa)));
    return sum;
};

exports.checkUniqueIds = (array) => {
    const ids = array.map(item => item.id ? item.id : item.spravochnik_main_book_schet_id ? item.spravochnik_main_book_schet_id : item.smeta_grafik_id);
    const uniqueIds = new Set(ids);
    return ids.length === uniqueIds.size;
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
    const day = date.getDate().toString().padStart(2, "0");
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    month = getMonth(month);
    return (`${year} ${day}-${month}`);
};

exports.returnLocalDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}.${month}.${year}`;
};

exports.returnSleshDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
};

exports.designParams = (params, design_keys) => {
    return allValues = params.reduce((acc, obj) => {
        const sortValues = design_keys.map(key => obj[key]);
        return acc.concat(Object.values(sortValues));
    }, []);
}

exports.sqlFilter = (column_name, index_contract_id) => {
    return `AND ${column_name} = $${index_contract_id}`;
};

exports.returnStringSumma = (num) => {
    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    if (Number.isInteger(num)) {
        return formatNumber(num) + ".00";
    } else {
        let parts = num.toString().split(".");
        parts[0] = formatNumber(parts[0]);
        return parts.join(".");
    }
}

exports.returnParamsValues = (params, column_count) => {
    const index_max = params.length;
    let values = '('
    for (let i = 1; i <= index_max; i++) {
        if (index_max === i) {
            values += ` $${i})`
        } else if (i % column_count === 0) {
            values += ` $${i}), (`
        } else {
            values += `$${i}, `
        }
    }
    return values;
}

exports.generateToken = (user) => {
    const payload = user
    const secret = process.env.JWT_SECRET;
    const options = {
        expiresIn: process.env.JWT_EXPIRE || "30d",
    };
    const token = jwt.sign(payload, secret, options);
    return token;
};

exports.checkSchetsEquality = (childs) => {
    const firstSchet = childs[0].schet;
    return childs.every(child => child.schet === firstSchet);
}

exports.checkTovarId = (array) => {
    let test;
    for (let item of array) {
        test = array.filter(element => element.naimenovanie_tovarov_jur7_id === item.naimenovanie_tovarov_jur7_id)
        if (test.length > 1) {
            test = true;
        } else {
            test = false;
        }
    }
    return test;
}

exports.filterLogs = (array) => {
    const logPattern = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\.\s*(\w+)\.\s*id:(\d+)\.\s*user_id:(\d+)/;
    const logs = array.map(line => {
        const match = line.match(logPattern);
        if (match) {
            return {
                date: match[1],
                type: match[2],
                id: match[3],
                user_id: match[4]
            };
        }
        return null;
    }).filter(log => log !== null);
    return logs;
}

exports.parseLogs = (logs, type) => {
    return logs
        .map(log => {
            const match = log.match(/^(.*?)\. (\w+)\. id:([\d,]+)\. user_id:(\d+)/);
            if (match) {
                return {
                    date: match[1],
                    type: match[2],
                    ids: match[3].split(',').map(id => parseInt(id)),
                    user_id: match[4],
                    type: type
                };
            }
            return null;
        })
        .filter(entry => entry !== null);
};

exports.returnExcelColumn = (columns) => {
    if (columns.length === 1) {
        let columnNumber = columns[0];
        let result = '';
        while (columnNumber > 0) {
            let remainder = (columnNumber - 1) % 26;
            result = String.fromCharCode(65 + remainder) + result;
            columnNumber = Math.floor((columnNumber - 1) / 26);
        }
        return result;
    }

    let results = [];
    columns.forEach(columnNumber => {
        let result = '';
        while (columnNumber > 0) {
            let remainder = (columnNumber - 1) % 26;
            result = String.fromCharCode(65 + remainder) + result;
            columnNumber = Math.floor((columnNumber - 1) / 26);
        }
        results.push(result);
    });
    return results;
}

exports.getMonthStartEnd = (year, month) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return [startDate, endDate];
}

exports.getDayStartEnd = (year, month) => {
    const startOfMonth = 1;
    const endOfMonth = new Date(year, month, 0).getDate();
    return {
        start: startOfMonth,
        end: endOfMonth
    };
};

exports.returnMonth = (month) => {
    switch (month) {
        case 1:
            return "январь";
        case 2:
            return "февраль";
        case 3:
            return "март";
        case 4:
            return "апрель";
        case 5:
            return "май";
        case 6:
            return "июнь";
        case 7:
            return "июль";
        case 8:
            return "август";
        case 9:
            return "сентябрь";
        case 10:
            return "октябрь";
        case 11:
            return "ноябрь";
        case 12:
            return "декабрь";
        default:
            return "server xatolik";
    }
}


exports.formatSubSchet = (str) => {
    const result = ['', '', ''];
    for (let i = 0; i < str.length; i++) {
        if (i < 2) {
            result[0] += str[i];
        } else if (i < 4) {
            result[1] += str[i];
        } else {
            result[2] += str[i];
        }
    }
    return result;
};

exports.checkSchetsEquality = (childs) => {
    const firstSchet = childs[0].schet;
    return childs.every(child => child.schet === firstSchet);
}