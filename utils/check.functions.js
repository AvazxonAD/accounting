const checkValueString = (...args) => {
    args.forEach(arg => {
        if (typeof arg !== "string" || arg === null || arg === undefined) {
            throw new Error('Malumotlar to`g`ri  formatda kiritilishi kerak. String');
        }
    });
};

const checkValueNumber = (...args) => {
    args.forEach(arg => {
        if (typeof arg !== 'number' || arg === null || arg === undefined) {
            throw new Error('Malumotlar to`g`ri formatda kiritilishi kerak. Number');
        }

        arg = arg.toString();

        if (/^\d+(\.\d+)?$/.test(arg)) {
            return true;
        }

        throw new Error('Malumotlar to`g`ri formatda kiritilishi kerak. Number');
    });
};

const checkValueBoolean = (...args) => {
    args.forEach(arg => {
        if (typeof arg !== "boolean" || arg === null || arg === undefined) {
            throw new Error('Malumotlar to`g`ri formatda kiritlishi  kerak. Boolean');
        }
    });
};

const checkValueArray = (...args) => {
    args.forEach(arg => {
        if (!Array.isArray(arg)) {
            throw new Error('Malumotlar to\'g\'ri formatda kiritilishi kerak. Array bo\'lishi lozim.');
        }
    });
};

const isValidDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error("Ma'lumotlar to'g'ri formatda kiritilishi kerak. Sana emas.");
    }
};

module.exports = {
    checkValueArray,
    checkValueString,
    checkValueNumber,
    checkValueBoolean,
    isValidDate
}

