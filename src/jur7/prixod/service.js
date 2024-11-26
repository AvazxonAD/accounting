const { PereotsenkaDB } = require('../pereotsenka/db');
const { PrixodDB } = require('./db');
const { tashkentTime } = require('../../helper/functions');
const { OrganizationDB } = require('../../spravochnik/organization/db')
const { ResponsibleDB } = require('../responsible/db')
const { ContractDB } = require('../../shartnoma/shartnoma/db')
const { db } = require('../../db/index')

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
      summa,
      kimdan_id,
      kimdan_name,
      kimga_id,
      kimga_name,
      id_shartnomalar_organization,
      budjet_id
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
      const contract = ContractDB.getByIdContract([region_id, budjet_id, id_shartnomalar_organization])
      if (!contract) {
        return res.status(404).json({
          message: "contract not found"
        })
      }
    }
    const result = db.transaction(client => ())
    const result = await PrixodDB.createPrixod([
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
    ], db.client)
    return res.status(201).json({
      message: "Create group successfully",
      data: result
    })
  }

  static async getPrixod(req, res) {
    const region_id = req.user.region_id;
    const { page, limit, search } = req.query;
    const offset = (page - 1) * limit;
    const { data, total } = await PrixodDB.getPrixod([region_id, offset, limit], search)
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
    const region_id = req.user.region_id
    const {
      pereotsenka_jur7_id,
      name,
      schet,
      iznos_foiz,
      provodka_debet,
      provodka_subschet,
      provodka_kredit
    } = req.body;
    const id = req.params.id
    const group = await PrixodDB.getByIdPrixod([region_id, id])
    if (!group) {
      return res.status(404).json({
        message: "group not found"
      })
    }
    const pereotsenka = await PereotsenkaDB.getByIdPereotsenka([pereotsenka_jur7_id])
    if (!pereotsenka) {
      return res.status(404).json({
        message: "pereotsenka not found"
      })
    }
    const result = await PrixodDB.updatePrixod([
      pereotsenka_jur7_id,
      name,
      schet,
      iznos_foiz,
      provodka_debet,
      provodka_subschet,
      provodka_kredit,
      tashkentTime(),
      id
    ])
    return res.status(200).json({
      message: 'Update successful',
      data: result
    });
  }

  static async deletePrixod(req, res) {
    const region_id = req.user.region_id
    const id = req.params.id
    const group = await PrixodDB.getByIdPrixod([region_id, id])
    if (!group) {
      return res.status(404).json({
        message: "group not found"
      })
    }
    await PrixodDB.deletePrixod([id])
    return res.status(200).json({
      message: 'delete group successfully'
    })
  }

}

const createDocumentJur7 = async (data) => {
  const client = await pool.connect()
  try {
    await client.query(`BEGIN`)
    const result = await client.query(
      `
      INSERT INTO document_prixod_jur7 (
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
        created_at,
        updated_at
      ) 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING * 
      `,
      [
        data.user_id,
        data.doc_num,
        data.doc_date,
        data.j_o_num,
        data.opisanie,
        data.doverennost,
        data.summa,
        data.kimdan_id,
        data.kimdan_name,
        data.kimga_id,
        data.kimga_name,
        data.id_shartnomalar_organization,
        tashkentTime(),
        tashkentTime()
      ]);
    const document = result.rows[0];
    const queryArray = [];
    for (let child of data.childs) {
      const query = client.query(
        `
        INSERT INTO document_prixod_jur7_child (
          user_id,
          document_prixod_jur7_id,
          naimenovanie_tovarov_jur7_id,
          kol,
          sena,
          summa,
          debet_schet,
          debet_sub_schet,
          kredit_schet,
          kredit_sub_schet,
          data_pereotsenka,
          created_at,
          updated_at
        ) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
        `,
        [
          data.user_id,
          document.id,
          child.naimenovanie_tovarov_jur7_id,
          child.kol,
          child.sena,
          child.summa,
          child.debet_schet,
          child.debet_sub_schet,
          child.kredit_schet,
          child.kredit_sub_schet,
          child.data_pereotsenka,
          tashkentTime(),
          tashkentTime()
        ]);
      queryArray.push(query);
    }
    const childs = await Promise.all(queryArray);
    const childs_doc = childs.map(item => item.rows[0])
    document.childs = childs_doc
    await client.query(`COMMIT`)
    return document
  } catch (error) {
    await client.query('ROLLBACK')
    throw new ErrorResponse(error, error.statusCode);
  } finally {
    client.release()
  }
};

