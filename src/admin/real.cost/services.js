const { EndMainBookDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');
const { MainBookSchetDB } = require('../../spravochnik/main.book.schet/db');
const { typeDocuments } = require('../../helper/data')

exports.EndService = class {
  static async getEnd() {
    const result = await EndMainBookDB.getEnd([])
    return result;
  }

  static async getByIdEnd(region_id, id) {
    const doc = await EndMainBookDB.getByIdEnd([region_id, id])
    return doc;
  }

  static async getEndChilds(doc, grafiks) {
    const result = typeDocuments.map(item => ({ ...item }));
    for (let type of result) {
      type.grafiks = grafiks.map(item => ({ ...item }))
      type.debet_sum = 0;
      type.kredit_sum = 0;
      for (let grafik of type.grafiks) {
        grafik.summa = await EndMainBookDB.getEndChilds([doc.id, type.type, grafik.id])
        type.kredit_sum += grafik.summa.kredit_sum;
        type.debet_sum += grafik.summa.debet_sum
      }
    }
    for (let item of result) {
      if (item.type === 'start' || item.type === 'end') {
        const result = item.debet_sum - item.kredit_sum
        item.debet_sum = result > 0 ? result : 0;
        item.kredit_sum = result < 0 ? Math.abs(result) : 0;
      }
    }
    return result;
  }

  static async updateEnd(data) {
    const result = await EndMainBookDB.updateEnd([data.status, data.user_id, tashkentTime(), data.id])
    return result;
  }
}