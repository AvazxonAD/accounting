const checkValueString = (...args) => {
  args.forEach((arg) => {
    if (arg === null || arg === undefined) {
      return;
    }
    if (typeof arg !== "string") {
      throw new Error("Ma`lumotlar to`g`ri formatda kiritilishi kerak. String");
    }
  });
};

const checkNotNull = (...args) => {
  args.forEach((arg) => {
    if (arg === null || arg === undefined) {
      throw new Error("Not null");
    }
  });
};

const checkValueNumber = (...args) => {
  args.forEach((arg) => {
    if (arg === null || arg === undefined) {
      return;
    }
    if (typeof arg !== "number") {
      throw new Error(
        `Ma'lumotlar to'g'ri formatda kiritilishi kerak. Number: ${arg}`,
      );
    }

    const argStr = arg.toString();

    if (!/^\d+(\.\d+)?$/.test(argStr)) {
      throw new Error("Ma`lumotlar to`g`ri formatda kiritilishi kerak. Number");
    }
  });
};

const checkValueBoolean = (...args) => {
  args.forEach((arg) => {
    if (arg === null || arg === undefined) {
      return;
    }
    if (typeof arg !== "boolean") {
      throw new Error(
        "Ma`lumotlar to`g`ri formatda kiritilishi kerak. Boolean",
      );
    }
  });
};

const checkValueArray = (...args) => {
  args.forEach((arg) => {
    if (arg === null || arg === undefined) {
      return;
    }
    if (!Array.isArray(arg)) {
      throw new Error(
        "Ma`lumotlar to`g`ri formatda kiritilishi kerak. Array bo`lishi lozim.",
      );
    }
  });
};

const isValidDate = (dateString) => {
  if (dateString === null || dateString === undefined) {
    return;
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(
      "Ma'lumotlar to'g'ri formatda kiritilishi kerak. Sana emas.",
    );
  }
};

module.exports = {
  checkValueArray,
  checkValueString,
  checkValueNumber,
  checkValueBoolean,
  isValidDate,
  checkNotNull,
};
