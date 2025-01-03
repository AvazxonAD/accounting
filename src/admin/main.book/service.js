const { EndMainBookDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');
const { MainBookSchetDB } = require('../../spravochnik/main.book.schet/db');
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
    const {data: schets} = await MainBookSchetDB.getMainBookSchet([0, 9999])
    for (let type of doc.data) {
      type.schets = schets.map(item => ({ ...item }))
      type.debet_sum = 0;
      type.kredit_sum = 0;
      for (let schet of type.schets) {
        schet.summa = await EndMainBookDB.getEndChilds([doc.id, type.type, schet.id])
        type.kredit_sum += schet.summa.kredit_sum;
        type.debet_sum += schet.summa.debet_sum
      }
    }
    for (let item of doc.data) {
      if (item.type === 'start' || item.type === 'end') {
        const result = item.debet_sum - item.kredit_sum
        item.debet_sum = result > 0 ? result : 0;
        item.kredit_sum = result < 0 ? Math.abs(result) : 0;
      }
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