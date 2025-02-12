function returnExcelColumn(column, shift) {
    let columnNumber = 0;
    for (let i = 0; i < column.length; i++) {
        columnNumber = columnNumber * 26 + (column.charCodeAt(i) - 64);
    }
    columnNumber += shift - 1;
    let result = '';
    while (columnNumber > 0) {
        let remainder = (columnNumber - 1) % 26;
        result = String.fromCharCode(65 + remainder) + result;
        columnNumber = Math.floor((columnNumber - 1) / 26);
    }
    return result;
}

module.exports = { returnExcelColumn };
