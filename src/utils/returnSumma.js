const returnStringSumma = (num) => {
  const numStr = num.toString();
  const parts = [];

  // O'ngdan chapga bo'lib olamiz
  for (let i = numStr.length; i > 0; i -= 3) {
    const start = Math.max(i - 3, 0);
    parts.unshift(numStr.slice(start, i));
  }

  return parts.join(" ");
};

const returnAllChildSumma = (array) => {
  let sum = 0;
  for (let child of array) {
    sum += child.summa;
  }
  return sum;
};

const sum = (...args) => {
  let sum = 0;
  args.map((arg) => (sum += Number(arg)));
  return sum;
};

module.exports = {
  sum,
};

module.exports = {
  returnAllChildSumma,
  returnStringSumma,
  sum
};
