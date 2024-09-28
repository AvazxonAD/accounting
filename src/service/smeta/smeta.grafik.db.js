const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");

const getByAllSmetaGarfik = handleServiceError(async (region_id, smeta_id, spravochnik_budjet_name_id, year) => {
    const result = await pool.query(
        `   SELECT smeta_grafik.* 
            FROM smeta_grafik
            JOIN users ON smeta_grafik.user_id = users.id
            JOIN regions ON users.region_id = regions.id
            WHERE smeta_grafik.smeta_id = $1 
                AND smeta_grafik.spravochnik_budjet_name_id = $2 
                AND smeta_grafik.isdeleted = false 
                AND regions.id = $3
                AND smeta_grafik.year = $4
        `,
        [smeta_id, spravochnik_budjet_name_id, region_id, year],
    );
    return result.rows[0]    
})

const createSmetaGrafik = handleServiceError(async (user_id, smeta_id, spravochnik_budjet_name_id, year) => {
    await pool.query(
        `INSERT INTO smeta_grafik(smeta_id, spravochnik_budjet_name_id, user_id, year) VALUES($1, $2, $3, $4)
        `,
        [smeta_id, spravochnik_budjet_name_id, user_id, year],
    );
})

const getAllSmetaGarfik = handleServiceError(async () => {
    const result = await pool.query(
        `SELECT 
                smeta_grafik.id, 
                smeta_grafik.smeta_id, 
                smeta.smeta_name,
                smeta_grafik.spravochnik_budjet_name_id,
                spravochnik_budjet_name.name AS budjet_name,
                smeta_grafik.itogo,
                smeta_grafik.oy_1,
                smeta_grafik.oy_2,
                smeta_grafik.oy_3,
                smeta_grafik.oy_4,
                smeta_grafik.oy_5,
                smeta_grafik.oy_6,
                smeta_grafik.oy_7,
                smeta_grafik.oy_8,
                smeta_grafik.oy_9,
                smeta_grafik.oy_10,
                smeta_grafik.oy_11,
                smeta_grafik.oy_12,
                smeta_grafik.year
            FROM smeta_grafik
            JOIN users ON smeta_grafik.user_id = users.id
            JOIN regions ON regions.id = users.region_id  
            JOIN spravochnik_budjet_name ON spravochnik_budjet_name.id = smeta_grafik.spravochnik_budjet_name_id
            JOIN smeta ON smeta.id = smeta_grafik.smeta_id
            WHERE smeta_grafik.isdeleted = false AND regions.id = $1
            OFFSET $2
            LIMIT $3
        `,
        [req.user.region_id, offset, limit],
    );
})

module.exports = {
    getByAllSmetaGarfik,
    createSmetaGrafik
};
