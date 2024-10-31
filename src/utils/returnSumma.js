const returnStringSumma = (num) => {
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  if (Number.isInteger(num)) {
    return formatNumber(num) + ".00"; 
  } else {
    let parts = num.toString().split(".");
    parts[0] = formatNumber(parts[0]); 
    return parts.join(".");
  }
}

function probelNumber(num) {
  const strNum = String(num);
  return strNum.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

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
  probelNumber
};
