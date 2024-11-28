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
