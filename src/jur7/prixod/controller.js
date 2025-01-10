const { PrixodDB } = require('./db');
const { tashkentTime, checkTovarId, returnLocalDate, returnSleshDate } = require('../../helper/functions');
const { OrganizationDB } = require('../../spravochnik/organization/db')
const { ResponsibleDB } = require('../spravochnik/responsible/db')
const { ContractDB } = require('../../shartnoma/db')
const { db } = require('../../db/index')
const { IznosDB } = require('../iznos/db')
const { NaimenovanieDB } = require('../spravochnik/naimenovanie/db')
const { MainSchetDB } = require('../../spravochnik/main.schet/db')
const ExcelJS = require('exceljs');
const path = require('path');

exports.Controller = class {
  static async createPrixod(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;

    const {
      doc_num,
      doc_date,
      j_o_num,
      opisanie,
      doverennost,
      kimdan_id,
      kimdan_name,
      kimga_id,
      kimga_name,
      id_shartnomalar_organization,
      childs
    } = req.body;

    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
    if (!main_schet) {
      return res.error('Main schet not found', 404);
    }

    const organization = await OrganizationDB.getByIdorganization([region_id, kimdan_id]);
    if (!organization) {
      return res.error('Orgnaization not found', 404);
    }

    const responsible = await ResponsibleDB.getByIdResponsible([region_id, kimga_id]);
    if (!responsible) {
      return res.error('Responsible not found', 404);
    }

    if (id_shartnomalar_organization) {
      const contract = await ContractDB.getByIdContract(
        [region_id, id_shartnomalar_organization],
        false,
        null,
        kimdan_id
      );
      if (!contract) {
        return res.error('Contract not found', 404);
      }
    }

    // Check for products and duplicates
    for (const child of childs) {
      const product = await NaimenovanieDB.getByIdNaimenovanie([region_id, child.naimenovanie_tovarov_jur7_id]);
      if (!product) {
        return res.error('Product not found', 404);
      }

      const checkProduct = await PrixodDB.getByProductIdPrixod([region_id, main_schet_id, child.naimenovanie_tovarov_jur7_id]);
      if (checkProduct) {
        return res.error('This item has already been received', 409);
      }
    }

    // Validate product ID
    const invalidProduct = checkTovarId(childs);
    if (invalidProduct) {
      return res.error('The product ID was sent incorrectly', 409);
    }

    // Calculate summa
    let summa = childs.reduce((acc, child) => acc + child.kol * child.sena, 0);

    const result = await db.transaction(async (client) => {
      // Create the main document
      const doc = await PrixodDB.createPrixod(
        [
          user_id,
          doc_num,
          doc_date,
          j_o_num,
          opisanie,
          doverennost,
          summa,
          kimdan_id,
          kimdan_name,
          kimga_id,
          kimga_name,
          id_shartnomalar_organization,
          main_schet_id,
          tashkentTime(),
          tashkentTime()
        ],
        client
      );

      // Handle iznos data and create child
      const result_childs = [];
      for (const child of childs) {
        if (!child.iznos) {
          const summa = child.kol * child.sena;
          const nds_summa = child.nds_foiz ? (child.nds_foiz / 100) * summa : 0;
          const summa_s_nds = summa + nds_summa;
          result_childs.push(
            await PrixodDB.createPrixodChild([
              child.naimenovanie_tovarov_jur7_id,
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
              user_id,
              doc.id,
              main_schet_id,
              child.iznos,
              tashkentTime(),
              tashkentTime()
            ], client)
          )
        }
        if (child.iznos) {
          for (let i = 1; i <= child.kol; i++) {
            const summa = child.sena;
            const nds_summa = child.nds_foiz ? (child.nds_foiz / 100) * summa : 0;
            const summa_s_nds = summa + nds_summa;
            result_childs.push(
              await PrixodDB.createPrixodChild([
                child.naimenovanie_tovarov_jur7_id,
                1,
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
                user_id,
                doc.id,
                main_schet_id,
                child.iznos,
                tashkentTime(),
                tashkentTime()
              ], client)
            );

            const naimenovanie = await NaimenovanieDB.getByIdNaimenovanie([
              region_id,
              child.naimenovanie_tovarov_jur7_id
            ]);

            await IznosDB.createIznos([
              user_id,
              naimenovanie.inventar_num,
              naimenovanie.serial_num,
              child.naimenovanie_tovarov_jur7_id,
              1,
              child.sena,
              tashkentTime(),
              tashkentTime(),
              tashkentTime()
            ], client)
          }
        }
      }
      doc.childs = result_childs;
      return doc;
    });

    return res.success('Create successfully', 200, null, result);
  }

  static async getPrixod(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, search, from, to, main_schet_id } = req.query;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.status(404).json({
        message: "main schet not found"
      })
    }
    const offset = (page - 1) * limit;
    const { data, total } = await PrixodDB.getPrixod([region_id, from, to, main_schet_id, offset, limit], search)
    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1
    }
    return res.status(200).json({
      message: "prixod successfully get",
      meta,
      data: data || []
    })
  }

  static async getByIdPrixod(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id
    const main_schet_id = req.query.main_schet_id;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.status(404).json({
        message: "main schet not found"
      })
    }
    const data = await PrixodDB.getByIdPrixod([region_id, id, main_schet_id], true)
    if (!data) {
      return res.status(404).json({
        message: "prixod not found"
      })
    }
    return res.status(201).json({
      message: "prixod successfully get",
      data
    });
  }

  static async updatePrixod(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;
    const {
      doc_num,
      doc_date,
      j_o_num,
      opisanie,
      doverennost,
      kimdan_id,
      kimdan_name,
      kimga_id,
      kimga_name,
      id_shartnomalar_organization,
      childs
    } = req.body;

    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
    if (!main_schet) {
      return res.error('Main schet not found', 404);
    }

    const oldData = await PrixodDB.getByIdPrixod([region_id, id, main_schet_id])
    if (!oldData) {
      return res.status(404).json({
        message: "prixod doc not found"
      })
    }
    const organization = await OrganizationDB.getByIdorganization([region_id, kimdan_id]);
    if (!organization) {
      return res.error('Orgnaization not found', 404);
    }

    const responsible = await ResponsibleDB.getByIdResponsible([region_id, kimga_id]);
    if (!responsible) {
      return res.error('Responsible not found', 404);
    }

    if (id_shartnomalar_organization) {
      const contract = await ContractDB.getByIdContract(
        [region_id, id_shartnomalar_organization],
        false,
        null,
        kimdan_id
      );
      if (!contract) {
        return res.error('Contract not found', 404);
      }
    }

    // Validate product ID
    const invalidProduct = checkTovarId(childs);
    if (invalidProduct) {
      return res.error('The product ID was sent incorrectly', 409);
    }

    // Check for products and duplicates
    for (const child of childs) {
      const product = await NaimenovanieDB.getByIdNaimenovanie([region_id, child.naimenovanie_tovarov_jur7_id]);
      if (!product) {
        return res.error('Product not found', 404);
      }
      const test = oldData.childs.find(item => item.naimenovanie_tovarov_jur7_id === child.naimenovanie_tovarov_jur7_id);
      if (!test) {
        const checkProduct = await PrixodDB.getByProductIdPrixod([region_id, main_schet_id, child.naimenovanie_tovarov_jur7_id]);
        if (checkProduct) {
          return res.error('This item has already been received', 409);
        }
      }
    }
    // Calculate summa
    let summa = childs.reduce((acc, child) => acc + child.kol * child.sena, 0);

    const result = await db.transaction(async client => {
      const doc = await PrixodDB.updatePrixod([
        doc_num,
        doc_date,
        j_o_num,
        opisanie,
        doverennost,
        summa,
        kimdan_id,
        kimdan_name,
        kimga_id,
        kimga_name,
        id_shartnomalar_organization,
        tashkentTime(),
        id
      ], client);

      await PrixodDB.deletePrixodChild([id], client);

      // Handle iznos data and create child
      const result_childs = [];
      for (const child of childs) {
        if (!child.iznos) {
          const summa = child.kol * child.sena;
          const nds_summa = child.nds_foiz ? (child.nds_foiz / 100) * summa : 0;
          const summa_s_nds = summa + nds_summa;
          result_childs.push(
            await PrixodDB.createPrixodChild([
              child.naimenovanie_tovarov_jur7_id,
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
              user_id,
              doc.id,
              main_schet_id,
              child.iznos,
              tashkentTime(),
              tashkentTime()
            ], client)
          )
        }
        if (child.iznos) {
          for (let i = 1; i <= child.kol; i++) {
            const summa = child.sena;
            const nds_summa = child.nds_foiz ? (child.nds_foiz / 100) * summa : 0;
            const summa_s_nds = summa + nds_summa;
            result_childs.push(
              await PrixodDB.createPrixodChild([
                child.naimenovanie_tovarov_jur7_id,
                1,
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
                user_id,
                doc.id,
                main_schet_id,
                child.iznos,
                tashkentTime(),
                tashkentTime()
              ], client)
            );

            const naimenovanie = await NaimenovanieDB.getByIdNaimenovanie([
              region_id,
              child.naimenovanie_tovarov_jur7_id
            ]);

            await IznosDB.createIznos([
              user_id,
              naimenovanie.inventar_num,
              naimenovanie.serial_num,
              child.naimenovanie_tovarov_jur7_id,
              1,
              child.sena,
              tashkentTime(),
              tashkentTime(),
              tashkentTime()
            ], client)
          }
        }
      }
      doc.childs = result_childs;
      return doc;
    })

    return res.success('Update successfully', 200, null, result);
  }

  static async deletePrixod(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const main_schet_id = req.query.main_schet_id;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.status(404).json({
        message: "main schet not found"
      })
    }
    const prixod_doc = await PrixodDB.getByIdPrixod([region_id, id, main_schet_id])
    if (!prixod_doc) {
      return res.status(404).json({
        message: "prixod doc not found"
      })
    }
    await db.transaction(async (client) => {
      await PrixodDB.deletePrixod([id], client)
    })
    return res.status(200).json({
      message: 'delete prixod doc successfully'
    })
  }

  static async getPrixodReport(req, res) {
    const region_id = req.user.region_id;
    const { from, to, main_schet_id } = req.query;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
    if (!main_schet) {
      return res.status(404).json({
        message: "main schet not found"
      });
    }
    const data = await PrixodDB.prixodReport([region_id, from, to, main_schet_id]);
    await Promise.all(data.map(async (item) => {
      item.childs = await PrixodDB.prixodReportChild([item.id]);
      return item;
    }));
    const Workbook = new ExcelJS.Workbook();
    const worksheet = Workbook.addWorksheet('jur_7_prixod');
    worksheet.mergeCells('A1', 'D1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `Приходные накладные от ${returnLocalDate(new Date(from))} до ${returnLocalDate(new Date(to))}`;
    worksheet.getRow(2).values = [
      '№ док', 'дата', 'Наименование организации', 'Наим_тов',
      'Един', 'Кол', 'Цена', 'Сумма', '№ дов', 'Дата', 'счет', 'суб.счет'
    ];
    worksheet.columns = [
      { key: 'doc_num', width: 30 },
      { key: 'doc_date', width: 30 },
      { key: 'organization', width: 30 },
      { key: 'product', width: 30 },
      { key: 'edim', width: 15 },
      { key: 'count', width: 15 },
      { key: 'cost', width: 15 },
      { key: 'amount', width: 15 },
      { key: 'c_doc_num', width: 15 },
      { key: 'c_doc_date', width: 15 },
      { key: 'schet', width: 15 },
      { key: 'sub_schet', width: 15 }
    ];
    for (let item of data) {
      worksheet.addRow({
        doc_num: '№',
        doc_date: item.doc_num,
        organization: '',
        product: 'от',
        edim: returnSleshDate(new Date(item.doc_date)),
        count: '',
        cost: '',
        amount: '',
        c_doc_num: '',
        c_doc_date: '',
        schet: '',
        sub_schet: ''
      })
      for (let i of item.childs) {
        worksheet.addRow({
          doc_num: item.doc_num,
          doc_date: returnSleshDate(new Date(item.doc_date)),
          organization: item.organization,
          product: i.product_name,
          edim: i.edin,
          count: i.kol,
          cost: i.sena,
          amount: i.summa,
          c_doc_num: item.c_doc_num || '',
          c_doc_date: item.c_doc_date ? returnSleshDate(new Date(item.c_doc_date)) : '',
          schet: i.schet,
          sub_schet: i.sub_schet
        })
      }
      worksheet.addRow({
        doc_num: '',
        doc_date: '',
        organization: '',
        product: '',
        edim: '',
        count: '',
        cost: '',
        amount: item.summa,
        c_doc_num: '',
        c_doc_date: '',
        schet: '',
        sub_schet: ''
      })
    }
    let summa = 0;
    for (let item of data) {
      summa += item.summa
    }
    worksheet.addRow({
      doc_num: 'обший итог',
      doc_date: '',
      organization: '',
      product: '',
      edim: '',
      count: '',
      cost: '',
      amount: summa,
      c_doc_num: '',
      c_doc_date: '',
      schet: '',
      sub_schet: ''
    })
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, index) => {
        let bold = false;
        let size = 12;
        let argb = 'FF000000';
        let horizontal = 'center';
        let fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: "FFFFFFFF" } }
        let border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
        if (rowNumber < 3) {
          bold = true;
          size = 14;
          argb = "FF0000FF";
        }
        if (rowNumber > 2 && (cell.value === '№' || cell.value === 'от')) {
          argb = 'FF0000FF'
        }
        if (rowNumber > 2 && index === 2 && !/\/.*/.test(cell.value)) {
          horizontal = 'left';
          bold = true;
        }
        if (rowNumber > 2 && index === 5 && /\/.*/.test(cell.value)) {
          horizontal = 'right';
          bold = true;
        }
        if (rowNumber > 2 && (index === 1 || index === 3 || index === 5 || index === 9)) {
          horizontal = 'left';
        }
        if (rowNumber > 2 && (index === 2 || (index > 5 && index < 11 && index !== 9 && index !== 10) || index === 12)) {
          horizontal = 'right';
        }
        if (rowNumber > 2 && index === 8 && cell.value !== '' && '' === worksheet.getRow(rowNumber).getCell(index - 1).value) {
          bold = true;
        }
        if (fill && border) {
          Object.assign(cell, {
            numFmt: "#,##0",
            font: { size, name: 'Times New Roman', bold, color: { argb } },
            alignment: { vertical: "middle", horizontal, wrapText: true },
            fill,
            border
          });
        } else {
          Object.assign(cell, {
            numFmt: "#,##0",
            font: { size, name: 'Times New Roman', bold, color: { argb } },
            alignment: { vertical: "middle", horizontal, wrapText: true }
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
    const fileName = `jur7_prixod_${new Date().getTime()}`;
    const filePath = path.join(__dirname, `../../../public/exports/${fileName}.xlsx`);
    await Workbook.xlsx.writeFile(filePath);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.download(filePath);
  }
}