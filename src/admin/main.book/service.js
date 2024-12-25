const { EndMainBookDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');
const { BudjetDB } = require('../../spravochnik/budjet/db');
const { OperatsiiDB } = require('../../spravochnik/operatsii/db');
const { db } = require('../../db/index')
const { typeDocuments } = require('../../helper/data')

exports.EndService = class {
  static async getEnd(req, res) {
    const data = await EndMainBookDB.getEnd([])
    return res.status(200).json({
      message: "doc successfully get",
      meta: null,
      data: data || []
    })
  }

  static async getByIdEnd(req, res) {
    const region_id = req.query.region_id
    const id = req.params.id;
    const doc = await EndMainBookDB.getByIdEnd([region_id, id])
    if (!doc) {
      return res.status(404).json({
        message: "doc not found"
      })
    }
    doc.data = typeDocuments.map(item => ({ ...item }));
    for (let type of doc.data) {
      type.schets = await EndMainBookDB.getEndChilds([doc.id, type.type])
    }
    return res.status(201).json({
      message: "doc successfully get",
      data: doc
    });
  }

  static async updateEnd(req, res) {
    const id = req.params.id;
    const user_id = req.user.id;
    const region_id = req.query.region_id;
    const { status } = req.body;
    const old_doc = await EndMainBookDB.getByIdEnd([region_id, id])
    if (!old_doc) {
      return res.status(404).json({
        message: "doc not found"
      })
    }
    const data = await EndMainBookDB.updateEnd([status, user_id, tashkentTime(), id])
    return res.status(201).json({
      message: "Update main book successfully",
      data
    })
  }
}