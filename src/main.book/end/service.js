const { EndMainBookDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');
const { BudjetDB } = require('../../spravochnik/budjet/db');
const { OperatsiiDB } = require('../../spravochnik/operatsii/db');
const { db } = require('../../db/index')
const { typeDocuments } = require('../../helper/data')

exports.EndService = class {
  static async createEnd(req, res) {
    const user_id = req.user.id;
    const region_id = req.user.region_id;
    const budjet_id = req.query.budjet_id;
    const {
      month,
      year,
      data
    } = req.body;
    const budjet = await BudjetDB.getByIdBudjet([budjet_id])
    if (!budjet) {
      return res.status(404).json({
        message: "budjet not found"
      })
    }
    const docs = await EndMainBookDB.getEnd([region_id, budjet.id], year, month);
    if (docs.length) {
      return res.status(409).json({
        message: "This data already exist"
      })
    }
    for (let type of data) {
      for (let schet of type.schets) {
        const operatsii = await OperatsiiDB.getByIdOperatsii([schet.id])
        if (!operatsii) {
          return res.status(404).json({
            message: "operatsii not found"
          })
        }
      }
    }
    const result = await db.transaction(async client => {
      const doc = await EndMainBookDB.createEnd([
        user_id,
        null,
        budjet_id,
        null,
        month,
        year,
        1,
        tashkentTime(),
        tashkentTime()
      ], client);
      const create_childs = []
      for (let type of data) {
        type.schets.forEach(item => {
          create_childs.push(
            item.id,
            doc.id,
            type.type,
            item.summa.debet_sum,
            item.summa.kredit_sum,
            tashkentTime(),
            tashkentTime()
          );
        });
      }
      doc.childs = await EndMainBookDB.createEndChild(create_childs, client);
      return doc;
    })
    return res.status(201).json({
      message: "Create doc successfully",
      data: result
    })
  }

  static async getEnd(req, res) {
    const region_id = req.user.region_id;
    const { budjet_id } = req.query;
    const budjet = await BudjetDB.getByIdBudjet([budjet_id])
    if (!budjet) {
      return res.status(404).json({
        message: "budjet not found"
      })
    }
    const data = await EndMainBookDB.getEnd([region_id, budjet.id])
    return res.status(200).json({
      message: "doc successfully get",
      meta: null,
      data: data || []
    })
  }

  static async getByIdEnd(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id;
    const { budjet_id } = req.query;
    const budjet = await BudjetDB.getByIdBudjet([budjet_id])
    if (!budjet) {
      return res.status(404).json({
        message: "budjet not found"
      })
    }
    const doc = await EndMainBookDB.getByIdEnd([region_id, budjet.id, id], true)
    if (!doc) {
      return res.status(404).json({
        message: "doc not found"
      })
    }
    doc.data = typeDocuments.map(item => ({...item}));
    for(let type of doc.data){
      type.schets = await EndMainBookDB.getEndChilds([doc.id, type.type])
    }
    return res.status(201).json({
      message: "doc successfully get",
      data: doc
    });
  }

  static async updateEnd(req, res) {
    const id = req.params.id;
    const region_id = req.user.region_id;
    const budjet_id = req.query.budjet_id;
    const {
      month,
      year,
      data
    } = req.body;
    const budjet = await BudjetDB.getByIdBudjet([budjet_id])
    if (!budjet) {
      return res.status(404).json({
        message: "budjet not found"
      })
    }
    const old_doc = await EndMainBookDB.getByIdEnd([region_id, budjet.id, id])
    if (!old_doc) {
      return res.status(404).json({
        message: "doc not found"
      })
    }
    if (old_doc.status === 2) {
      return res.status(400).json({
        message: "The confirmed document cannot be deleted"
      })
    }
    if (old_doc.year !== year || old_doc.month !== month) {
      const docs = await EndMainBookDB.getEnd([region_id, budjet.id], year, month);
      if (docs.length) {
        return res.status(409).json({
          message: "This data already exist"
        })
      }
    }
    const result = await db.transaction(async client => {
      const doc = await EndMainBookDB.updateEnd([month, year, tashkentTime(), id], client)
      await EndMainBookDB.deleteEndChilds([doc.id], client)
      const create_childs = []
      for (let type of data) {
        type.schets.forEach(item => {
          create_childs.push(
            item.id,
            doc.id,
            type.type,
            item.summa.debet_sum,
            item.summa.kredit_sum,
            tashkentTime(),
            tashkentTime()
          );
        });
      }
      doc.childs = await EndMainBookDB.createEndChild(create_childs, client);
      return doc;
    })
    return res.status(201).json({
      message: "UPDATE doc successfully",
      data: result
    })
  }

  static async deleteEnd(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id;
    const { budjet_id } = req.query;
    const budjet = await BudjetDB.getByIdBudjet([budjet_id])
    if (!budjet) {
      return res.status(404).json({
        message: "budjet not found"
      })
    }
    const doc = await EndMainBookDB.getByIdEnd([region_id, budjet.id, id])
    if (!doc) {
      return res.status(404).json({
        message: "doc not found"
      })
    }
    if (doc.status === 2) {
      return res.status(400).json({
        message: "The confirmed document cannot be deleted"
      })
    }
    await db.transaction(async client => {
      await EndMainBookDB.deleteEnd([id], client)
    })
    return res.status(200).json({
      message: 'delete doc successfully'
    })
  }

  static async getInfo(req, res) {
    const { year, month, budjet_id } = req.query;
    const budjet = await BudjetDB.getByIdBudjet([budjet_id])
    if (!budjet) {
      return res.status(404).json({
        message: "budjet not found"
      })
    }
    const schets = await OperatsiiDB.getOperatsii([])
    for (let type of typeDocuments) {
      type.schets = schets.map(item => ({ ...item }))
      type.debet_sum = 0;
      type.kredit_sum = 0;
      for (let schet of type.schets) {
        schet.summa = await EndMainBookDB.getInfo([year, month, type.type, budjet_id, schet.id])
      }
    }
    return res.status(200).json({
      message: "info get successfully",
      data: typeDocuments
    })
  }
}