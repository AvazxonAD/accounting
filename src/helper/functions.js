const jwt = require('jsonwebtoken')

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

exports.returnLocalDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0"); // "05"
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // "01"
    const year = date.getFullYear().toString(); // "2024"
    return `${day}.${month}.${year}`;
};

exports.returnSleshDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0"); // "05"
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // "01"
    const year = date.getFullYear().toString(); // "2024"
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
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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