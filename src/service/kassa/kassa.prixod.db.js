const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const kassaPrixodCreateDB = handleServiceError(async (object) => {
  const result = await pool.query(
    `
            INSERT INTO kassa_prixod(
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

const kassaPrixodChild = handleServiceError(async (object) => {
  await pool.query(
    `
        INSERT INTO kassa_prixod_child (
            spravochnik_operatsii_id,
            summa,
            id_spravochnik_podrazdelenie, 
            id_spravochnik_sostav, 
            id_spravochnik_type_operatsii,
            spravochnik_operatsii_own_id,
            kassa_prixod_id,
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
      object.kassa_prixod_id,
      object.user_id,
      object.main_schet_id,
      new Date(),
      new Date(),
    ],
  );
});

const getAllKassaPrixodChild = handleServiceError(
  async (region_id, main_schet_id, kassa_prixod_id) => {
    const kassa_prixod_child = await pool.query(
      `
              SELECT  
                  kassa_prixod_child.id,
                  kassa_prixod_child.spravochnik_operatsii_id,
                  spravochnik_operatsii.name AS spravochnik_operatsii_name,
                  kassa_prixod_child.summa,
                  kassa_prixod_child.id_spravochnik_podrazdelenie,
                  spravochnik_podrazdelenie.name AS spravochnik_podrazdelenie_name,
                  kassa_prixod_child.id_spravochnik_sostav,
                  spravochnik_sostav.name AS spravochnik_sostav_name,
                  kassa_prixod_child.id_spravochnik_type_operatsii,
                  spravochnik_type_operatsii.name AS spravochnik_type_operatsii_name,
                  kassa_prixod_child.spravochnik_operatsii_own_id
              FROM kassa_prixod_child 
              JOIN users ON users.id = kassa_prixod_child.user_id
              JOIN regions ON regions.id = users.region_id   
              JOIN spravochnik_operatsii ON spravochnik_operatsii.id = kassa_prixod_child.spravochnik_operatsii_id
              JOIN spravochnik_podrazdelenie ON spravochnik_podrazdelenie.id = kassa_prixod_child.id_spravochnik_podrazdelenie
              JOIN spravochnik_sostav ON spravochnik_sostav.id = kassa_prixod_child.id_spravochnik_sostav
              JOIN spravochnik_type_operatsii ON spravochnik_type_operatsii.id = kassa_prixod_child.id_spravochnik_type_operatsii
              WHERE regions.id = $1 
                AND kassa_prixod_child.main_schet_id = $2 
                AND kassa_prixod_child.isdeleted = false 
                AND kassa_prixod_child.kassa_prixod_id = $3
          `,
      [region_id, main_schet_id, kassa_prixod_id],
    );
    return kassa_prixod_child.rows;
  },
);

const getAllKassaPrixodDb = handleServiceError(
  async (region_id, main_schet_id, from, to, offset, limit) => {
    const results = await pool.query(
      `   
            SELECT 
                kassa_prixod.id, 
                kassa_prixod.doc_num,
                TO_CHAR(kassa_prixod.doc_date, 'YYYY-MM-DD') AS doc_date, 
                kassa_prixod.opisaine, 
                kassa_prixod.summa, 
                kassa_prixod.id_podotchet_litso,
                kassa_prixod.spravochnik_operatsii_own_id
            FROM kassa_prixod
            JOIN users ON users.id = kassa_prixod.user_id
            JOIN regions ON regions.id = users.region_id  
            WHERE kassa_prixod.main_schet_id = $1 
                AND regions.id = $2
                AND kassa_prixod.isdeleted = false
                AND kassa_prixod.doc_date BETWEEN $3 AND $4
                OFFSET $5
                LIMIT $6
        `,
      [main_schet_id, region_id, from, to, offset, limit],
    );

    const summa = await pool.query(
      `
        SELECT 
            COALESCE(SUM(kassa_prixod.summa), 0) AS summa
        FROM kassa_prixod
        JOIN users ON users.id = kassa_prixod.user_id
        JOIN regions ON regions.id = users.region_id  
        WHERE kassa_prixod.main_schet_id = $1 
            AND regions.id = $2
            AND kassa_prixod.isdeleted = false
            AND kassa_prixod.doc_date BETWEEN $3 AND $4
    `,
      [main_schet_id, region_id, from, to],
    );

    const total = await pool.query(
      `
        SELECT 
            COALESCE(COUNT(kassa_prixod.id), 0) AS total_count 
        FROM kassa_prixod
        JOIN users ON users.id = kassa_prixod.user_id
        JOIN regions ON regions.id = users.region_id  
        WHERE kassa_prixod.main_schet_id = $1 
            AND regions.id = $2
            AND kassa_prixod.isdeleted = false
            AND kassa_prixod.doc_date BETWEEN $3 AND $4
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
                kassa_prixod.id, 
                kassa_prixod.doc_num,
                TO_CHAR(kassa_prixod.doc_date, 'YYYY-MM-DD') AS doc_date, 
                kassa_prixod.opisaine, 
                kassa_prixod.summa, 
                kassa_prixod.id_podotchet_litso,
                kassa_prixod.spravochnik_operatsii_own_id
            FROM kassa_prixod
            JOIN users ON users.id = kassa_prixod.user_id
            JOIN regions ON regions.id = users.region_id  
            WHERE kassa_prixod.main_schet_id = $1 
                AND regions.id = $2
                AND kassa_prixod.isdeleted = false
                AND kassa_prixod.id = $3
        `,
      [main_schet_id, region_id, id],
    );
    return result.rows[0];
  },
);

const updateKassaPrixodDB = handleServiceError(async (object) => {
  await pool.query(
    `
            UPDATE kassa_prixod SET 
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

const deleteKassaPrixodChild = handleServiceError(async (id) => {
  await pool.query(
    `UPDATE kassa_prixod_child SET isdeleted = $1 WHERE kassa_prixod_id = $2`,
    [true, id],
  );
});

const deleteKassaPrixodDB = handleServiceError(async (id) => {
  await pool.query(
    `UPDATE kassa_prixod
            SET isdeleted = true
            WHERE id = $1 AND isdeleted = false
        `,
    [id],
  );
});

module.exports = {
  kassaPrixodCreateDB,
  kassaPrixodChild,
  getAllKassaPrixodDb,
  getAllKassaPrixodChild,
  getElementById,
  updateKassaPrixodDB,
  deleteKassaPrixodChild,
  deleteKassaPrixodDB,
};
