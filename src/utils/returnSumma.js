const returnStringSumma = (num) => {
  const [integerPart, decimalPart] = num.toString().split(".");
  const parts = [];

  for (let i = integerPart.length; i > 0; i -= 3) {
    const start = Math.max(i - 3, 0);
    parts.unshift(integerPart.slice(start, i));
  }

  return decimalPart ? `${parts.join(" ")}.${decimalPart}` : parts.join(" ");
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
  returnAllChildSumma,
  returnStringSumma,
  sum,
};
