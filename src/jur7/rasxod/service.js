const { RasxodDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');
const { OrganizationDB } = require('../../spravochnik/organization/db')
const { ResponsibleDB } = require('../spravochnik/responsible/db')
const { ContractDB } = require('../../shartnoma/shartnoma/db')
const { db } = require('../../db/index')
const { childsSumma } = require('../../helper/functions')
const { MainSchetDB } = require('../../spravochnik/main.schet/db')

exports.RasxodService = class {
  static async createRasxod(req, res) {
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
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.status(404).json({
        message: "main schet not found"
      })
    }
    const organization = await OrganizationDB.getByIdorganization([region_id, kimga_id])
    if (!organization) {
      return res.status(404).json({
        message: "organization not found"
      })
    }
    const responsible = await ResponsibleDB.getByIdResponsible([region_id, kimdan_id])
    if (!responsible) {
      return res.status(404).json({
        message: "responsible not found"
      })
    }
    if (id_shartnomalar_organization) {
      const contract = await ContractDB.getByIdContract([region_id, id_shartnomalar_organization], false, null, kimga_id)
      if (!contract) {
        return res.status(404).json({
          message: "contract not found"
        })
      }
    }
    const summa = childsSumma(childs)
    let doc;
    await db.transaction(async client => {
      doc = await RasxodDB.createRasxod([
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
      ], client);
      const result_childs = childs.map(item => {
        item.user_id = user_id
        item.document_rasxod_jur7_id = doc.id;
        item.main_schet_id = main_schet_id;
        item.created_at = tashkentTime()
        item.updated_at = tashkentTime()
        return item
      })
      doc.childs = await RasxodDB.createRasxodChild(result_childs, client)
    })

    return res.status(201).json({
      message: "Create doc rasxod successfully",
      data: doc
    })
  }

  static async getRasxod(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, search, from, to, main_schet_id } = req.query;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if(!main_schet){
      return res.status(404).json({
        message: "main schet not found"
      })
    }
    const offset = (page - 1) * limit;
    const { data, total } = await RasxodDB.getRasxod([region_id, from, to, main_schet_id, offset, limit], search)
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

  static async getByIdRasxod(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id
    const main_schet_id = req.query.main_schet_id;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if(!main_schet){
      return res.status(404).json({
        message: "main schet not found"
      })
    }
    const data = await RasxodDB.getByIdRasxod([region_id, id, main_schet_id], true)
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

  static async updateRasxod(req, res) {
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
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if(!main_schet){
      return res.status(404).json({
        message: "main schet not found"
      })
    }
    const oldData = await RasxodDB.getByIdRasxod([region_id, id, main_schet_id])
    if (!oldData) {
      return res.status(404).json({
        message: "rasxod doc not found"
      })
    }
    const organization = await OrganizationDB.getByIdorganization([region_id, kimga_id])
    if (!organization) {
      return res.status(404).json({
        message: "organization not found"
      })
    }
    const responsible = await ResponsibleDB.getByIdResponsible([region_id, kimdan_id])
    if (!responsible) {
      return res.status(404).json({
        message: "responsible not found"
      })
    }
    if (id_shartnomalar_organization) {
      const contract = await ContractDB.getByIdContract([region_id, id_shartnomalar_organization], false, null, kimga_id)
      if (!contract) {
        return res.status(404).json({
          message: "contract not found"
        })
      }
    }
    const summa = childsSumma(childs)
    let doc;
    await db.transaction(async client => {
      doc = await RasxodDB.updateRasxod([
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
        item.document_rasxod_jur7_id = doc.id
        item.main_schet_id = main_schet_id;
        item.created_at = tashkentTime()
        item.updated_at = tashkentTime()
        return item
      })
      await RasxodDB.deleteRasxodChild([id], client)
      doc.childs = await RasxodDB.createRasxodChild(result_childs, client)
    })

    return res.status(201).json({
      message: "Update doc rasxod successfully",
      data: doc
    })
  }

  static async deleteRasxod(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id
    const main_schet_id = req.query.main_schet_id;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if(!main_schet){
      return res.status(404).json({
        message: "main schet not found"
      })
    }
    const rasxod_doc = await RasxodDB.getByIdRasxod([region_id, id, main_schet_id])
    if (!rasxod_doc) {
      return res.status(404).json({
        message: "rasxod doc not found"
      })
    }
    await db.transaction(async (client) => {
      await RasxodDB.deleteRasxod([id], client)
    })
    return res.status(200).json({
      message: 'delete rasxod doc successfully'
    })
  }

}