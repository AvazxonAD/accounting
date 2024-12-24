const { DocMainBookDB } = require('./db');
const { tashkentTime, checkTovarId, getDayStartEnd } = require('../../helper/functions');
const { MainSchetDB } = require('../../spravochnik/main.schet/db');
const { OperatsiiDB } = require('../../spravochnik/operatsii/db');

exports.DocService = class {
  static async createDoc(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;
    const {
      month,
      year,
      type_document,
      childs
    } = req.body;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.status(404).json({
        message: "main schet not found"
      })
    }
    for (let child of childs) {
      const operatsii = await OperatsiiDB.getByIdOperatsii([child.spravochnik_operatsii_id])
      if (!operatsii) {
        return res.status(404).json({
          message: "operatsii not found"
        })
      }
    }
    const result = [];

    childs.forEach(item => {
      result.push(
        user_id,
        main_schet_id,
        item.spravochnik_operatsii_id,
        type_document,
        month,
        year,
        item.debet_sum,
        item.kredit_sum,
        tashkentTime(),
        tashkentTime()
      );
    });

    const doc = await DocMainBookDB.createDoc(result);
    return res.status(201).json({
      message: "Create doc successfully",
      data: doc
    })
  }

  static async getDoc(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, type, month, year, main_schet_id } = req.query;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.status(404).json({
        message: "main schet not found"
      })
    }
    const offset = (page - 1) * limit;
    const { data, total } = await DocMainBookDB.getDoc([region_id, year, month, main_schet.spravochnik_budjet_name_id], offset, limit, type)
    let debet_sum = 0;
    let kredit_sum = 0;
    data?.forEach(item => {
      debet_sum += item.debet_sum;
      kredit_sum += item.kredit_sum;
    })
    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1,
      debet_sum,
      kredit_sum,
      result_sum: debet_sum - kredit_sum 
    }
    return res.status(200).json({
      message: "doc successfully get",
      meta,
      data: data || []
    })
  }

  static async getByIdDoc(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id
    const main_schet_id = req.query.main_schet_id
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.status(404).json({
        message: "main schet not found"
      })
    }
    const data = await DocMainBookDB.getByIdDoc([region_id, id, main_schet.spravochnik_budjet_name_id], true)
    if (!data) {
      return res.status(404).json({
        message: "doc not found"
      })
    }
    return res.status(201).json({
      message: "doc successfully get",
      data
    });
  }

  static async updateDoc(req, res) {
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
      childs
    } = req.body;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.status(404).json({
        message: "main schet not found"
      })
    }
    const oldData = await DocMainBookDB.getByIdDoc([region_id, id, main_schet_id])
    if (!oldData) {
      return res.status(404).json({
        message: "internal doc not found"
      })
    }
    const responsible = await ResponsibleDB.getByIdResponsible([region_id, kimga_id])
    if (!responsible) {
      return res.status(404).json({
        message: "responsible not found"
      })
    }
    const responsible2 = await ResponsibleDB.getByIdResponsible([region_id, kimdan_id])
    if (!responsible2) {
      return res.status(404).json({
        message: "responsible not found"
      })
    }
    for (let child of childs) {
      const product = await NaimenovanieDB.getByIdNaimenovanie([region_id, child.naimenovanie_tovarov_jur7_id])
      if (!product) {
        return res.status(404).json({
          message: "product not found"
        })
      }
      const tovar = await NaimenovanieDB.getProductKol([region_id, kimdan_id], null, child.naimenovanie_tovarov_jur7_id)
      const old_tovar = oldData.childs.find(item => item.naimenovanie_tovarov_jur7_id === child.naimenovanie_tovarov_jur7_id)
      const add = old_tovar ? old_tovar.kol : 0;
      if ((tovar[0].result + add) < child.kol) {
        return res.status(400).json({
          message: "The responsible person does not have sufficient information regarding this product."
        })
      }
    }
    const testTovarId = checkTovarId(childs)
    if (testTovarId) {
      return res.status(409).json({
        message: "The product ID was sent incorrectly"
      })
    }
    let summa = 0;
    for (let child of childs) {
      summa += child.kol * child.sena;
    }
    let doc;
    await db.transaction(async client => {
      doc = await DocMainBookDB.updateDoc([
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
        tashkentTime(),
        id
      ], client);
      const result_childs = childs.map(item => {
        item.summa = item.kol * item.sena
        if (item.nds_foiz) {
          item.nds_summa = item.nds_foiz / 100 * item.summa;
        } else {
          item.nds_summa = 0;
        }
        item.summa_s_nds = item.summa + item.nds_summa;
        item.user_id = user_id;
        item.document_vnutr_peremesh_jur7_id = doc.id;
        item.main_schet_id = main_schet_id;
        item.created_at = tashkentTime();
        item.updated_at = tashkentTime();
        return item;
      })
      await DocMainBookDB.deleteDocChild([id], client)
      doc.childs = await DocMainBookDB.createDocChild(result_childs, client)
    })

    return res.status(201).json({
      message: 'Update doc internal successfully',
      data: doc
    })
  }

  static async deleteDoc(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const main_schet_id = req.query.main_schet_id;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.status(404).json({
        message: "main schet not found"
      })
    }
    const internal_doc = await DocMainBookDB.getByIdDoc([region_id, id, main_schet_id])
    if (!internal_doc) {
      return res.status(404).json({
        message: "internal doc not found"
      })
    }
    await db.transaction(async (client) => {
      await DocMainBookDB.deleteDoc([id], client)
    })
    return res.status(200).json({
      message: 'delete internal doc successfully'
    })
  }
}