const getAllDocumentJur7 = async (region_id, from, to, offset, limit) => {
  try {
    const result = await pool.query(
      `
          WITH data AS (
            SELECT 
              d_j.id, 
              d_j.doc_num,
              TO_CHAR(d_j.doc_date, 'YYYY-MM-DD') AS doc_date, 
              d_j.opisanie, 
              d_j.summa, 
              d_j.kimdan_name, 
              d_j.kimga_name
            FROM document_prixod_jur7 AS d_j
            JOIN users AS u ON u.id = d_j.user_id
            JOIN regions AS r ON r.id = u.region_id
            WHERE r.id = $1 
              AND d_j.isdeleted = false 
              AND d_j.doc_date BETWEEN $2 AND $3 
            ORDER BY d_j.doc_date
            OFFSET $4 LIMIT $5
          )
          SELECT 
            ARRAY_AGG(row_to_json(data)) AS data,
            (
              SELECT COALESCE(SUM(d_j.summa), 0)
              FROM document_prixod_jur7 AS d_j
              JOIN users AS u ON u.id = d_j.user_id
              JOIN regions AS r ON r.id = u.region_id  
              WHERE r.id = $1 
                AND d_j.doc_date BETWEEN $2 AND $3 
                AND d_j.isdeleted = false
            )::FLOAT AS summa,
            (
              SELECT COALESCE(COUNT(d_j.id), 0)
              FROM document_prixod_jur7 AS d_j
              JOIN users AS u ON u.id = d_j.user_id
              JOIN regions AS r ON r.id = u.region_id  
              WHERE r.id = $1 
                AND d_j.doc_date BETWEEN $2 AND $3 
                AND d_j.isdeleted = false
            )::INTEGER AS total_count
          FROM data
        `, [region_id, from, to, offset, limit]
    );

    return {
      data: result.rows[0]?.data || [],
      summa: result.rows[0].summa,
      total: result.rows[0].total_count,
    };

  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
};

const getDocumentJur7ById = async (region_id, id, ignoreDeleted = false) => {
  try {
    let ignore = ``;
    if (!ignoreDeleted) {
      ignore = `AND d_j.isdeleted = false`;
    }
    const result = await pool.query(
      `
          SELECT 
            d_j.id, 
            d_j.doc_num,
            TO_CHAR(d_j.doc_date, 'YYYY-MM-DD') AS doc_date, 
            d_j.opisanie, 
            d_j.summa::FLOAT, 
            d_j.kimdan_name, 
            d_j.kimga_name, 
            d_j.doverennost,
            (
              SELECT ARRAY_AGG(row_to_json(d_j_ch))
              FROM (
                SELECT  
                  d_j_ch.id,
                  d_j_ch.naimenovanie_tovarov_jur7_id,
                  d_j_ch.kol,
                  d_j_ch.sena,
                  d_j_ch.summa,
                  d_j_ch.debet_schet,
                  d_j_ch.debet_sub_schet,
                  d_j_ch.kredit_schet,
                  d_j_ch.kredit_sub_schet,
                  TO_CHAR(d_j_ch.data_pereotsenka, 'YYYY-MM-DD') AS data_pereotsenka
                FROM document_prixod_jur7_child AS d_j_ch
                WHERE d_j_ch.document_prixod_jur7_id = d_j.id
              ) AS d_j_ch
            ) AS childs
          FROM document_prixod_jur7 AS d_j
          JOIN users AS u ON u.id = d_j.user_id
          JOIN regions AS r ON r.id = u.region_id
          WHERE r.id = $1 AND d_j.id = $2 ${ignore}
        `, [region_id, id]
    );
    if (!result.rows[0]) {
      throw new ErrorResponse('Document not found', 404);
    }
    return result.rows[0];

  } catch (error) {
    throw new ErrorResponse(error.message, error.statusCode || 500);
  }
};

const updateDocumentJur7DB = async (data) => {
  const client = await pool.connect()
  try {
    await client.query(`BEGIN`)
    const result = await client.query(`
          UPDATE document_prixod_jur7 SET 
              doc_num = $1, 
              doc_date = $2, 
              j_o_num = $3, 
              opisanie = $4, 
              doverennost = $5, 
              summa = $6, 
              kimdan_id = $7, 
              kimdan_name = $8, 
              kimga_id = $9, 
              kimga_name = $10, 
              id_shartnomalar_organization = $11, 
              updated_at = $12
          WHERE id = $13 RETURNING * 
        `, [
      data.doc_num,
      data.doc_date,
      data.j_o_num,
      data.opisanie,
      data.doverennost,
      data.summa,
      data.kimdan_id,
      data.kimdan_name,
      data.kimga_id,
      data.kimga_name,
      data.id_shartnomalar_organization,
      tashkentTime(),
      data.id,
    ]);
    const document = result.rows[0];
    await client.query(`DELETE FROM document_prixod_jur7_child WHERE document_prixod_jur7_id = $1`, [document.id]);
    const queryArray = [];
    for (let child of data.childs) {
      const query = client.query(
        `
        INSERT INTO document_prixod_jur7_child (
          user_id,
          document_prixod_jur7_id,
          naimenovanie_tovarov_jur7_id,
          kol,
          sena,
          summa,
          debet_schet,
          debet_sub_schet,
          kredit_schet,
          kredit_sub_schet,
          data_pereotsenka,
          created_at,
          updated_at
        ) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
        `,
        [
          document.user_id,
          document.id,
          child.naimenovanie_tovarov_jur7_id,
          child.kol,
          child.sena,
          child.summa,
          child.debet_schet,
          child.debet_sub_schet,
          child.kredit_schet,
          child.kredit_sub_schet,
          child.data_pereotsenka,
          tashkentTime(),
          tashkentTime()
        ]);
      queryArray.push(query);
    }
    const childs = await Promise.all(queryArray);
    const childs_doc = childs.map(item => item.rows[0])
    document.childs = childs_doc
    await client.query(`COMMIT`)
    return result.rows[0];
  } catch (error) {
    await client.query(`ROLLBACK`)
    throw new ErrorResponse(error, error.statusCode);
  } finally {
    client.release()
  }
}

const deleteDocumentJur7DB = async (id) => {
  try {
    await pool.query(`UPDATE document_prixod_jur7_child SET isdeleted = $1 WHERE document_prixod_jur7_id = $2`, [true, id]);
    await pool.query(`UPDATE document_prixod_jur7 SET isdeleted = true WHERE id = $1 AND isdeleted = false`, [id]);
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode);
  }
}

module.exports = {
  createDocumentJur7,
  getAllDocumentJur7,
  getDocumentJur7ById,
  updateDocumentJur7DB,
  deleteDocumentJur7DB,
};
