const { InternalDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');
const { ResponsibleDB } = require('../spravochnik/responsible/db')
const { db } = require('../../db/index')
const { childsSumma } = require('../../helper/functions')
const { MainSchetDB } = require('../../spravochnik/main.schet/db')

exports.InternalService = class {
  static async createInternal(req, res) {
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
      childs
    } = req.body;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.status(404).json({
        message: "main schet not found"
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
    let summa = 0;
    for (let child of childs) {
      summa += child.kol * child.sena;
    }
    let doc;
    await db.transaction(async client => {
      doc = await InternalDB.createInternal([
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
        main_schet_id,
        tashkentTime(),
        tashkentTime()
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
      doc.childs = await InternalDB.createInternalChild(result_childs, client)
    })

    return res.status(201).json({
      message: "Create doc internal successfully",
      data: doc
    })
  }

  static async getInternal(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, search, from, to, main_schet_id } = req.query;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.status(404).json({
        message: "main schet not found"
      })
    }
    const offset = (page - 1) * limit;
    const { data, total } = await InternalDB.getInternal([region_id, from, to, main_schet_id, offset, limit], search)
    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1
    }
    return res.status(200).json({
      message: "doc successfully get",
      meta,
      data: data || []
    })
  }

  static async getByIdInternal(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id
    const main_schet_id = req.query.main_schet_id
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.status(404).json({
        message: "main schet not found"
      })
    }
    const data = await InternalDB.getByIdInternal([region_id, id, main_schet_id], true)
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

  static async updateInternal(req, res) {
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
    const oldData = await InternalDB.getByIdInternal([region_id, id, main_schet_id])
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
    let summa = 0;
    for (let child of childs) {
      summa += child.kol * child.sena;
    }
    let doc;
    await db.transaction(async client => {
      doc = await InternalDB.updateInternal([
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
      await InternalDB.deleteInternalChild([id], client)
      doc.childs = await InternalDB.createInternalChild(result_childs, client)
    })

    return res.status(201).json({
      message: 'Update doc internal successfully',
      data: doc
    })
  }

  static async deleteInternal(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const main_schet_id = req.query.main_schet_id;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.status(404).json({
        message: "main schet not found"
      })
    }
    const internal_doc = await InternalDB.getByIdInternal([region_id, id, main_schet_id])
    if (!internal_doc) {
      return res.status(404).json({
        message: "internal doc not found"
      })
    }
    await db.transaction(async (client) => {
      await InternalDB.deleteInternal([id], client)
    })
    return res.status(200).json({
      message: 'delete internal doc successfully'
    })
  }
}