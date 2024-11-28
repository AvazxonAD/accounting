const { PrixodDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');
const { OrganizationDB } = require('../../spravochnik/organization/db')
const { ResponsibleDB } = require('../spravochnik/responsible/db')
const { ContractDB } = require('../../shartnoma/shartnoma/db')
const { db } = require('../../db/index')
const { childsSumma } = require('../../helper/functions')

exports.PrixodService = class {
  static async createPrixod(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
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
    const organization = await OrganizationDB.getByIdorganization([region_id, kimdan_id])
    if (!organization) {
      return res.status(404).json({
        message: "organization not found"
      })
    }
    const responsible = await ResponsibleDB.getByIdResponsible([region_id, kimga_id])
    if (!responsible) {
      return res.status(404).json({
        message: "responsible not found"
      })
    }
    if (id_shartnomalar_organization) {
      const contract = await ContractDB.getByIdContract([region_id, id_shartnomalar_organization], false, null, kimdan_id)
      if (!contract) {
        return res.status(404).json({
          message: "contract not found"
        })
      }
    }
    const summa = childsSumma(childs)
    let doc;
    await db.transaction(async client => {
      doc = await PrixodDB.createPrixod([
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
        tashkentTime(),
        tashkentTime()
      ], client);
      const result_childs = childs.map(item => {
        item.user_id = user_id
        item.document_prixod_jur7_id = doc.id
        item.created_at = tashkentTime()
        item.updated_at = tashkentTime()
        return item
      })
      doc.childs = await PrixodDB.createPrixodChild(result_childs, client)
    })

    return res.status(201).json({
      message: "Create doc prixod successfully",
      data: doc
    })
  }

  static async getPrixod(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, search, from, to } = req.query;
    const offset = (page - 1) * limit;
    const { data, total } = await PrixodDB.getPrixod([region_id, from, to, offset, limit], search)
    const pageCount = Math.ceil(total / limit);
    const meta = {
      pageCount: pageCount,
      count: total,
      currentPage: page,
      nextPage: page >= pageCount ? null : page + 1,
      backPage: page === 1 ? null : page - 1
    }
    return res.status(200).json({
      message: "group successfully get",
      meta,
      data: data || []
    })
  }

  static async getByIdPrixod(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id
    const data = await PrixodDB.getByIdPrixod([region_id, id], true)
    if (!data) {
      return res.status(404).json({
        message: "group not found"
      })
    }
    return res.status(201).json({
      message: "group successfully get",
      data
    });
  }

  static async updatePrixod(req, res) {
    const region_id = req.user.region_id;
    const id = req.params.id;
    const user_id = req.user.id;
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
    const oldData = await PrixodDB.getByIdPrixod([region_id, id])
    if(!oldData){
      return res.status(404).json({
        message: "prixod doc not found"
      })
    }
    const organization = await OrganizationDB.getByIdorganization([region_id, kimdan_id])
    if (!organization) {
      return res.status(404).json({
        message: "organization not found"
      })
    }
    const responsible = await ResponsibleDB.getByIdResponsible([region_id, kimga_id])
    if (!responsible) {
      return res.status(404).json({
        message: "responsible not found"
      })
    }
    if (id_shartnomalar_organization) {
      const contract = await ContractDB.getByIdContract([region_id, id_shartnomalar_organization], false, null, kimdan_id)
      if (!contract) {
        return res.status(404).json({
          message: "contract not found"
        })
      }
    }
    const summa = childsSumma(childs)
    let doc;
    await db.transaction(async client => {
      doc = await PrixodDB.updatePrixod([
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
      const result_childs = childs.map(item => {
        item.user_id = user_id
        item.document_prixod_jur7_id = doc.id
        item.created_at = tashkentTime()
        item.updated_at = tashkentTime()
        return item
      })
      await PrixodDB.deletePrixodChild([id], client)
      doc.childs = await PrixodDB.createPrixodChild(result_childs, client)
    })

    return res.status(201).json({
      message: "Update doc prixod successfully",
      data: doc
    })
  }

  static async deletePrixod(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id
    const prixod_doc = await PrixodDB.getByIdPrixod([region_id, id])
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

}