exports.checkValueString = (...args) => {
    args.some(arg => {
        if (typeof arg !== "string" || arg === null || arg === undefined) {
            throw new Error('Malumotlar to`g`ri  formatda kiritilishi kerak');
        }
    });
};

exports.checkValueNumber = (...args) => {
    args.some(arg => {
        if (typeof arg !== 'string' && typeof arg !== 'number' || arg === null || arg === undefined) {
            return false;
        }

        arg = arg.toString();

        if (/^\d+(\.\d+)?$/.test(arg)) {
            return true;
        }

        throw new Error('Malumotlar to`g`ri formatda kiritilishi kerak');
    });
};

exports.checkValueBoolean = (...args) => {
    args.some(arg => {
        if (typeof arg !== "boolean" || arg === null || arg === undefined) {
            throw new Error('Malumotlar to`g`ri formatda kiritlishi  kerak');
        }
    });
};

exports.checkValueObject = (...args) => {
    args.some(arg => {
        if (typeof arg !== "object" || arg === null || arg === undefined) {
            throw new Error('Malumotlar to`g`ri formatda kiritlishi  kerak');
        }
    });
};