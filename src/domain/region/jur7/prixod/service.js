const { PrixodDB } = require("./db");
const { db } = require("@db/index");
const { tashkentTime, returnLocalDate, returnSleshDate, HelperFunctions } = require("@helper/functions");
const fs = require("fs").promises;
const ExcelJS = require("exceljs");
const path = require("path");
const { Jur7SaldoDB } = require("@jur7_saldo/db");
const { Saldo159Service } = require(`@saldo_159/service`);
const { Jur7SaldoService } = require("../saldo/service");

exports.PrixodJur7Service = class {
  static groupByNameSchetSubSchet(childs) {
    const grouped = {};

    for (const item of childs) {
      const key = `${item.product_name}-${item.schet}-${item.sub_schet}`;

      if (!grouped[key]) {
        grouped[key] = {
          product_name: item.product_name,
          schet: item.schet,
          sub_schet: item.sub_schet,
          edin: item.edin,
          kol: 0,
          sena: item.sena,
          summa: 0,
          eski_iznos_summa: 0,
          items: [],
        };
      }

      grouped[key].kol += item.kol;
      grouped[key].summa += item.summa;
      grouped[key].eski_iznos_summa += +item.eski_iznos_summa;
      grouped[key].items.push(item);
    }

    return Object.values(grouped);
  }

  static async prixodReport(data) {
    const result = await PrixodDB.prixodReport([data.region_id, data.from, data.to, data.main_schet_id]);

    await Promise.all(
      result.map(async (item) => {
        item.childs = await PrixodDB.prixodReportChild([item.id, data.main_schet_id]);
        return item;
      })
    );

    for (let item of result) {
      item.groupped = this.groupByNameSchetSubSchet(item.childs);
    }

    const Workbook = new ExcelJS.Workbook();
    const worksheet = Workbook.addWorksheet("jur_7_prixod");
    worksheet.mergeCells("A1", "D1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = `Приходные накладные от ${returnLocalDate(new Date(data.from))} до ${returnLocalDate(new Date(data.to))}`;
    worksheet.getRow(2).values = [
      "№ док",
      "дата",
      "Наименование организации",
      "Наим_тов",
      "Един",
      "Кол",
      "Цена",
      "Сумма",
      "№ дов",
      "Дата",
      "счет",
      "суб.счет",
    ];
    worksheet.columns = [
      { key: "doc_num", width: 30 },
      { key: "doc_date", width: 30 },
      { key: "organization", width: 30 },
      { key: "product", width: 30 },
      { key: "edim", width: 15 },
      { key: "count", width: 15 },
      { key: "cost", width: 15 },
      { key: "amount", width: 15 },
      { key: "c_doc_num", width: 15 },
      { key: "c_doc_date", width: 15 },
      { key: "schet", width: 15 },
      { key: "sub_schet", width: 15 },
    ];

    for (let item of result) {
      worksheet.addRow({
        doc_num: "№",
        doc_date: item.doc_num,
        organization: "",
        product: "от",
        edim: returnSleshDate(new Date(item.doc_date)),
        count: "",
        cost: "",
        amount: "",
        c_doc_num: "",
        c_doc_date: "",
        schet: "",
        sub_schet: "",
      });

      for (let i of item.groupped) {
        worksheet.addRow({
          doc_num: item.doc_num,
          doc_date: returnSleshDate(new Date(item.doc_date)),
          organization: item.organization,
          product: i.product_name,
          edim: i.edin,
          count: i.kol,
          cost: i.sena,
          amount: i.summa,
          c_doc_num: item.c_doc_num || "",
          c_doc_date: item.c_doc_date ? returnSleshDate(new Date(item.c_doc_date)) : "",
          schet: i.schet,
          sub_schet: i.sub_schet,
        });
      }

      worksheet.addRow({
        doc_num: "",
        doc_date: "",
        organization: "",
        product: "",
        edim: "",
        count: "",
        cost: "",
        amount: item.summa,
        c_doc_num: "",
        c_doc_date: "",
        schet: "",
        sub_schet: "",
      });
    }

    let summa = 0;
    for (let item of result) {
      summa += item.summa;
    }

    worksheet.addRow({
      doc_num: "обший итог",
      doc_date: "",
      organization: "",
      product: "",
      edim: "",
      count: "",
      cost: "",
      amount: summa,
      c_doc_num: "",
      c_doc_date: "",
      schet: "",
      sub_schet: "",
    });

    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, index) => {
        let bold = false;
        let size = 12;
        let argb = "FF000000";
        let horizontal = "center";
        let fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFFFFF" },
        };
        let border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        if (rowNumber < 3) {
          bold = true;
          size = 14;
          argb = "FF0000FF";
        }
        if (rowNumber > 2 && (cell.value === "№" || cell.value === "от")) {
          argb = "FF0000FF";
        }
        if (rowNumber > 2 && index === 2 && !/\/.*/.test(cell.value)) {
          horizontal = "left";
          bold = true;
        }
        if (rowNumber > 2 && index === 5 && /\/.*/.test(cell.value)) {
          horizontal = "right";
          bold = true;
        }
        if (rowNumber > 2 && (index === 1 || index === 3 || index === 5 || index === 9)) {
          horizontal = "left";
        }
        if (
          rowNumber > 2 &&
          (index === 2 || (index > 5 && index < 11 && index !== 9 && index !== 10) || index === 12)
        ) {
          horizontal = "right";
        }
        if (
          rowNumber > 2 &&
          index === 8 &&
          cell.value !== "" &&
          "" === worksheet.getRow(rowNumber).getCell(index - 1).value
        ) {
          bold = true;
        }
        if (fill && border) {
          Object.assign(cell, {
            numFmt: "#,##0",
            font: { size, name: "Times New Roman", bold, color: { argb } },
            alignment: { vertical: "middle", horizontal, wrapText: true },
            fill,
            border,
          });
        } else {
          Object.assign(cell, {
            numFmt: "#,##0",
            font: { size, name: "Times New Roman", bold, color: { argb } },
            alignment: { vertical: "middle", horizontal, wrapText: true },
          });
        }
      });
    });

    worksheet.getRow(1).height = 80;
    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 25;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 27;

    const folder_path = path.join(__dirname, `../../../../../public/exports`);
    try {
      await fs.access(folder_path, fs.constants.W_OK);
    } catch (error) {
      await fs.mkdir(folder_path);
    }

    const fileName = `jur7_prixod_${new Date().getTime()}.xlsx`;
    const filePath = `${folder_path}/${fileName}`;

    await Workbook.xlsx.writeFile(filePath);

    return { fileName, filePath };
  }

  static async createProduct(data) {
    const result = [];
    for (let doc of data.childs) {
      if (doc.product_id) {
        result.push({ id: doc.product_id, ...doc });
      } else {
        const product = await PrixodDB.createProduct(
          [
            data.user_id,
            data.budjet_id,
            doc.name,
            doc.unit_id,
            doc.group_jur7_id,
            doc.inventar_num,
            doc.serial_num,
            doc.iznos,
            tashkentTime(),
            tashkentTime(),
          ],
          data.client
        );
        result.push({ ...product, ...doc });
      }
    }

    return result;
  }

  static async create(data) {
    const result = await db.transaction(async (client) => {
      const childs = await this.createProduct({
        ...data,
        client,
      });

      const summa = HelperFunctions.returnSummaWithKol(data);

      const doc = await PrixodDB.create(
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
          data.budjet_id,
          data.main_schet_id,
          data.shartnoma_grafik_id,
          data.organization_by_raschet_schet_id,
          data.organization_by_raschet_schet_gazna_id,
          tashkentTime(),
          tashkentTime(),
        ],
        client
      );

      await this.createChild({
        ...data,
        docId: doc.id,
        doc: doc,
        client,
        childs,
      });

      const dates = await Jur7SaldoService.createSaldoDate({
        ...data,
        client,
      });

      return { doc, dates };
    });

    return result;
  }

  static async createChild(data) {
    for (const child of data.childs) {
      const summa = !child.summa ? child.kol * child.sena : child.summa;

      const nds_summa = child.nds_foiz ? (child.nds_foiz / 100) * summa : 0;

      const summa_s_nds = summa + nds_summa;

      child.old_iznos = child.old_iznos > summa_s_nds ? summa_s_nds : child.old_iznos;

      await PrixodDB.createChild(
        [
          child.id,
          child.kol,
          child.sena,
          summa,
          child.nds_foiz,
          nds_summa,
          summa_s_nds,
          child.debet_schet,
          child.debet_sub_schet,
          child.kredit_schet,
          child.kredit_sub_schet,
          child.data_pereotsenka,
          data.user_id,
          data.docId,
          data.budjet_id,
          child.old_iznos,
          child.iznos,
          child.old_iznos,
          child.iznos_schet,
          child.iznos_sub_schet,
          child.iznos_start,
          child.saldo_id,
          tashkentTime(),
          tashkentTime(),
        ],
        data.client
      );

      if (!child.saldo_id) {
        const month = new Date(data.doc.doc_date).getMonth() + 1;
        const year = new Date(data.doc.doc_date).getFullYear();

        const _saldo = await Jur7SaldoDB.create(
          [
            data.user_id,
            child.id,
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
            0,
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

        await data.client.query(
          `UPDATE document_prixod_jur7_child SET saldo_id = $1 WHERE document_prixod_jur7_id = $2`,
          [_saldo.id, data.docId]
        );
      } else {
        const saldo = await data.client.query(`SELECT * FROM saldo_naimenovanie_jur7 WHERE id = $1`, [child.saldo_id]);

        let prixod_id;
        if (!saldo.rows[0].prixod_id) {
          prixod_id = data.docId;
        } else {
          prixod_id = saldo.rows[0].prixod_id + `,${data.docId}`;
        }

        prixod_id = [...new Set(prixod_id.split(","))].join(",");
        await Jur7SaldoDB.updatePrixodId([prixod_id, child.saldo_id], data.client);
      }
    }
  }

  static async getProductIds(data) {
    const productIds = await PrixodDB.getProductsByDocId([data.id]);

    return productIds;
  }

  static async update(data) {
    const summa = data.childs.reduce((acc, child) => acc + child.kol * child.sena, 0);

    const result = await db.transaction(async (client) => {
      const doc = await PrixodDB.update(
        [
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
          data.shartnoma_grafik_id,
          data.organization_by_raschet_schet_id,
          data.organization_by_raschet_schet_gazna_id,
          tashkentTime(),
          data.id,
        ],
        client
      );

      const productIds = await PrixodDB.getProductsByDocId([data.id], client);

      await PrixodDB.deletePrixodChildUpdate(data.id, productIds, client);

      const childs = await this.createProduct({
        childs: data.childs,
        user_id: data.user_id,
        budjet_id: data.budjet_id,
        client,
      });

      await this.createChild({ ...data, docId: data.id, childs, client, doc });

      const _date = HelperFunctions.getSmallDate({
        date1: data.doc_date,
        date2: data.old_data.doc_date,
      });

      const dates = await Jur7SaldoService.createSaldoDate({
        ...data,
        client,
        doc_date: _date.date,
      });

      return { doc, dates };
    });

    return result;
  }

  static async checkPrixodDoc(data) {
    const result = await PrixodDB.checkPrixodDoc([data.product_id]);

    return result;
  }

  static async deleteDoc(data) {
    const result = await db.transaction(async (client) => {
      const productIds = await PrixodDB.getProductsByDocId([data.id], client);

      await PrixodDB.deletePrixodChild(data.id, productIds, client);

      const doc = await PrixodDB.delete([data.id], client);

      const dates = await Jur7SaldoService.createSaldoDate({
        ...data,
        doc_date: data.old_data.doc_date,
        client,
      });

      return { doc, dates };
    });

    return result;
  }

  static async get(data) {
    const result = await PrixodDB.get(
      [data.region_id, data.from, data.to, data.main_schet_id, data.offset, data.limit],
      data.search,
      data.order_by,
      data.order_type
    );

    return result;
  }

  static async getById(data) {
    const result = await PrixodDB.getById([data.region_id, data.id, data.main_schet_id], data.isdeleted);

    if (result) {
      result.schets_sums = HelperFunctions.jur7DebetKreditSums(result.childs);
    }

    return result;
  }

  static async aktExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("akt");

    worksheet.getCell(`A1`).value = `${data.region.name}`;

    worksheet.mergeCells(`A2`, `H2`);
    const title = worksheet.getCell("A2");
    title.value = `ПРИЕМНЫЙ АКТ №-${data.doc_num}.               ${HelperFunctions.returnStringDate(new Date(data.doc_date))}`;

    worksheet.mergeCells(`A3`, `H3`);
    const organ = worksheet.getCell("A3");
    organ.value = `Откуда: ${data.organ.name}                      ИНН: ${data.organ.inn}`;

    worksheet.mergeCells(`A4`, `H4`);
    const comment = worksheet.getCell("A4");
    comment.value = `Описаниэ: ${data.opisanie ? data.opisanie : ""}`;

    worksheet.getRow(5).values = ["Наименование", "Ед.изм", "Кол.", "Цена", "Сумма", "Дебет", "Кредит", "Дата"];

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

      if (rowNumber < 6 || rowNumber === bold_count) {
        worksheet.getRow(rowNumber).height = 30;
        bold = true;
      }

      if (rowNumber === 2 || rowNumber === 3 || rowNumber === 4) {
        horizontal = "left";
      }

      if (rowNumber > bold_count + 1) {
        bold = true;
      }

      row.eachCell((cell, column) => {
        const cellData = cell.note ? JSON.parse(cell.note) : {};

        if ((column === 4 || column === 5) && rowNumber > 5) {
          horizontal = "right";
        } else if (((column !== 4 && column !== 5) || rowNumber > bold_count) && rowNumber > 5 && rowNumber < column) {
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

        if (cellData.border === "button") {
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

  static async getByProductId(data) {
    const result = await PrixodDB.getByProductId([data.product_id, data.main_schet_id]);

    return result;
  }
};
