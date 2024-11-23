const {
  createJur3DB,
  createJur3ChildDB,
  getAllJur3DB,
  getElementByIdJur_3DB,
  deleteJur3ChildDB,
  updateJur3DB,
  deleteJur3DB,
  jur3CapService,
  getSchetService
} = require("./akt.service");
const ErrorResponse = require("../utils/errorResponse");
const { jur3Validation, validationQuery, jur3CapValidation } = require("../utils/validation");
const { getByIdMainSchetService } = require("../spravochnik/main.schet/main.schet.service");
const { getByIdOrganizationService } = require("../spravochnik/organization/organization.service");
const { getByIdShartnomaService } = require("../shartnoma/shartnoma.service");
const { getByIdOperatsiiService, getOperatsiiByChildArray } = require("../spravochnik/operatsii/operatsii.service");
const { getByIdPodrazlanieService } = require("../spravochnik/podrazdelenie/podrazdelenie.service");
const { getByIdSostavService } = require("../spravochnik/sostav/sostav.service");
const { getByIdTypeOperatsiiService } = require("../spravochnik/type.operatsii/type_operatsii.service");
const { returnAllChildSumma } = require("../utils/returnSumma");
const { getLogger, postLogger, putLogger, deleteLogger } = require('../utils/logger');
const { resFunc } = require('../utils/resFunc');
const { validationResponse } = require("../utils/response-for-validation");
const { errorCatch } = require("../utils/errorCatch");
const ExcelJS = require('exceljs')
const path = require('path')

// jur_3 create 
const jur_3_create = async (req, res) => {
  try {
    const data = validationResponse(jur3Validation, req.body)
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;
    const main_schet = await getByIdMainSchetService(region_id, main_schet_id);
    await getByIdOperatsiiService(data.spravochnik_operatsii_own_id, "general");
    await getByIdOrganizationService(region_id, data.id_spravochnik_organization,);
    if (data.shartnomalar_organization_id) {
      const shartnoma = await getByIdShartnomaService(region_id, main_schet.spravochnik_budjet_name_id, data.shartnomalar_organization_id, data.id_spravochnik_organization);
      if (!shartnoma.pudratchi_bool) {
        throw new ErrorResponse("conrtact not found", 404)
      }
    }
    for (let child of data.childs) {
      await getByIdOperatsiiService(child.spravochnik_operatsii_id, "Akt_priyom_peresdach");
      if (child.id_spravochnik_podrazdelenie) {
        await getByIdPodrazlanieService(region_id, child.id_spravochnik_podrazdelenie);
      }
      if (child.id_spravochnik_sostav) {
        await getByIdSostavService(region_id, child.id_spravochnik_sostav);
      }
      if (child.id_spravochnik_type_operatsii) {
        await getByIdTypeOperatsiiService(region_id, child.id_spravochnik_type_operatsii);
      }
    }
    const operatsiis = await getOperatsiiByChildArray(data.childs, 'Akt_priyom_peresdach')
    if (!checkSchetsEquality(operatsiis)) {
      throw new ErrorResponse('Multiple different schet values were selected. Please ensure only one type of schet is returned', 400)
    }
    const summa = returnAllChildSumma(data.childs);
    const result = await createJur3DB({ ...data, main_schet_id, user_id, summa });
    postLogger.info(`Jur3 doc muvaffaqiyatli kiritildi. UserId : ${user_id}`)
    return resFunc(res, 201, result);
  } catch (error) {
    errorCatch(error, res)
  }
}

// jur_3 get all
const jur_3_get_all = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const { page, limit, from, to, main_schet_id } = validationResponse(validationQuery, req.query)
    await getByIdMainSchetService(region_id, main_schet_id);
    const offset = (page - 1) * limit;
    const { data, total, summa } = await getAllJur3DB(region_id, main_schet_id, from, to, offset, limit);
    const pageCount = Math.ceil(total / limit);
    getLogger.info(`Jur3 doclar muvaffaqiyatli olindi. UserId : ${req.user.id}`)
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      summa,
    }
    resFunc(res, 200, data, meta)
  } catch (error) {
    errorCatch(error, res)
  }
}

