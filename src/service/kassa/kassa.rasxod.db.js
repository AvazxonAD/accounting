const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const kassaRasxodCreateDB = handleServiceError(async (object) => {
  const result = await pool.query(
    `
            INSERT INTO kassa_rasxod(
                doc_num, 
                doc_date, 
                opisaine, 
                summa, 
                id_podotchet_litso, 
                main_schet_id, 
                user_id,
                created_at,
                updated_at,
                spravochnik_operatsii_own_id
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING * 
        `,
    [
      object.doc_num,
      object.doc_date,
      object.opisanie,
      object.summa,
      object.id_podotchet_litso,
      object.main_schet_id,
      object.user_id,
      new Date(),
      new Date(),
      object.spravochnik_operatsii_own_id,
    ],
  );
  return result.rows[0];
});

const kassaRasxodChild = handleServiceError(async (object) => {
  await pool.query(
    `
        INSERT INTO kassa_rasxod_child (
            spravochnik_operatsii_id,
            summa,
            id_spravochnik_podrazdelenie, 
            id_spravochnik_sostav, 
            id_spravochnik_type_operatsii,
            spravochnik_operatsii_own_id,
            kassa_rasxod_id,
            user_id, 
            main_schet_id, 
            created_at, 
            updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `,
    [
      object.spravochnik_operatsii_id,
      object.summa,
      object.id_spravochnik_podrazdelenie,
      object.id_spravochnik_sostav,
      object.id_spravochnik_type_operatsii,
      object.spravochnik_operatsii_own_id,
      object.kassa_rasxod_id,
      object.user_id,
      object.main_schet_id,
      new Date(),
      new Date(),
    ],
  );
});

const getAllKassaRasxodChild = handleServiceError(
  async (region_id, main_schet_id, kassa_rasxod_id) => {
    const kassa_rasxod_child = await pool.query(
      `
              SELECT  
                  kassa_rasxod_child.id,
                  kassa_rasxod_child.spravochnik_operatsii_id,
                  spravochnik_operatsii.name AS spravochnik_operatsii_name,
                  kassa_rasxod_child.summa,
                  kassa_rasxod_child.id_spravochnik_podrazdelenie,
                  spravochnik_podrazdelenie.name AS spravochnik_podrazdelenie_name,
                  kassa_rasxod_child.id_spravochnik_sostav,
                  spravochnik_sostav.name AS spravochnik_sostav_name,
                  kassa_rasxod_child.id_spravochnik_type_operatsii,
                  spravochnik_type_operatsii.name AS spravochnik_type_operatsii_name,
                  kassa_rasxod_child.spravochnik_operatsii_own_id
              FROM kassa_rasxod_child 
              JOIN users ON users.id = kassa_rasxod_child.user_id
              JOIN regions ON regions.id = users.region_id   
              JOIN spravochnik_operatsii ON spravochnik_operatsii.id = kassa_rasxod_child.spravochnik_operatsii_id
              JOIN spravochnik_podrazdelenie ON spravochnik_podrazdelenie.id = kassa_rasxod_child.id_spravochnik_podrazdelenie
              JOIN spravochnik_sostav ON spravochnik_sostav.id = kassa_rasxod_child.id_spravochnik_sostav
              JOIN spravochnik_type_operatsii ON spravochnik_type_operatsii.id = kassa_rasxod_child.id_spravochnik_type_operatsii
              WHERE regions.id = $1 
                AND kassa_rasxod_child.main_schet_id = $2 
                AND kassa_rasxod_child.isdeleted = false 
                AND kassa_rasxod_child.kassa_rasxod_id = $3
          `,
      [region_id, main_schet_id, kassa_rasxod_id],
    );
    return kassa_rasxod_child.rows;
  },
);

