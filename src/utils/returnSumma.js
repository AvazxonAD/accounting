const returnStringSumma = (num) => {
  if (Number.isInteger(num)) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ",00";
  }
  else {
    let parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(",");
  }
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