// jur_3 update
const jur_3_update = async (req, res) => {
  try {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;
    const id = req.params.id;
    await getElementByIdJur_3DB(region_id, main_schet_id, id);
    const main_schet = await getByIdMainSchetService(region_id, main_schet_id);
    const data = validationResponse(jur3Validation, req.body)
    await getByIdOperatsiiService(data.spravochnik_operatsii_own_id, "general");
    await getByIdOrganizationService(region_id, data.id_spravochnik_organization,);
    if (data.shartnomalar_organization_id) {
      const shartnoma = await getByIdShartnomaService(region_id, main_schet.spravochnik_budjet_name_id, data.shartnomalar_organization_id, data.id_spravochnik_organization);
      if (!shartnoma.pudratchi_bool) {
        throw new ErrorResponse("conrtact not found", 404)
      }
    }
    for (let child of data.childs) {
      await getByIdOperatsiiService(child.spravochnik_operatsii_id, "Akt_priyom_peresdach");
      if (child.id_spravochnik_podrazdelenie) {
        await getByIdPodrazlanieService(region_id, child.id_spravochnik_podrazdelenie);
      }
      if (child.id_spravochnik_sostav) {
        await getByIdSostavService(region_id, child.id_spravochnik_sostav);
      }
      if (child.id_spravochnik_type_operatsii) {
        await getByIdTypeOperatsiiService(region_id, child.id_spravochnik_type_operatsii);
      }
    }
    const operatsiis = await getOperatsiiByChildArray(data.childs, 'Akt_priyom_peresdach')
    if (!checkSchetsEquality(operatsiis)) {
      throw new ErrorResponse('Multiple different schet values were selected. Please ensure only one type of schet is returned', 400)
    }
    const summa = returnAllChildSumma(data.childs);
    const akt = await updateJur3DB({ ...data, id, summa });
    const childs = []
    await deleteJur3ChildDB(id);
    for (let child of data.childs) {
      const child_data = await createJur3ChildDB({ ...child, main_schet_id, user_id, spravochnik_operatsii_own_id: data.spravochnik_operatsii_own_id, bajarilgan_ishlar_jur3_id: id });
      childs.push(child_data)
    }
    akt.childs = childs
    putLogger.info(`Jur3 doc muvaffaqiyatli yangilandi. UserId : ${user_id}`)
    resFunc(res, 200, akt)
  } catch (error) {
    errorCatch(error, res)
  }
}

// delete jur_3
const deleteJur_3 = async (req, res) => {
  try {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id
    await getByIdMainSchetService(region_id, main_schet_id);
    await getElementByIdJur_3DB(region_id, main_schet_id, id);
    await deleteJur3DB(id);
    deleteLogger.info(`Jur3 doc muvaffaqiyatli ochirildi. UserId : ${user_id}`)
    return resFunc(res, 200, 'deleted success')
  } catch (error) {
    errorCatch(error, res)
  }
}

// get element by id jur_3
const getElementByIdJur_3 = async (req, res) => {
  try {
    const main_schet_id = req.query.main_schet_id;
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id
    await getByIdMainSchetService(region_id, main_schet_id);
    const result = await getElementByIdJur_3DB(region_id, main_schet_id, id, true);
    getLogger.info(`Jur3 doc muvaffaqiyatli olindi. UserId : ${user_id}`)
    resFunc(res, 200, result)
  } catch (error) {
    errorCatch(error, res)
  }
}

