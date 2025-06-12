const { db } = require("@db/index");
const { RasxodDB } = require("./db");
const { tashkentTime, returnParamsValues, HelperFunctions } = require("@helper/functions");
const { Jur7SaldoService } = require("@jur7_saldo/service");
const fs = require("fs").promises;
const ExcelJS = require("exceljs");
const path = require("path");

exports.Jur7RsxodService = class {
  static async aktExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("akt");

    worksheet.getCell(`A1`).value = `${data.region.name}`;

    worksheet.mergeCells(`F1`, `H1`);
    worksheet.getCell(`F1`).value = `"УТВЕРЖДАЮ"`;

    worksheet.mergeCells(`F2`, `H2`);
    worksheet.getCell(`F2`).value = ``;

    worksheet.mergeCells(`F3`, `H3`);
    worksheet.getCell(`F3`).value = ``;

    worksheet.mergeCells(`A5`, `H5`);
    const title = worksheet.getCell("A5");
    title.value = `Акт списания №-${data.doc_num}.               ${HelperFunctions.returnStringDate(new Date(data.doc_date))}`;

    worksheet.mergeCells(`A6`, `H6`);
    const organ = worksheet.getCell("A6");
    organ.value = `От кого: ${data.responsible}`;

    worksheet.mergeCells(`A7`, `H7`);
    const comment = worksheet.getCell("A7");
    comment.value = `Описаниэ: ${data.opisanie ? data.opisanie : ""}`;

    worksheet.getRow(8).values = ["Наименование", "Ед.изм", "Кол.", "Цена", "Сумма", "Дебет", "Кредит", "Дата пр"];

    worksheet.columns = [
      { key: "name", width: 40 },
      { key: "edin", width: 10 },
      { key: "kol", width: 30 },
      { key: "sena", width: 30 },
      { key: "summa", width: 30 },
      { key: "debet", width: 30 },
      { key: "kredit", width: 30 },
      { key: "data", width: 30 },
    ];

    const groupedItogo = {};
    const itogo = { summa: 0 };

    data.childs.forEach((item) => {
      worksheet.addRow({
        name: item.name,
        edin: item.edin,
        kol: item.kol,
        sena: item.sena,
        summa: item.summa,
        debet: `${item.debet_schet} / ${item.debet_sub_schet}`,
        kredit: `${item.kredit_schet} / ${item.kredit_sub_schet}`,
        data: item.data_pereotsenka,
      });

      itogo.summa += item.summa;

      const key = `${item.debet_schet}_${item.debet_sub_schet}_${item.kredit_schet}`;

      if (!groupedItogo[key]) {
        groupedItogo[key] = {
          debet_schet: `${item.debet_schet}`,
          debet_sub_schet: `${item.debet_sub_schet}`,
          kredit_schet: `${item.kredit_schet}`,
          summa: 0,
        };
      }

      groupedItogo[key].summa += item.summa;
    });

    // itogo
    worksheet.addRow({
      sena: "Всего: ",
      summa: itogo.summa,
    });
    const bold_count = worksheet.rowCount;
    worksheet.addRow({});

    // group itogo
    worksheet.addRow({
      summa: `Дебет счет`,
      debet: `Дебет суб счет`,
      kredit: `Кредит счет`,
      data: "Сумма",
    });

    Object.values(groupedItogo).forEach((group) => {
      worksheet.addRow({
        summa: group.debet_schet,
        debet: group.debet_sub_schet,
        kredit: group.kredit_schet,
        data: group.summa,
      });
    });

    let column = worksheet.rowCount + 4;
    // podpis
    for (let podpis of data.podpis) {
      worksheet.mergeCells(`A${column}`, `B${column}`);
      const positionCell = worksheet.getCell(`A${column}`);
      positionCell.value = podpis.position;
      positionCell.note = JSON.stringify({
        horizontal: "left",
        border: "button",
      });

      const fioCell = worksheet.getCell(`C${column}`);
      fioCell.value = podpis.fio;
      fioCell.note = JSON.stringify({
        horizontal: "left",
        height: 30,
        border: "button",
      });
      column += 4;
    }

    worksheet.eachRow((row, rowNumber) => {
      let bold = false;
      let horizontal = `center`;
      let border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      if (rowNumber < 9 || rowNumber === bold_count) {
        worksheet.getRow(rowNumber).height = 30;
        bold = true;
      }

      if (rowNumber === 5 || rowNumber === 6 || rowNumber === 7) {
        horizontal = "left";
      }

      if (rowNumber > bold_count + 1) {
        bold = true;
      }

      row.eachCell((cell, column) => {
        const cellData = cell.note ? JSON.parse(cell.note) : {};

        if ((column === 4 || column === 5) && rowNumber > 8) {
          horizontal = "right";
        } else if (((column !== 4 && column !== 5) || rowNumber > bold_count) && rowNumber > 8 && rowNumber < column) {
          horizontal = `center`;
        } else if (rowNumber > bold_count + 2 && column === 8) {
          horizontal = `right`;
        } else {
          horizontal = `center`;
        }

        if (cellData.bold) {
          bold = true;
        }

        if (cellData.horizontal) {
          horizontal = cellData.horizontal;
        }

        if (cellData.height) {
          worksheet.getRow(rowNumber).height = cellData.height;
        }

        if (cellData.border === "button" || rowNumber < 4) {
          border = {
            bottom: { style: "thin" },
          };
        }

        if ((column > 2 && column < 6) || column === 8) {
          cell.numFmt = "#,##0.00";
        }

        Object.assign(cell, {
          font: { size: 13, name: "Times New Roman", bold },
          alignment: {
            vertical: "middle",
            horizontal,
            wrapText: true,
          },
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFFFFF" },
          },
          border,
        });

        if (cellData && Object.keys(cellData).length > 0) {
          cell.note = undefined;
        }
      });
    });

    const folder_path = path.join(__dirname, `../../../../../public/exports`);

    try {
      await fs.access(folder_path, fs.constants.W_OK);
    } catch (error) {
      await fs.mkdir(folder_path);
    }

    const fileName = `akt.${new Date().getTime()}.xlsx`;

    const filePath = `${folder_path}/${fileName}`;

    await workbook.xlsx.writeFile(filePath);

    return { fileName, filePath };
  }

  static async noticeExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("akt");

    worksheet.getCell(`A1`).value = `${data.region.name}`;

    worksheet.mergeCells(`A2`, `H2`);
    worksheet.getCell(`A2`).value = `"Извещение"`;

    worksheet.mergeCells(`A3`, `H3`);
    worksheet.getCell("A3").value =
      `о безвозмездной передаче основных средств -${data.doc_num}.               ${HelperFunctions.returnStringDate(new Date(data.doc_date))}`;

    worksheet.mergeCells(`A4`, `H4`);
    worksheet.getCell("A4").value = `КОММУ:`;

    worksheet.mergeCells(`A5`, `H5`);
    worksheet.getCell("A5").value = `Отправитель: ${data.region.name}. Получатель:`;

    worksheet.mergeCells(`A6`, `H6`);
    worksheet.getCell("A6").value = `Топшириш асоси (фармойиш рақами ва санаси): 2024 йил 23 декабрдаги 564-сонли Фармойишга асосан.`;

    worksheet.mergeCells(`A7`, `H7`);
    worksheet.getCell("A7").value = `№ доверенност: 03.01.2025 йилдаги № требование: 5                  Дата: `;

    worksheet.getRow(8).values = ["Наименование", "Ед.изм", "Полковник", "Цена", "Сумма", "Дебет", "Кредит", "Дата пр"];

    worksheet.columns = [
      { key: "name", width: 40 },
      { key: "edin", width: 15 },
      { key: "kol", width: 15 },
      { key: "cost", width: 25 },
      { key: "summa", width: 25 },
      { key: "debet", width: 25 },
      { key: "kredit", width: 25 },
      { key: "prixod", width: 25 },
    ];

    for (let child of data.childs) {
      worksheet.addRow({
        name: child.product.name,
        edin: child.edin,
        kol: child.kol,
        cost: child.sena,
        summa: child.summa,
        debet: `${child.debet_schet} / ${child.debet_sub_schet}`,
        kredit: `${child.kredit_schet} / ${child.kredit_sub_schet}`,
        prixod: HelperFunctions.returnLocalDate(child.data_pereotsenka),
      });
    }
    worksheet.addRow([]);

    const start_podpis_column = worksheet.rowCount;
    worksheet.getCell(`D${worksheet.rowCount}`).value = `Всего: `;
    worksheet.getCell(`E${worksheet.rowCount}`).value = data.summa;
    worksheet.addRow([]);

    worksheet.mergeCells(`A${worksheet.rowCount}`, `H${worksheet.rowCount}`);
    worksheet.getCell(`A${worksheet.rowCount}`).value =
      `Приложение: _____________________________________________________________________________________________`;
    worksheet.addRow([]);

    worksheet.mergeCells(`A${worksheet.rowCount}`, `H${worksheet.rowCount}`);
    worksheet.getCell(`A${worksheet.rowCount}`).value =
      `Начальник отдела :                                                               Бухгалтер: `;
    worksheet.addRow([]);

    const liniya_column = worksheet.rowCount;
    worksheet.mergeCells(`A${worksheet.rowCount}`, `H${worksheet.rowCount}`);
    worksheet.getCell(`A${worksheet.rowCount}`).value = `Л  и  н  и  я              о  т  р  е  з  а`;
    worksheet.addRow([]);

    const region_column = worksheet.rowCount;
    worksheet.mergeCells(`A${worksheet.rowCount}`, `H${worksheet.rowCount}`);
    worksheet.getCell(`A${worksheet.rowCount}`).value = data.region.name;
    worksheet.addRow([]);

    worksheet.mergeCells(`A${worksheet.rowCount}`, `H${worksheet.rowCount}`);
    worksheet.getCell(`A${worksheet.rowCount}`).value = "___________________________________";
    worksheet.addRow([]);

    worksheet.mergeCells(`A${worksheet.rowCount}`, `H${worksheet.rowCount}`);
    worksheet.getCell(`A${worksheet.rowCount}`).value = `№ ______________________________ Подтверждение к извещению №`;
    worksheet.addRow([]);

    worksheet.mergeCells(`A${worksheet.rowCount}`, `H${worksheet.rowCount}`);
    worksheet.getCell(`A${worksheet.rowCount}`).value =
      `Перечисленные в извещении материальные ценности получены и взяты на балансовый \n учет в ___________ квартале 20                  г. в сум ____________________________`;
    worksheet.addRow([]);

    worksheet.mergeCells(`A${worksheet.rowCount}`, `H${worksheet.rowCount}`);
    worksheet.getCell(`A${worksheet.rowCount}`).value =
      `_________________________________________________________________________________________________`;
    worksheet.addRow([]);

    const boss_column = worksheet.rowCount;
    worksheet.mergeCells(`A${worksheet.rowCount}`, `H${worksheet.rowCount}`);
    worksheet.getCell(`A${worksheet.rowCount}`).value = `Начальник ____________________________  Ст. бухгалтер`;
    worksheet.addRow([]);

    worksheet.eachRow((row, rowNumber) => {
      let bold = false;
      let horizontal = `center`;
      let border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      if (rowNumber < 9) {
        bold = true;
        worksheet.getRow(rowNumber).height = 30;
      }

      if (start_podpis_column <= rowNumber) {
        bold = true;
      }

      if (start_podpis_column < rowNumber) {
        horizontal = "left";
        border = {};
        worksheet.getRow(rowNumber).height = 40;
      }

      if (rowNumber > 3 && rowNumber < 8) {
        horizontal = "left";
      }

      if (rowNumber === liniya_column) {
        horizontal = "center";
        border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
        };
      }

      if (rowNumber === region_column) {
        border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
        };
      }

      if (rowNumber === boss_column) {
        horizontal = "center";
      }

      row.eachCell((cell, column) => {
        Object.assign(cell, {
          numFmt: "#,##0.00",
          font: { size: 13, name: "Times New Roman", bold },
          alignment: {
            vertical: "middle",
            horizontal,
            wrapText: true,
          },
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFFFFF" },
          },
          border,
        });
      });
    });

    const folder_path = path.join(__dirname, `../../../../../public/exports`);

    try {
      await fs.access(folder_path, fs.constants.W_OK);
    } catch (error) {
      await fs.mkdir(folder_path);
    }

    const fileName = `notice.${new Date().getTime()}.xlsx`;

    const filePath = `${folder_path}/${fileName}`;

    await workbook.xlsx.writeFile(filePath);

    return { fileName, filePath };
  }

  static async salesNvoiceExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("akt");

    worksheet.mergeCells(`A1`, `I1`);
    worksheet.getCell(`A1`).value = `"СЧЕТ-ФАКТУРА-НАКЛАДНАЯ"`;

    worksheet.mergeCells(`A2`, `I2`);
    worksheet.getCell("A2").value = `№ ${data.doc_num}  от ${HelperFunctions.returnStringDate(new Date(data.doc_date))}`;

    worksheet.mergeCells(`A3`, `I3`);
    worksheet.getCell("A3").value = `31.01.2025 йилдаги 1,2,3,6,8,9,10-сонли Юк хатилар`;

    worksheet.mergeCells(`A4`, `I4`);
    worksheet.getCell("A4").value = `к товаро-отгрузочным документам № `;

    worksheet.mergeCells(`A5`, `I5`);
    worksheet.getCell("A5").value = ``;

    // br
    worksheet.mergeCells(`A6`, `C6`);
    worksheet.getCell("A6").value = `Поставщик: ${data.main_schet.tashkilot_nomi}`;

    worksheet.mergeCells(`A7`, `C7`);
    worksheet.getCell("A7").value = `Адресс: ${data.main_schet.account_name}`;

    worksheet.mergeCells(`A8`, `C8`);
    worksheet.getCell("A8").value = `P / C: ${data.main_schet.account_number}`;

    worksheet.mergeCells(`A9`, `C9`);
    worksheet.getCell("A9").value = `Банк: ${data.main_schet.tashkilot_bank}`;

    worksheet.mergeCells(`A10`, `C10`);
    worksheet.getCell("A10").value =
      `MFO: ${data.main_schet.tashkilot_mfo}                                  INN: ${data.main_schet.tashkilot_inn} ОКЭТ 97920`;

    // br

    worksheet.mergeCells(`G6`, `I6`);
    worksheet.getCell("G6").value = `Получатель: Хисобдан чикариш`;

    worksheet.mergeCells(`G7`, `I7`);
    worksheet.getCell("G7").value = `Адресс: `;

    worksheet.mergeCells(`G8`, `I8`);
    worksheet.getCell("G8").value = `P / C: `;

    worksheet.mergeCells(`G9`, `I9`);
    worksheet.getCell("G9").value = `Банк: `;

    worksheet.mergeCells(`G10`, `I10`);
    worksheet.getCell("G10").value = `MFO:                                            INN:  `;

    worksheet.getRow(12).values = [
      "№",
      "Наименование товара (работ, услуг)",
      "Ед.изм",
      "Кол-во",
      "Цена",
      "Стоимость поставка",
      "Акцизный налог",
      "НДС",
      "Стоимость поставки с НДС",
    ];

    worksheet.columns = [
      { key: "order", width: 8 },
      { key: "name", width: 50 },
      { key: "edin", width: 15 },
      { key: "kol", width: 15 },
      { key: "cost", width: 25 },
      { key: "summa", width: 25 },
      { key: "nalog", width: 25 },
      { key: "nds", width: 25 },
      { key: "s_nds", width: 25 },
    ];

    data.childs.forEach((child, index) => {
      worksheet.addRow({
        order: String(index + 1),
        name: child.product.name,
        edin: child.edin,
        kol: child.kol,
        cost: child.sena,
        summa: child.summa,
        nalog: `Без акц. налог`,
        nds: `Без НДС`,
        s_nds: "",
      });
    });
    worksheet.addRow([]);

    const end_columns = worksheet.rowCount;
    worksheet.getCell(`E${worksheet.rowCount}`).value = `Итого: `;
    worksheet.getCell(`F${worksheet.rowCount}`).value = data.summa;
    worksheet.addRow([]);
    worksheet.addRow([]);

    const str_column = worksheet.rowCount;
    worksheet.mergeCells(`A${worksheet.rowCount}`, `F${worksheet.rowCount}`);
    worksheet.getCell(`A${worksheet.rowCount}`).value =
      `Прописью: Сто шестьдесят четыре миллиона сто пятьдесят пять тысяч четыреста двадцать \n пять с 00 т`;
    worksheet.addRow([]);

    worksheet.mergeCells(`A${worksheet.rowCount}`, `E${worksheet.rowCount}`);
    worksheet.getCell(`A${worksheet.rowCount}`).value =
      `Начальник ФЭО:                                                               Получил: `;
    worksheet.addRow([]);

    worksheet.mergeCells(`A${worksheet.rowCount}`, `E${worksheet.rowCount}`);
    worksheet.getCell(`A${worksheet.rowCount}`).value = `Бухгалтер: `;
    worksheet.addRow([]);

    worksheet.mergeCells(`A${worksheet.rowCount}`, `E${worksheet.rowCount}`);
    worksheet.getCell(`A${worksheet.rowCount}`).value = `Отпустил: `;
    worksheet.addRow([]);

    worksheet.eachRow((row, rowNumber) => {
      let bold = false;
      let horizontal = `center`;
      let border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      if (rowNumber === 1) {
        bold = true;
      }

      if (rowNumber < 5) {
        worksheet.getRow(rowNumber).height = 30;
        border = {};
      }

      if (rowNumber > 4 && rowNumber < 10) {
        worksheet.getRow(rowNumber).height = 20;
        border = {
          top: { style: "thin" },
        };
        horizontal = "left";
      }

      if (rowNumber === 10) {
        worksheet.getRow(rowNumber).height = 20;
        horizontal = "left";
        border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
        };
      }

      if (rowNumber === 12) {
        worksheet.getRow(rowNumber).height = 60;
        bold = true;
      }

      if (end_columns <= rowNumber) {
        bold = true;
      }

      if (end_columns < rowNumber) {
        worksheet.getRow(rowNumber).height = 40;
      }

      if (rowNumber > 12 && rowNumber < end_columns) {
        border = {
          bottom: { style: "thin" },
        };
      }

      if (str_column <= rowNumber) {
        horizontal = "left";
        border = {
          bottom: { style: "thin" },
        };
      }

      if (rowNumber === str_column) {
        worksheet.getRow(rowNumber).height = 50;
      }

      row.eachCell((cell, column) => {
        Object.assign(cell, {
          numFmt: "#,##0.00",
          font: { size: 13, name: "Times New Roman", bold },
          alignment: {
            vertical: "middle",
            horizontal,
            wrapText: true,
          },
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFFFFF" },
          },
          border,
        });
      });
    });

    const folder_path = path.join(__dirname, `../../../../../public/exports`);

    try {
      await fs.access(folder_path, fs.constants.W_OK);
    } catch (error) {
      await fs.mkdir(folder_path);
    }

    const fileName = `sales_nvoice.${new Date().getTime()}.xlsx`;

    const filePath = `${folder_path}/${fileName}`;

    await workbook.xlsx.writeFile(filePath);

    return { fileName, filePath };
  }

  static async delete(data) {
    const result = await db.transaction(async (client) => {
      const doc = await RasxodDB.delete([data.id], client);

      const dates = await Jur7SaldoService.createSaldoDate({
        ...data,
        client,
        doc_date: data.old_data.doc_date,
      });

      return { doc, dates };
    });

    return result;
  }

  static async create(data) {
    const summa = data.childs.reduce((acc, child) => acc + child.summa, 0);
    const result = await db.transaction(async (client) => {
      const doc = await RasxodDB.create(
        [
          data.user_id,
          data.doc_num,
          data.doc_date,
          data.j_o_num,
          data.opisanie,
          data.doverennost,
          summa,
          data.kimdan_id,
          data.kimdan_name,
          data.kimga_id,
          data.kimga_name,
          data.id_shartnomalar_organization,
          data.main_schet_id,
          data.budjet_id,
          tashkentTime(),
          tashkentTime(),
        ],
        client
      );

      await this.createChild({ ...data, docId: doc.id, client });

      const dates = await Jur7SaldoService.createSaldoDate({
        ...data,
        client,
      });

      return { doc, dates };
    });

    return result;
  }

  static async createChild(data) {
    const create_childs = [];
    for (let child of data.childs) {
      create_childs.push(
        child.naimenovanie_tovarov_jur7_id,
        child.kol,
        child.sena,
        child.summa,
        child.debet_schet,
        child.debet_sub_schet,
        child.kredit_schet,
        child.kredit_sub_schet,
        child.data_pereotsenka,
        data.user_id,
        data.docId,
        data.main_schet_id,
        child.iznos,
        child.iznos_summa,
        child.iznos_schet,
        child.iznos_sub_schet,
        tashkentTime(),
        tashkentTime()
      );
    }

    const _values = returnParamsValues(create_childs, 18);

    await RasxodDB.createChild(create_childs, _values, data.client);
  }

  static async update(data) {
    const summa = data.childs.reduce((acc, child) => acc + child.summa, 0);

    const result = await db.transaction(async (client) => {
      const doc = await RasxodDB.update(
        [
          data.doc_num,
          data.doc_date,
          data.j_o_num,
          data.opisanie,
          data.doverennost,
          summa,
          data.kimdan_id,
          data.kimdan_name,
          tashkentTime(),
          data.id,
        ],
        client
      );

      await RasxodDB.deleteRasxodChild([data.id], client);

      await this.createChild({ ...data, docId: data.id, doc, client });

      const date = HelperFunctions.getSmallDate({
        date1: data.doc_date,
        date2: data.old_data.doc_date,
      });

      const dates = await Jur7SaldoService.createSaldoDate({
        ...data,
        client,
        doc_date: date.date,
      });

      return { doc, dates };
    });

    return result;
  }

  static async getById(data) {
    const result = await RasxodDB.getById([data.region_id, data.id, data.main_schet_id], data.isdeleted);

    if (result) {
      result.schets_sums = HelperFunctions.jur7DebetKreditSums(result.childs);
    }

    return result;
  }

  static async get(data) {
    const result = await RasxodDB.get(
      [data.region_id, data.from, data.to, data.main_schet_id, data.offset, data.limit],
      data.search,
      data.order_by,
      data.order_type
    );
    return result;
  }
};
