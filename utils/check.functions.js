// utils/check.functions.js
const ErrorResponse = require('./errorResponse');

exports.checkNotNull = (next, ...args) => {
    const hasNullOrUndefined = args.some(arg => arg === null || arg === undefined);
    if (hasNullOrUndefined) {
        return next(new ErrorResponse(`Sorovlar bo'sh qolishi mumkin emas`, 400));
    } 
    return;
}

exports.checkValueString = (next, ...args) => {
    const hasNullOrUndefined = args.some(arg => typeof arg !== "string");
    if (hasNullOrUndefined) {
        return next(new ErrorResponse(`Malumotlar tog'ri kiritilishi kerak`, 400));
    } 
    return;
}

exports.checkValueNumber = (next, ...args) => {
    const hasNullOrUndefined = args.some(arg => typeof arg !== "number");
    if (hasNullOrUndefined) {
        return next(new ErrorResponse(`Malumotlar tog'ri kiritilishi kerak`, 400));
    } 
    return;
}

exports.checkValueBoolean = (next, ...args) => {
    const hasNullOrUndefined = args.some(arg => typeof arg !== "boolean");
    if (hasNullOrUndefined) {
        return next(new ErrorResponse(`Malumotlar tog'ri kiritilishi kerak`, 400));
    } 
    return;
}

