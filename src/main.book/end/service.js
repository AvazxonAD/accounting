const { DocMainBookDB } = require('../doc/db');
const { EndMainBookDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');
const { MainSchetDB } = require('../../spravochnik/main.schet/db');
const { OperatsiiDB } = require('../../spravochnik/operatsii/db');
const { db } = require('../../db/index')
const { typeDocuments } = require('../../helper/data')
const { RegionDB } = require('../../auth/region/db')
const { BudjetDB } = require('../../spravochnik/budjet/db')

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

  static async getInfoAdmin(req, res) {
    const { budjet_id, month, year, region_id } = req.query;
    const budjet = await BudjetDB.getByIdBudjet([budjet_id])
    if (!budjet) {
      return res.status(404).json({
        message: "Budjet not found"
      })
    }
    const region = await RegionDB.getByIdRegion([region_id])
    if (!region) {
      return res.status(404).json({
        message: "Region not found"
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
          budjet_id,
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

  static async confirAdmin(req, res) {
    const { budjet_id, month, year, region_id } = req.query;
    const user_id = req.user.id;
    const budjet = await BudjetDB.getByIdBudjet([budjet_id])
    if (!budjet) {
      return res.status(404).json({
        message: "Budjet not found"
      })
    }
    const region = await RegionDB.getByIdRegion([region_id])
    if (!region) {
      return res.status(404).json({
        message: "Region not found"
      })
    }
    const docs = await EndMainBookDB.getEndAll([region_id, budjet_id, year, month]);
    try {
      await db.transaction(async client => {
        for(let doc of docs){
          await EndMainBookDB.confirAdmin([user_id, tashkentTime(), doc.id], client)
        }
      })
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error"
      })
    }
    return res.status(200).json({
      message: "confirm successfully"
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
    const docs = await EndMainBookDB.getEndAll([region_id, main_schet.spravochnik_budjet_name_id, year, month]);
    if (docs.length) {
      return res.status(409).json({
        message: "This data already exsist"
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

  static async getEndAdmin(req, res) {
    const data = await EndMainBookDB.getEndAdmin([])
    return res.status(200).json({
      message: "doc successfully get",
      meta: null,
      data: data || []
    })
  }

  static async updateEnd(req, res) {
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
    const docs = await EndMainBookDB.getEndAll([region_id, main_schet.spravochnik_budjet_name_id, year, month]);
    if (!docs.length) {
      return res.status(404).json({
        message: "Doc not found"
      })
    }
    let result = [];
    try {
      await db.transaction(async (client) => {
        for (let doc of docs) {
          await EndMainBookDB.deleteEnd([doc.id], client);
        }
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
      message: "Update doc successfully",
      data: result
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
    const docs = await EndMainBookDB.getEndAll([region_id, main_schet.spravochnik_budjet_name_id, year, month]);
    if (!docs.length) {
      return res.status(404).json({
        message: "Doc not found"
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