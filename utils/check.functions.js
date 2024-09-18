// utils/check.functions.js
const ErrorResponse = require('./errorResponse');

exports.checkNotNull = (...args) => {
    args.some(arg => {
        if (arg === null || arg === undefined) {
            throw new Error('Malumotlar to`g`ri kiritlishi  kerak');
        }
    });
};

// utils/check.functions.js
exports.checkValueString = (...args) => {
    args.some(arg => {
        if (typeof arg !== "string") {
            throw new Error('Malumotlar to`g`ri  turida bo`lishi kerak');
        }
    });
};

exports.checkValueNumber = (...args) => {
    args.some(arg => {
        if (typeof arg !== 'string' && typeof arg !== 'number') {
            return false;
        }

        arg = arg.toString();

        if (/^\d+(\.\d+)?$/.test(arg)) {
            return true;
        }

        throw new Error('Malumotlar to`g`ri kiritilishi kerak');
    });
};

exports.checkValueBoolean = (...args) => {
    args.some(arg => {
        if (typeof arg !== "boolean") {
            throw new Error('Malumotlar to`g`ri kiritlishi  kerak');
        }
    });
};

exports.checkValueObject = (next, ...args) => {
    args.some(arg => {
        if (typeof arg !== "object") {
            throw new Error('Malumotlar to`g`ri kiritlishi  kerak');
        }
    });
};