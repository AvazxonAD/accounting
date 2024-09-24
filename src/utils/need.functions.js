const sum = (...args) => {
  let sum = 0;
  args.map((arg) => (sum += Number(arg)));
  return sum;
};

module.exports = {
  sum,
};
