const { DocMainBookDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');
const { BudjetDB } = require('../../spravochnik/budjet/db');
const { MainBookSchetDB } = require('../../spravochnik/main.book.schet/db');
const { db } = require('../../db/index')

exports.DocService = class {
  static async createDoc(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const budjet_id = req.query.budjet_id;
    const {
      month,
      year,
      type_document,
      childs
    } = req.body;
    const budjet = await BudjetDB.getByIdBudjet([budjet_id])
    if (!budjet) {
      return res.status(404).json({
        message: "budjet not found"
      })
    }
    const docs = await DocMainBookDB.getDoc([region_id, budjet.id], year, month, type_document,);
    if (docs.length) {
      return res.status(409).json({
        message: "This data already exist"
      })
    }
    for (let child of childs) {
      const operatsii = await MainBookSchetDB.getByIdMainBookSchet([child.spravochnik_main_book_schet_id])
      if (!operatsii) {
        return res.status(404).json({
          message: "operatsii not found"
        })
      }
    }
    const doc = await db.transaction(async client => {
      const doc = await DocMainBookDB.createDoc([
        user_id,
        budjet_id,
        type_document,
        month,
        year,
        tashkentTime(),
        tashkentTime()
      ], client)
      const create_childs = []
      childs.forEach(item => {
        create_childs.push(
          item.spravochnik_main_book_schet_id,
          doc.id,
          item.debet_sum,
          item.kredit_sum,
          tashkentTime(),
          tashkentTime()
        );
      });
      doc.childs = await DocMainBookDB.createDocChild(create_childs, client);
      return doc;
    })
    return res.status(201).json({
      message: "Create doc successfully",
      data: doc
    })
  }

  static async getDoc(req, res) {
    const region_id = req.user.region_id;
    const { budjet_id } = req.query;
    const budjet = await BudjetDB.getByIdBudjet([budjet_id])
    if (!budjet) {
      return res.status(404).json({
        message: "budjet not found"
      })
    }
    const data = await DocMainBookDB.getDoc([region_id, budjet.id])
    for (let doc of data) {
      doc.summa = await DocMainBookDB.getDocChildsSum([doc.id])
    }
    return res.status(200).json({
      message: "doc successfully get",
      meta: null,
      data: data || []
    })
  }

  static async getByIdDoc(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id;
    const { budjet_id } = req.query;
    const budjet = await BudjetDB.getByIdBudjet([budjet_id])
    if (!budjet) {
      return res.status(404).json({
        message: "budjet not found"
      })
    }
    const doc = await DocMainBookDB.getByIdDoc([region_id, budjet.id, id], true)
    if (!doc) {
      return res.status(404).json({
        message: "doc not found"
      })
    }
    doc.childs = await DocMainBookDB.getDocChilds([doc.id]);
    return res.status(201).json({
      message: "doc successfully get",
      data: doc
    });
  }

  static async updateDoc(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const budjet_id = req.query.budjet_id;
    const id = req.params.id;
    const {
      month,
      year,
      type_document,
      childs
    } = req.body;
    const budjet = await BudjetDB.getByIdBudjet([budjet_id])
    if (!budjet) {
      return res.status(404).json({
        message: "budjet not found"
      })
    }
    const old_doc = await DocMainBookDB.getByIdDoc([region_id, budjet.id, id])
    if (!old_doc) {
      return res.status(404).json({
        message: "doc not found"
      })
    }
    if (old_doc.year !== year || old_doc.month !== month || old_doc.type_document !== type_document) {
      const docs = await DocMainBookDB.getDoc([region_id, budjet.id], year, month, type_document,);
      if (docs.length) {
        return res.status(409).json({
          message: "This data already exist"
        })
      }
    }
    for (let child of childs) {
      const operatsii = await MainBookSchetDB.getByIdMainBookSchet([child.spravochnik_main_book_schet_id])
      if (!operatsii) {
        return res.status(404).json({
          message: "operatsii not found"
        })
      }
    }
    const result = await db.transaction(async client => {
      const doc = await DocMainBookDB.updateDoc([type_document, month, year, tashkentTime(), id], client)
      await DocMainBookDB.deleteDocChilds([doc.id], client)
      const create_childs = []
      childs.forEach(item => {
        create_childs.push(
          item.spravochnik_main_book_schet_id,
          doc.id,
          item.debet_sum,
          item.kredit_sum,
          tashkentTime(),
          tashkentTime()
        );
      });
      doc.childs = await DocMainBookDB.createDocChild(create_childs, client);
      return doc;
    })
    return res.status(201).json({
      message: "UPDATE doc successfully",
      data: result
    })
  }

  static async deleteDoc(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id;
    const { budjet_id } = req.query;
    const budjet = await BudjetDB.getByIdBudjet([budjet_id])
    if (!budjet) {
      return res.status(404).json({
        message: "budjet not found"
      })
    }
    const doc = await DocMainBookDB.getByIdDoc([region_id, budjet.id, id])
    if (!doc) {
      return res.status(404).json({
        message: "doc not found"
      })
    }
    await db.transaction(async client => {
      await DocMainBookDB.deleteDoc([id], client)
    })
    return res.status(200).json({
      message: 'delete doc successfully'
    })
  }

  static async getOperatsiiMainBook(req, res) {
    const data = await DocMainBookDB.getOperatsiiMainBook([])
    return res.status(200).json({
      message: "main book schets successfully",
      data
    })
  }
}