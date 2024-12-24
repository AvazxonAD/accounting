const { DocMainBookDB } = require('../doc/db');
const { EndMainBookDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');
const { MainSchetDB } = require('../../spravochnik/main.schet/db');
const { OperatsiiDB } = require('../../spravochnik/operatsii/db');
const { db } = require('../../db/index')
const { typeDocuments } = require('../../helper/data')

exports.EndService = class {
  static async getInfo(req, res) {
    const region_id = req.user.region_id;
    const { main_schet_id, month, year } = req.query;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.status(404).json({
        message: "main schet not found"
      })
    }
    const { data } = await OperatsiiDB.getOperatsii([])
    for (let type of typeDocuments) {
      type.schets = data.map(item => ({ ...item }));
      type.debet_sum = 0;
      type.kredit_sum = 0;
      for (let schet of type.schets) {
        schet.summa = await DocMainBookDB.getTypeDocSumna([
          region_id,
          main_schet.spravochnik_budjet_name_id,
          type.key,
          month,
          year,
          schet.id
        ]);
        type.debet_sum += schet.summa.debet_sum;
        type.kredit_sum += schet.summa.kredit_sum;
      }
    }
    return res.status(200).json({
      message: 'get successfully',
      data: typeDocuments
    })
  }

  static async createEnd(req, res) {
    const region_id = req.user.region_id;
    const user_id = req.user.id;
    const main_schet_id = req.query.main_schet_id;
    const {
      month,
      year,
      data
    } = req.body;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.status(404).json({
        message: "main schet not found"
      })
    }
    let result = [];
    try {
      await db.transaction(async (client) => {
        for (let type of data) {
          for (let schet of type.schets) {
            const doc = await EndMainBookDB.createEnd([
              user_id,
              tashkentTime(),
              null,
              null,
              main_schet_id,
              schet.id,
              type.key,
              month,
              year,
              schet.summa.debet_sum,
              schet.summa.kredit_sum,
              1,
              tashkentTime(),
              tashkentTime()
            ], client);
            result.push(doc);
          }
        }
      })
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error"
      })
    }
    return res.status(201).json({
      message: "Create doc successfully",
      data: result
    })
  }

  static async getEnd(req, res) {
    const region_id = req.user.region_id;
    const { main_schet_id } = req.query;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.status(404).json({
        message: "main schet not found"
      })
    }
    const data = await EndMainBookDB.getEnd([region_id, main_schet.spravochnik_budjet_name_id])
    return res.status(200).json({
      message: "doc successfully get",
      meta: null,
      data: data || []
    })
  }

  static async getByIdEnd(req, res) {
    const region_id = req.user.region_id
    const { month, year, main_schet_id, type_document } = req.query;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.status(404).json({
        message: "main schet not found"
      })
    }
    const docs = await EndMainBookDB.getByIdEnd([region_id, year, month, type_document, main_schet.spravochnik_budjet_name_id])
    if (!docs.length) {
      return res.status(404).json({
        message: "doc not found"
      })
    }
    return res.status(201).json({
      message: "doc successfully get",
      data: {
        year,
        month,
        type_document,
        childs: docs
      }
    });
  }

  static async updateEnd(req, res) {
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
    const checkType = await OperatsiiDB.getByTypeOperatsii(['main_book'], type_document, true)
    if (!checkType.length) {
      return res.status(404).json({
        message: "type document not found"
      })
    }
    const docs = await EndMainBookDB.getByIdEnd([region_id, year, month, type_document, main_schet.spravochnik_budjet_name_id])
    if (!docs.length) {
      return res.status(404).json({
        message: "doc not found"
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
    let doc;
    await db.transaction(async client => {
      try {
        for (let doc of docs) {
          await EndMainBookDB.deleteEnd([doc.id], client);
        }
        doc = await EndMainBookDB.createEnd(result);
      } catch (error) {
        return res.status(500).json({
          message: "Internat server error"
        })
      }
    })
    return res.status(201).json({
      message: "Create doc successfully",
      data: doc
    })
  }

  static async deleteEnd(req, res) {
    const region_id = req.user.region_id
    const { month, year, main_schet_id, type_document } = req.query;
    const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id])
    if (!main_schet) {
      return res.status(404).json({
        message: "main schet not found"
      })
    }
    const docs = await EndMainBookDB.getByIdEnd([region_id, year, month, type_document, main_schet.spravochnik_budjet_name_id])
    if (!docs.length) {
      return res.status(404).json({
        message: "doc not found"
      })
    }
    await db.transaction(async client => {
      try {
        for (let doc of docs) {
          await EndMainBookDB.deleteEnd([doc.id], client);
        }
      } catch (error) {
        return res.status(500).json({
          message: "doc not found"
        })
      }
    })
    return res.status(200).json({
      message: 'delete doc successfully'
    })
  }
}