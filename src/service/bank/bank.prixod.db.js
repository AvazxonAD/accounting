const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const createBankPrixod = handleServiceError(async (object) => {
  const result = await pool.query(
    `
            INSERT INTO bank_prixod(
                doc_num, 
                doc_date, 
                summa, 
                provodki_boolean, 
                opisanie, 
                id_spravochnik_organization, 
                id_shartnomalar_organization, 
                main_schet_id, 
                user_id,
                spravochnik_operatsii_own_id
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING * 
            `,
    [
      object.doc_num,
      object.doc_date,
      object.summa,
      object.provodki_boolean,
      object.opisanie,
      object.id_spravochnik_organization,
      object.id_shartnomalar_organization,
      object.main_schet_id,
      object.user_id,
      object.spravochnik_operatsii_own_id,
    ],
  );
  return result.rows[0];
});

const createBankPrixodChild = handleServiceError(async (object) => {
  const result = await pool.query(
    `
            INSERT INTO bank_prixod_child(
                spravochnik_operatsii_id,
                summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                id_spravochnik_podotchet_litso,
                own_schet,
                own_subschet,
                main_schet_id,
                id_bank_prixod,
                user_id,
                spravochnik_operatsii_own_id
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
    [
      object.spravochnik_operatsii_id,
      object.summa,
      object.id_spravochnik_podrazdelenie,
      object.id_spravochnik_sostav,
      object.id_spravochnik_type_operatsii,
      object.id_spravochnik_podotchet_litso,
      object.jur2_schet,
      object.jur2_subschet,
      object.main_schet_id,
      object.bank_prixod_id,
      object.user_id,
      object.spravochnik_operatsii_own_id,
    ],
  );
  return result.rows[0];
});

const getByIdBankPrixod = handleServiceError(
  async (region_id, main_schet_id, id) => {
    const result = await pool.query(
      ` SELECT bank_prixod.* 
        FROM bank_prixod 
        JOIN users ON bank_prixod.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        WHERE bank_prixod.id = $1 AND regions.id = $2 
          AND bank_prixod.main_schet_id = $3 
          AND bank_prixod.isdeleted = false
      `,
      [id, region_id, main_schet_id],
    );
    return result.rows[0];
  },
);

const bankPrixodUpdate = handleServiceError(async (object) => {
  await pool.query(
    `
            UPDATE bank_prixod SET 
                doc_num = $1, 
                doc_date = $2, 
                summa = $3, 
                provodki_boolean = $4, 
                opisanie = $5, 
                id_spravochnik_organization = $6, 
                id_shartnomalar_organization = $7,
                spravochnik_operatsii_own_id = $8
            WHERE id = $9
            `,
    [
      object.doc_num,
      object.doc_date,
      object.summa,
      object.provodki_boolean,
      object.opisanie,
      object.id_spravochnik_organization,
      object.id_shartnomalar_organization,
      object.spravochnik_operatsii_own_id,
      object.id,
    ],
  );
});

const deleteBankPrixodChild = handleServiceError(async (bank_prixod_id) => {
  await pool.query(`
      UPDATE bank_prixod_child SET isdeleted = $1 
      WHERE id_bank_prixod = $2 AND isdeleted = false
    `, [ true, bank_prixod_id ]);
});

const getAllPrixod = handleServiceError(
  async (region_id, main_schet_id, offset, limit) => {
    const result = await pool.query(
      `
            SELECT 
                bank_prixod.id,
                bank_prixod.doc_num, 
                bank_prixod.doc_date, 
                bank_prixod.summa, 
                bank_prixod.provodki_boolean, 
                bank_prixod.dop_provodki_boolean, 
                bank_prixod.opisanie, 
                bank_prixod.id_spravochnik_organization, 
                spravochnik_organization.name AS spravochnik_organization_name,
                spravochnik_organization.okonx AS spravochnik_organization_okonx,
                spravochnik_organization.bank_klient AS spravochnik_organization_bank_klient,
                spravochnik_organization.raschet_schet AS spravochnik_organization_raschet_schet,
                spravochnik_organization.raschet_schet_gazna AS spravochnik_organization_raschet_schet_gazna,
                spravochnik_organization.mfo AS spravochnik_organization_mfo,
                spravochnik_organization.inn AS spravochnik_organization_inn,
                bank_prixod.id_shartnomalar_organization,  -- Vergul qo'shildi
                bank_prixod.spravochnik_operatsii_own_id
            FROM bank_prixod
            JOIN users ON bank_prixod.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            JOIN spravochnik_organization ON spravochnik_organization.id = bank_prixod.id_spravochnik_organization 
            WHERE bank_prixod.main_schet_id = $1 
              AND regions.id = $2 
              AND bank_prixod.isdeleted = false
            OFFSET $3
            LIMIT $4;
          `,
      [main_schet_id, region_id, offset, limit],
    );
    const summa = await pool.query(
      `
            SELECT SUM(bank_prixod.summa)
            FROM bank_prixod 
            JOIN users ON bank_prixod.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE bank_prixod.main_schet_id = $1 AND regions.id = $2 AND bank_prixod.isdeleted = false
          `,
      [main_schet_id, region_id],
    );
    const totalQuery = await pool.query(
      ` SELECT COUNT(bank_prixod.id) AS total 
        FROM bank_prixod 
        JOIN users ON bank_prixod.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        WHERE bank_prixod.main_schet_id = $1 
          AND regions.id = $2 
          AND bank_prixod.isdeleted = false
      `,
      [main_schet_id, region_id],
    );
    return {
      prixod_rows: result.rows,
      summa: summa.rows[0].sum,
      totalQuery: totalQuery.rows[0],
    };
  },
);

const getAllPrixodByFrom = handleServiceError(
  async (region_id, main_schet_id, offset, limit, from) => {
    const result = await pool.query(
      `
            SELECT       
                bank_prixod.id,
                bank_prixod.doc_num, 
                bank_prixod.doc_date, 
                bank_prixod.summa, 
                bank_prixod.provodki_boolean, 
                bank_prixod.dop_provodki_boolean, 
                bank_prixod.opisanie, 
                bank_prixod.id_spravochnik_organization, 
                spravochnik_organization.name AS spravochnik_organization_name,
                spravochnik_organization.okonx AS spravochnik_organization_okonx,
                spravochnik_organization.bank_klient AS spravochnik_organization_bank_klient,
                spravochnik_organization.raschet_schet AS spravochnik_organization_raschet_schet,
                spravochnik_organization.raschet_schet_gazna AS spravochnik_organization_raschet_schet_gazna,
                spravochnik_organization.mfo AS spravochnik_organization_mfo,
                spravochnik_organization.inn AS spravochnik_organization_inn,
                bank_prixod.id_shartnomalar_organization,  -- Vergul qo'shildi
                bank_prixod.spravochnik_operatsii_own_id
            FROM bank_prixod
            JOIN users ON bank_prixod.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            JOIN spravochnik_organization ON spravochnik_organization.id = bank_prixod.id_spravochnik_organization
            WHERE bank_prixod.main_schet_id = $1 AND regions.id = $2 AND bank_prixod.isdeleted = false AND bank_prixod.doc_date > $3
            OFFSET $4
            LIMIT $5
          `,
      [main_schet_id, region_id, from, offset, limit],
    );
    const summa = await pool.query(
      `
            SELECT SUM(bank_prixod.summa)
            JOIN users ON bank_prixod.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            FROM bank_prixod 
            WHERE bank_prixod.main_schet_id = $1 
              AND regions.id = $2 
              AND bank_prixod.isdeleted = false 
              AND bank_prixod.doc_date > $3
          `,
      [main_schet_id, region_id, from],
    );
    const totalQuery = await pool.query(
      ` SELECT COUNT(bank_prixod.id) AS total 
        FROM bank_prixod 
        JOIN users ON bank_prixod.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        WHERE bank_prixod.main_schet_id = $1 
        AND regions.id = $2 
        AND bank_prixod.isdeleted = false 
        AND bank_prixod.doc_date > $3
        `,
      [main_schet_id, region_id, from],
    );
    return {
      prixod_rows: result.rows,
      summa: summa.rows[0].sum,
      totalQuery: totalQuery.rows[0],
    };
  },
);

const getAllPrixodByTo = handleServiceError(
  async (region_id, main_schet_id, offset, limit, to) => {
    console.log(to);

    const result = await pool.query(
      `
            SELECT       
                bank_prixod.id,
                bank_prixod.doc_num, 
                bank_prixod.doc_date, 
                bank_prixod.summa, 
                bank_prixod.provodki_boolean, 
                bank_prixod.dop_provodki_boolean, 
                bank_prixod.opisanie, 
                bank_prixod.id_spravochnik_organization, 
                spravochnik_organization.name AS spravochnik_organization_name,
                spravochnik_organization.okonx AS spravochnik_organization_okonx,
                spravochnik_organization.bank_klient AS spravochnik_organization_bank_klient,
                spravochnik_organization.raschet_schet AS spravochnik_organization_raschet_schet,
                spravochnik_organization.raschet_schet_gazna AS spravochnik_organization_raschet_schet_gazna,
                spravochnik_organization.mfo AS spravochnik_organization_mfo,
                spravochnik_organization.inn AS spravochnik_organization_inn,
                bank_prixod.id_shartnomalar_organization,  -- Vergul qo'shildi
                bank_prixod.spravochnik_operatsii_own_id
            FROM bank_prixod
            JOIN users ON bank_prixod.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            JOIN spravochnik_organization ON spravochnik_organization.id = bank_prixod.id_spravochnik_organization
            WHERE bank_prixod.main_schet_id = $1 AND regions.id = $2 AND bank_prixod.isdeleted = false AND bank_prixod.doc_date < $3
            OFFSET $4
            LIMIT $5
          `,
      [main_schet_id, region_id, to, offset, limit],
    );
    const summa = await pool.query(
      `
            SELECT SUM(bank_prixod.summa)
            FROM bank_prixod 
            JOIN users ON bank_prixod.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE bank_prixod.main_schet_id = $1 
              AND regions.id = $2 
              AND bank_prixod.isdeleted = false 
              AND bank_prixod.doc_date < $3
          `,
      [main_schet_id, region_id, to],
    );
    const totalQuery = await pool.query(
      ` SELECT COUNT(bank_prixod.id) AS total 
        FROM bank_prixod 
        JOIN users ON bank_prixod.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        WHERE bank_prixod.main_schet_id = $1 
          AND regions.id = $2 
          AND bank_prixod.isdeleted = false 
          AND bank_prixod.doc_date < $3
      `,
      [main_schet_id, region_id, to],
    );
    return {
      prixod_rows: result.rows,
      summa: summa.rows[0].sum,
      totalQuery: totalQuery.rows[0],
    };
  },
);

const getAllPrixodByFromAndTo = handleServiceError(
  async (region_id, main_schet_id, offset, limit, from, to) => {
    const result = await pool.query(
      `
            SELECT       
                bank_prixod.id,
                bank_prixod.doc_num, 
                bank_prixod.doc_date, 
                bank_prixod.summa, 
                bank_prixod.provodki_boolean, 
                bank_prixod.dop_provodki_boolean, 
                bank_prixod.opisanie, 
                bank_prixod.id_spravochnik_organization, 
                spravochnik_organization.name AS spravochnik_organization_name,
                spravochnik_organization.okonx AS spravochnik_organization_okonx,
                spravochnik_organization.bank_klient AS spravochnik_organization_bank_klient,
                spravochnik_organization.raschet_schet AS spravochnik_organization_raschet_schet,
                spravochnik_organization.raschet_schet_gazna AS spravochnik_organization_raschet_schet_gazna,
                spravochnik_organization.mfo AS spravochnik_organization_mfo,
                spravochnik_organization.inn AS spravochnik_organization_inn,
                bank_prixod.id_shartnomalar_organization,  -- Vergul qo'shildi
                bank_prixod.spravochnik_operatsii_own_id
            FROM bank_prixod
            JOIN users ON bank_prixod.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            JOIN spravochnik_organization ON spravochnik_organization.id = bank_prixod.id_spravochnik_organization 
            WHERE bank_prixod.main_schet_id = $1 
                AND regions.id = $2 
                AND bank_prixod.isdeleted = false 
                AND bank_prixod.doc_date BETWEEN $3 AND $4
            OFFSET $5
            LIMIT $6
        `,
      [main_schet_id, region_id, from, to, offset, limit],
    );
    const summa = await pool.query(
      `
            SELECT SUM(bank_prixod.summa)
            FROM bank_prixod 
            JOIN users ON bank_prixod.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE bank_prixod.main_schet_id = $1 
              AND regions.id = $2 
              AND bank_prixod.isdeleted = false
              AND bank_prixod.doc_date BETWEEN $3 And $4
          `,
      [main_schet_id, region_id, from, to],
    );
    const totalQuery = await pool.query(
      ` SELECT COUNT(bank_prixod.id) AS total 
        FROM bank_prixod 
        JOIN users ON bank_prixod.user_id = users.id
        JOIN regions ON users.region_id = regions.id
        WHERE bank_prixod.main_schet_id = $1 
          AND regions.id = $2 
          AND bank_prixod.isdeleted = false 
          AND bank_prixod.doc_date BETWEEN $3 And $4
        `,
      [main_schet_id, region_id, from, to],
    );
    return {
      prixod_rows: result.rows,
      summa: summa.rows[0].sum,
      totalQuery: totalQuery.rows[0],
    };
  },
);

const getAllPrixodChild = handleServiceError(async (region_id, prixod_id) => {
  const result = await pool.query(
    `
              SELECT  
                  bank_prixod_child.id,
                  bank_prixod_child.spravochnik_operatsii_id,
                  spravochnik_operatsii.name AS spravochnik_operatsii_name,
                  bank_prixod_child.summa,
                  bank_prixod_child.spravochnik_operatsii_own_id,
                  bank_prixod_child.id_spravochnik_podrazdelenie,
                  spravochnik_podrazdelenie.name AS spravochnik_podrazdelenie_name,
                  bank_prixod_child.id_spravochnik_sostav,
                  spravochnik_sostav.name AS spravochnik_sostav_name,
                  bank_prixod_child.id_spravochnik_type_operatsii,
                  spravochnik_type_operatsii.name AS spravochnik_type_operatsii_name,
                  bank_prixod_child.id_spravochnik_podotchet_litso,
                  spravochnik_podotchet_litso.name AS spravochnik_podotchet_litso_name
              FROM bank_prixod_child 
              JOIN users ON bank_prixod_child.user_id = users.id
              JOIN regions ON users.region_id = regions.id
              JOIN spravochnik_operatsii ON spravochnik_operatsii.id = bank_prixod_child.spravochnik_operatsii_id
              JOIN spravochnik_podrazdelenie ON spravochnik_podrazdelenie.id = bank_prixod_child.id_spravochnik_podrazdelenie
              JOIN spravochnik_sostav ON spravochnik_sostav.id = bank_prixod_child.id_spravochnik_sostav
              JOIN spravochnik_type_operatsii ON spravochnik_type_operatsii.id = bank_prixod_child.id_spravochnik_type_operatsii
              JOIN spravochnik_podotchet_litso ON spravochnik_podotchet_litso.id = bank_prixod_child.id_spravochnik_podotchet_litso
              WHERE regions.id = $1 AND bank_prixod_child.isdeleted = false AND bank_prixod_child.id_bank_prixod = $2
          `,
    [region_id, prixod_id],
  );
  return result.rows;
});

const getElementByIdPrixod = handleServiceError(
  async (region_id, main_schet_id, id) => {
    let result = await pool.query(
      `
            SELECT 
                bank_prixod.id,
                bank_prixod.doc_num, 
                bank_prixod.doc_date, 
                bank_prixod.summa, 
                bank_prixod.provodki_boolean, 
                bank_prixod.dop_provodki_boolean, 
                bank_prixod.opisanie, 
                bank_prixod.id_spravochnik_organization, 
                bank_prixod.id_shartnomalar_organization,
                bank_prixod.spravochnik_operatsii_own_id
            FROM bank_prixod
            JOIN users ON bank_prixod.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE bank_prixod.main_schet_id = $1 
              AND regions.id = $2 
              AND bank_prixod.isdeleted = false 
              AND bank_prixod.id = $3
        `,
      [main_schet_id, region_id, id],
    );
    return result.rows[0];
  },
);

const getElementByIdBankPrixodChild = handleServiceError(
  async (region_id, prixod_id) => {
    const result = await pool.query(
      `
              SELECT  
                  bank_prixod_child.spravochnik_operatsii_id,
                  bank_prixod_child.summa,
                  bank_prixod_child.id_spravochnik_podrazdelenie,
                  bank_prixod_child.id_spravochnik_sostav,
                  bank_prixod_child.id_spravochnik_type_operatsii,
                  bank_prixod_child.id_spravochnik_podotchet_litso
              FROM bank_prixod_child 
              JOIN users ON bank_prixod_child.user_id = users.id
              JOIN regions ON users.region_id = regions.id
              WHERE regions.id = $1 
                AND bank_prixod_child.isdeleted = false 
                AND bank_prixod_child.id_bank_prixod = $2
          `,
      [region_id, prixod_id],
    );
    return result.rows;
  },
);

const deleteBankPrixod = handleServiceError(async (id) => {
  await pool.query(
    `UPDATE bank_prixod SET isdeleted = $1
        WHERE id = $2 AND isdeleted = false
    `,
    [true, id],
  );
})

module.exports = {
  createBankPrixod,
  createBankPrixodChild,
  getByIdBankPrixod,
  bankPrixodUpdate,
  deleteBankPrixodChild,
  getAllPrixod,
  getAllPrixodChild,
  getAllPrixodByFrom,
  getAllPrixodByTo,
  getAllPrixodByFromAndTo,
  getElementByIdPrixod,
  getElementByIdBankPrixodChild,
  deleteBankPrixod
};
