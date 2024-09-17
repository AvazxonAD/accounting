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
            console.log(typeof arg)
            throw new Error('Malumotlar to`g`ri  turida bo`lishi kerak');
        }
    });
};

exports.checkValueNumber = (next, ...args) => {
    args.some(arg => {
        if (typeof arg !== "number") {
            throw new Error('Malumotlar to`g`ri kiritlishi  kerak');
        }
    });
};

exports.checkValueBoolean = (next, ...args) => {
    args.some(arg => {
        if (typeof arg !== 'boolean') {
            throw new Error('Malumotlar to`g`ri kiritlishi  kerak');
        }
    });
};