const jur3Cap = async (req, res) => {
  try {
    const reggion_id = req.user.region_id
    const { from, to } = validationResponse(jur3CapValidation, req.query)
    const schets = await getSchetService(reggion_id)
    const workbook = new ExcelJS.Workbook();
    const fileName = `jur3_cap${new Date().getTime()}.xlsx`;
    let worksheet = null;
    if (schets.length === 0) {
      worksheet = workbook.addWorksheet(`data not found`);
    }
    for (let schet of schets) {
      const data = await jur3CapService(reggion_id, from, to, `${schet.schet}`)
      let row_number = 4
      worksheet = workbook.addWorksheet(`${schet.schet}`);
      worksheet.pageSetup.margins.left = 0
      worksheet.pageSetup.margins.header = 0
      worksheet.pageSetup.margins.footer = 0
      worksheet.pageSetup.margins.bottom = 0
      worksheet.mergeCells(`A1`, `H1`)
      const title = worksheet.getCell(`A1`)
      title.value = `Журнал-ордер № 3 Счет: ${schet.schet}`
      worksheet.mergeCells('A2', 'H2')
      const title2 = worksheet.getCell(`A2`)
      title2.value = `Подлежит записи в главную книгу`
      worksheet.mergeCells(`A3`, `C3`)
      const title3_1 = worksheet.getCell('A3')
      title3_1.value = 'Дебет'
      const title3_2 = worksheet.getCell(`D3`)
      title3_2.value = 'Кредит'
      worksheet.mergeCells('E3', 'H3')
      const title3_3 = worksheet.getCell('E3')
      title3_3.value = 'Сумма'
      const css_array = [title, title2, title3_1, title3_2, title3_3]
      let itogo = 0
      for (let column of data) {
        worksheet.mergeCells(`A${row_number}`, `C${row_number}`)
        const title3_1 = worksheet.getCell(`A${row_number}`)
        title3_1.value = `${column.schet}   ${column.smeta_number}`
        worksheet.mergeCells(`E${row_number}`, `H${row_number}`)
        const title3_3 = worksheet.getCell(`E${row_number}`)
        title3_3.value = column.summa
        row_number++
        itogo += column.summa
        const css_array = [title3_1, title3_2, title3_3]
        css_array.forEach((coll, index) => {
          let horizontal = 'center'
          if (index === 2) horizontal = 'right'
          if (index === 0) horizontal = 'left'
          Object.assign(coll, {
            numFmt: '#,##0.00',
            font: { size: 12, color: { argb: 'FF000000' }, name: 'Times New Roman' },
            alignment: { vertical: 'middle', horizontal },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
            border: {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            }
          });
        })
      }
      worksheet.mergeCells(`D4`, `D${row_number - 1}`)
      const kriditSchetCell = worksheet.getCell(`D4`)
      kriditSchetCell.value = `${schet.schet}`
      worksheet.mergeCells(`A${row_number}`, `D${row_number}`)
      const itogoStr = worksheet.getCell(`A${row_number}`)
      itogoStr.value = `Всего кредит`
      worksheet.mergeCells(`E${row_number}`, `H${row_number}`)
      const itogoSumma = worksheet.getCell(`E${row_number}`)
      itogoSumma.value = itogo
      css_array.push(kriditSchetCell, itogoStr, itogoSumma)
      css_array.forEach((coll, index) => {
        let vertical = 'middle'
        let bold = true
        let horizontal = 'center'
        if (index === 5) vertical = 'top', bold = false
        if (index === 6) horizontal = 'left'
        if (index === 7) horizontal = 'right'
        Object.assign(coll, {
          numFmt: '#,##0.00',
          font: { size: 12, bold, color: { argb: 'FF000000' }, name: 'Times New Roman' },
          alignment: { vertical, horizontal },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
          border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        });
      })
      worksheet.getRow(1).height = 35
      worksheet.getRow(2).height = 25
      worksheet.getColumn(1).width = 5
      worksheet.getColumn(2).width = 5
      worksheet.getColumn(3).width = 5
      worksheet.getColumn(5).width = 5
      worksheet.getColumn(6).width = 5
    }

    const filePath = path.join(__dirname, '../../public/uploads/' + fileName);
    await workbook.xlsx.writeFile(filePath);
    return res.download(filePath, (err) => {
      if (err) throw new ErrorResponse(err, err.statusCode);
    });
  } catch (error) {
    errorCatch(error, res)
  }
}

module.exports = {
  jur_3_create,
  jur_3_get_all,
  jur_3_update,
  getElementByIdJur_3,
  deleteJur_3,
  jur3Cap,
  jur3Cap
};
