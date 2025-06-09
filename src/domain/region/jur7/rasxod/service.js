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

    worksheet.getRow(8).values = ["Наименование", "Ед.изм", "Кол.", "Цена", "Сумма", "Дебет", "Кредит", "Дата"];

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