const getAllKassaRasxodDb = handleServiceError(
  async (region_id, main_schet_id, from, to, offset, limit) => {
    const results = await pool.query(
      `   
            SELECT 
                kassa_rasxod.id, 
                kassa_rasxod.doc_num,
                TO_CHAR(kassa_rasxod.doc_date, 'YYYY-MM-DD') AS doc_date, 
                kassa_rasxod.opisaine, 
                kassa_rasxod.summa, 
                kassa_rasxod.id_podotchet_litso,
                kassa_rasxod.spravochnik_operatsii_own_id
            FROM kassa_rasxod
            JOIN users ON users.id = kassa_rasxod.user_id
            JOIN regions ON regions.id = users.region_id  
            WHERE kassa_rasxod.main_schet_id = $1 
                AND regions.id = $2
                AND kassa_rasxod.isdeleted = false
                AND kassa_rasxod.doc_date BETWEEN $3 AND $4
                OFFSET $5
                LIMIT $6
        `,
      [main_schet_id, region_id, from, to, offset, limit],
    );

    const summa = await pool.query(
      `
        SELECT 
            COALESCE(SUM(kassa_rasxod.summa), 0) AS summa
        FROM kassa_rasxod
        JOIN users ON users.id = kassa_rasxod.user_id
        JOIN regions ON regions.id = users.region_id  
        WHERE kassa_rasxod.main_schet_id = $1 
            AND regions.id = $2
            AND kassa_rasxod.isdeleted = false
            AND kassa_rasxod.doc_date BETWEEN $3 AND $4
    `,
      [main_schet_id, region_id, from, to],
    );

    const total = await pool.query(
      `
        SELECT 
            COALESCE(COUNT(kassa_rasxod.id), 0) AS total_count 
        FROM kassa_rasxod
        JOIN users ON users.id = kassa_rasxod.user_id
        JOIN regions ON regions.id = users.region_id  
        WHERE kassa_rasxod.main_schet_id = $1 
            AND regions.id = $2
            AND kassa_rasxod.isdeleted = false
            AND kassa_rasxod.doc_date BETWEEN $3 AND $4
    `,
      [main_schet_id, region_id, from, to],
    );

    return {
      rows: results.rows,
      summa: summa.rows[0].summa,
      totalQuery: total.rows[0],
    };
  },
);

const getElementById = handleServiceError(
  async (region_id, main_schet_id, id) => {
    const result = await pool.query(
      `   
            SELECT 
                kassa_rasxod.id, 
                kassa_rasxod.doc_num,
                TO_CHAR(kassa_rasxod.doc_date, 'YYYY-MM-DD') AS doc_date, 
                kassa_rasxod.opisaine, 
                kassa_rasxod.summa, 
                kassa_rasxod.id_podotchet_litso,
                kassa_rasxod.spravochnik_operatsii_own_id
            FROM kassa_rasxod
            JOIN users ON users.id = kassa_rasxod.user_id
            JOIN regions ON regions.id = users.region_id  
            WHERE kassa_rasxod.main_schet_id = $1 
                AND regions.id = $2
                AND kassa_rasxod.isdeleted = false
                AND kassa_rasxod.id = $3
        `,
      [main_schet_id, region_id, id],
    );
    return result.rows[0];
  },
);

const updateKassaRasxodDB = handleServiceError(async (object) => {
  await pool.query(
    `
            UPDATE kassa_rasxod SET 
                doc_num = $1, 
                doc_date = $2, 
                opisaine = $3, 
                summa = $4, 
                id_podotchet_litso = $5, 
                updated_at = $6,
                spravochnik_operatsii_own_id = $7
            WHERE id = $8
        `,
    [
      object.doc_num,
      object.doc_date,
      object.opisanie,
      object.summa,
      object.id_podotchet_litso,
      new Date(),
      object.spravochnik_operatsii_own_id,
      object.id,
    ],
  );
});

const deleteKassaRasxodChild = handleServiceError(async (id) => {
  await pool.query(
    `UPDATE kassa_rasxod_child SET isdeleted = $1 WHERE kassa_rasxod_id = $2`,
    [true, id],
  );
});

const deleteKassaRasxodDB = handleServiceError(async (id) => {
  await pool.query(
    `UPDATE kassa_rasxod
            SET isdeleted = true
            WHERE id = $1 AND isdeleted = false
        `,
    [id],
  );
});

module.exports = {
  kassaRasxodCreateDB,
  kassaRasxodChild,
  getAllKassaRasxodDb,
  getAllKassaRasxodChild,
  getElementById,
  updateKassaRasxodDB,
  deleteKassaRasxodChild,
  deleteKassaRasxodDB,
};
