const { PrixodDB } = require('./db');
const { returnLocalDate, returnSleshDate } = require('../../helper/functions');
const { OrganizationDB } = require('../../spravochnik/organization/db')
const { ResponsibleDB } = require('../spravochnik/responsible/db')
const { ContractDB } = require('../../shartnoma/db')
const { db } = require('../../db/index')
const { MainSchetDB } = require('../../spravochnik/main.schet/db')
const ExcelJS = require('exceljs');
const path = require('path');
const { BudjetService } = require('../../spravochnik/budjet/services');
const { PrixodJur7Service } = require('./service');
const { GroupService } = require('../spravochnik/group/service')


exports.Controller = class {
  static async createPrixod(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const { main_schet_id, budjet_id } = req.query;
    const { kimdan_id, kimga_id, id_shartnomalar_organization, childs } = req.body;

    const budjet = await BudjetService.getByIdBudjet({ id: budjet_id });
    if (!budjet) {
      return res.error('Budjet not found', 404);
    }

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
      const contract = await ContractDB.getByIdContract([region_id, id_shartnomalar_organization], false, null, kimdan_id);
      if (!contract) {
        return res.error('Contract not found', 404);
      }
    }

    for (let child of childs) {
      const group = await GroupService.getByIdGroup({ id: child.group_jur7_id });
      if (!group) {
        return res.error('Group not found', 404);
      }

      if (!child.iznos && child.eski_iznos_summa > 0) {
        return res.error('The amount for non-refundable goods cannot be less than or equal to 0', 400);
      }
      child.iznos_foiz = group.iznos_foiz;
    }

    await PrixodJur7Service.createPrixod({ ...req.body, user_id, main_schet_id, budjet_id, childs });

    return res.success('Create successfully', 200);
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
      return res.error('Doc not found', 404);
    }

    return res.success('Get successfully', 200, null, data);
  }

  static async updatePrixod(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id;
    const { main_schet_id, budjet_id } = req.query;
    const { kimdan_id, kimga_id, id_shartnomalar_organization, childs } = req.body;

    const budjet = await BudjetService.getByIdBudjet({ id: budjet_id });
    if (!budjet) {
      return res.error('Budjet not found', 404);
    }

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

    for (let child of oldData.childs) {
      const check = await PrixodJur7Service.checkPrixodDoc({ product_id: child.naimenovanie_tovarov_jur7_id });
      if (check.length) {
        console.log(check)
        return res.error('Expense documents related to this record are available', 400, null, check);
      }
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
      const contract = await ContractDB.getByIdContract([region_id, id_shartnomalar_organization], false, null, kimdan_id);
      if (!contract) {
        return res.error('Contract not found', 404);
      }
    }

    for (let child of childs) {
      const group = await GroupService.getByIdGroup({ id: child.group_jur7_id });
      if (!group) {
        return res.error('Group not found', 404);
      }

      if (!child.iznos && child.eski_iznos_summa > 0) {
        return res.error('The amount for non-refundable goods cannot be less than or equal to 0', 400);
      }
      child.iznos_foiz = group.iznos_foiz;
    }

    await PrixodJur7Service.updatePrixod({ ...req.body, budjet_id, main_schet_id, user_id, id, childs });

    return res.success('Update successfully', 200);
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

    await PrixodJur7Service.deleteDoc({ id });

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