const { db } = require("@db/index");
const { InternalDB } = require("./db");
const {
  tashkentTime,
  returnParamsValues,
  HelperFunctions,
} = require("@helper/functions");
const { Jur7SaldoDB } = require("@jur7_saldo/db");
const { Jur7SaldoService } = require("@jur7_saldo/service");
const fs = require("fs").promises;
const ExcelJS = require("exceljs");
const path = require("path");

exports.Jur7InternalService = class {
  static async aktExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("akt");

    worksheet.getCell(`B1`).value = `${data.region.name}`;

    worksheet.mergeCells(`A3`, `J3`);
    worksheet.getCell("A3").value =
      `ТРЕБОВАНИЕ на отпуск материалов №  ${data.doc_num}.    от           ${HelperFunctions.returnStringDate(new Date(data.doc_date))}`;

    worksheet.mergeCells(`A4`, `F4`);
    worksheet.getCell("A4").value =
      `Выдать (откуда):                                           ${data.kimdan} ${data.kimdan_podraz_name}`;

    worksheet.mergeCells(`A5`, `F5`);
    worksheet.getCell("A5").value = `Основание:`;

    worksheet.mergeCells(`A6`, `F6`);
    worksheet.getCell("A6").value =
      `Кому:                                                                 ${data.kimga} ${data.kimga_podraz_name}`;

    worksheet.getRow(8).values = [
      "№",
      "Наименование",
      "Инв. №",
      "Ед.изм",
      "треб.",
      "отпущ",
      "Цена",
      "Сумма",
      "Дебет",
      "Кредит",
    ];

    worksheet.columns = [
      { key: "order", width: 8 },
      { key: "name", width: 40 },
      { key: "inv", width: 10 },
      { key: "edin", width: 15 },
      { key: "kol", width: 15 },
      { key: "otsup", width: 15 },
      { key: "cost", width: 25 },
      { key: "summa", width: 25 },
      { key: "debet", width: 25 },
      { key: "kredit", width: 25 },
    ];

    const groupedItogo = {};
    const itogo = { summa: 0 };

    data.childs.forEach((child, index) => {
      worksheet.addRow({
        order: String(index + 1),
        name: child.product.name,
        inv: ".",
        edin: child.edin,
        kol: child.kol,
        otsup: ".",
        cost: child.sena,
        summa: child.summa,
        debet: `${child.debet_schet} | ${child.debet_sub_schet}`,
        kredit: `${child.kredit_schet} | ${child.kredit_sub_schet}`,
      });

      itogo.summa += child.summa;

      const key = `${child.debet_schet}_${child.debet_sub_schet}_${child.kredit_schet}`;

      if (!groupedItogo[key]) {
        groupedItogo[key] = {
          debet_schet: `${child.debet_schet}`,
          debet_sub_schet: `${child.debet_sub_schet}`,
          kredit_schet: `${child.kredit_schet}`,
          summa: 0,
        };
      }

      groupedItogo[key].summa += child.summa;
    });
    // itogo
    worksheet.addRow({
      cost: "Всего: ",
      summa: itogo.summa,
    });
    const itogo_column = worksheet.rowCount;
    worksheet.addRow({});

    // group itogo
    worksheet.addRow({
      cost: `Дебет счет`,
      summa: `Дебет суб счет`,
      debet: `Кредит счет`,
      kredit: "Сумма",
    });

    Object.values(groupedItogo).forEach((group) => {
      worksheet.addRow({
        cost: group.debet_schet,
        summa: group.debet_sub_schet,
        debet: group.kredit_schet,
        kredit: group.summa,
      });
    });

    const start_podpis = worksheet.rowCount;
    worksheet.addRow([]);
    worksheet.mergeCells(`A${worksheet.rowCount}`, `E${worksheet.rowCount}`);
    worksheet.getCell(`A${worksheet.rowCount}`).value = `Начальник ФЭО:`;
    worksheet.addRow([]);

    worksheet.addRow([]);
    worksheet.mergeCells(`A${worksheet.rowCount}`, `E${worksheet.rowCount}`);
    worksheet.getCell(`A${worksheet.rowCount}`).value = `Бухгалтер: `;
    worksheet.addRow([]);

    worksheet.addRow([]);
    worksheet.mergeCells(`A${worksheet.rowCount}`, `E${worksheet.rowCount}`);
    worksheet.getCell(`A${worksheet.rowCount}`).value =
      `Отпустил:                                                               Получил: `;
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

      if (rowNumber < 4) {
        border = {};
      }

      if (rowNumber < 7) {
        horizontal = "left";
      }

      if (rowNumber < 7 && rowNumber > 3) {
        border = {
          bottom: { style: "thin" },
        };
      }

      if (rowNumber === itogo_column) {
        bold = true;
      }

      if (rowNumber > start_podpis) {
        bold = true;
        horizontal = "left";
        worksheet.getRow(rowNumber).height = 40;
        border = {
          bottom: { style: "thin" },
        };
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

    const fileName = `akt.${new Date().getTime()}.xlsx`;

    const filePath = `${folder_path}/${fileName}`;

    await workbook.xlsx.writeFile(filePath);

    return { fileName, filePath };
  }

  static async delete(data) {
    const result = await db.transaction(async (client) => {
      const doc = await InternalDB.delete([data.id], client);

      const dates = await Jur7SaldoService.createSaldoDate({
        ...data,
        doc_date: data.old_data.doc_date,
        client,
      });

      return { dates, doc };
    });

    return result;
  }

  static async create(data) {
    const summa = data.childs.reduce((acc, child) => acc + child.summa, 0);

    const result = await db.transaction(async (client) => {
      const doc = await InternalDB.create(
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
          data.budjet_id,
          data.main_schet_id,
          tashkentTime(),
          tashkentTime(),
        ],
        client
      );

      await this.createChild({ ...data, docId: doc.id, client, doc: doc });

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
        data.budjet_id,
        child.iznos,
        child.iznos_summa,
        child.iznos_schet,
        child.iznos_sub_schet,
        child.iznos_start,
        tashkentTime(),
        tashkentTime()
      );

      const month = new Date(data.doc.doc_date).getMonth() + 1;
      const year = new Date(data.doc.doc_date).getFullYear();

      let month_iznos_summa = 0;

      await Jur7SaldoDB.create(
        [
          data.user_id,
          child.naimenovanie_tovarov_jur7_id,
          0,
          0,
          0,
          month,
          year,
          `${year}-${String(month).padStart(2, "0")}-01`,
          data.doc.doc_date,
          data.doc.doc_num,
          data.kimga_id,
          data.region_id,
          data.docId,
          child.iznos,
          0,
          child.iznos_schet,
          child.iznos_sub_schet,
          0,
          child.iznos_start,
          month_iznos_summa,
          child.debet_schet,
          child.debet_sub_schet,
          child.kredit_schet,
          child.kredit_sub_schet,
          data.budjet_id,
          data.main_schet_id,
          "prixod",
          tashkentTime(),
          tashkentTime(),
        ],
        data.client
      );
    }

    const _values = returnParamsValues(create_childs, 19);

    await InternalDB.createChild(create_childs, _values, data.client);
  }

  static async update(data) {
    const summa = data.childs.reduce((acc, child) => acc + child.summa, 0);

    const result = await db.transaction(async (client) => {
      const doc = await InternalDB.update(
        [
          data.doc_num,
          data.doc_date,
          data.j_o_num,
          data.opisanie,
          data.doverennost,
          summa,
          data.kimdan_id,
          data.kimga_id,
          data.kimga_name,
          data.kimdan_name,
          tashkentTime(),
          data.id,
        ],
        client
      );

      await InternalDB.deleteRasxodChild([data.id], client);

      await this.createChild({ ...data, docId: data.id, client, doc: doc });

      const date = HelperFunctions.getSmallDate({
        date1: data.doc_date,
        date2: data.old_data.doc_date,
      });

      const dates = await Jur7SaldoService.createSaldoDate({
        ...data,
        doc_date: date.date,
        client,
      });

      return { doc, dates };
    });

    return result;
  }

  static async getById(data) {
    const result = await InternalDB.getById(
      [data.region_id, data.id, data.main_schet_id],
      data.isdeleted
    );

    if (result) {
      result.schets_sums = HelperFunctions.jur7DebetKreditSums(result.childs);
    }

    return result;
  }

  static async get(data) {
    const result = await InternalDB.get(
      [
        data.region_id,
        data.from,
        data.to,
        data.main_schet_id,
        data.offset,
        data.limit,
      ],
      data.search,
      data.order_by,
      data.order_type
    );

    return result;
  }
};
