const { EndMainBookDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');
const { BudjetDB } = require('../../spravochnik/budjet/db');
const { MainBookSchetDB } = require('../../spravochnik/main.book.schet/db');
const { db } = require('../../db/index')
const { typeDocuments } = require('../../helper/data')

exports.EndService = class {
  static async createEnd(data) {
    const result = await db.transaction(async client => {
      const doc = await EndMainBookDB.createEnd([
        data.user_id,
        null,
        data.budjet_id,
        null,
        data.month,
        data.year,
        1,
        tashkentTime(),
        tashkentTime()
      ], client);
      const create_childs = []
      for (let type of data.data) {
        type.grafiks.forEach(item => {
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
    return result;
  }

  static async getEnd(data, year, month) {
    const result = await EndMainBookDB.getEnd([data.region_id, data.budjet_id], year, month)
    return result;
  }

  static async getEndChild(grafiks, doc) {
    doc.data = typeDocuments.map(item => ({ ...item }));
    for (let type of doc.data) {
      type.grafiks = grafiks.map(item => ({ ...item }))
      type.debet_sum = 0;
      type.kredit_sum = 0;
      for (let grafik of type.grafiks) {
        grafik.summa = await EndMainBookDB.getEndChildSum([doc.id, type.type, grafik.id]);
      }
    }
    return doc;
  }

  static async getByIdEnd(data, isdeleted) {
    const doc = await EndMainBookDB.getByIdEnd([data.region_id, data.budjet_id, data.id], isdeleted)
    return doc;
  }

  static async updateEnd(data) {
    const result = await db.transaction(async client => {
      const doc = await EndMainBookDB.updateEnd([data.month, data.year, tashkentTime(), data.id], client)
      await EndMainBookDB.deleteEndChilds([doc.id], client)
      const create_childs = []
      for (let type of data.data) {
        type.grafiks.forEach(item => {
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
    return result;
  }

  static async deleteEnd(id) {
    await db.transaction(async client => {
      await EndMainBookDB.deleteEnd([id], client)
    })
  }

  static async getInfo(grafiks, data) {
    for (let type of typeDocuments) {
      type.grafiks = grafiks.map(item => ({ ...item }))
      type.debet_sum = 0;
      type.kredit_sum = 0;
      for (let grafik of type.grafiks) {
        grafik.summa = await EndMainBookDB.getInfo([data.year, data.month, type.type, data.budjet_id, grafik.id])
      }
    };
    return typeDocuments;
  }

  static async getEndByType(data) {
    
  }
}