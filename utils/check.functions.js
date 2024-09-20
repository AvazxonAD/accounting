exports.checkValueString = (...args) => {
    args.forEach(arg => {
        if (typeof arg !== "string" || arg === null || arg === undefined) {
            throw new Error('Malumotlar to`g`ri  formatda kiritilishi kerak. String');
        }
    });
};

exports.checkValueNumber = (...args) => {
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

exports.checkValueBoolean = (...args) => {
    args.forEach(arg => {
        if (typeof arg !== "boolean" || arg === null || arg === undefined) {
            throw new Error('Malumotlar to`g`ri formatda kiritlishi  kerak. Boolean');
        }
    });
};

exports.checkValueArray = (...args) => {
    args.forEach(arg => {
        if (!Array.isArray(arg)) {
            throw new Error('Malumotlar to\'g\'ri formatda kiritilishi kerak. Array bo\'lishi lozim.');
        }
    });
};