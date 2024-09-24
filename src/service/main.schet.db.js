const pool = require('../config/db')
const asyncFunctionHandler = require('../middleware/asyncFunctionHandler')

const getByIdMainSchet = asyncFunctionHandler(async (user_id, id) => {
    const result = await pool.query(`SELECT 
                main_schet.id, 
                main_schet.account_number, 
                main_schet.spravochnik_budjet_name_id, 
                main_schet.tashkilot_nomi, 
                main_schet.tashkilot_bank, 
                main_schet.tashkilot_mfo, 
                main_schet.tashkilot_inn, 
                main_schet.account_name, 
                main_schet.jur1_schet, 
                main_schet.jur1_subschet,
                main_schet.jur2_schet, 
                main_schet.jur2_subschet,
                main_schet.jur3_schet,
                main_schet.jur3_subschet, 
                main_schet.jur4_schet,
                main_schet.jur4_subschet, 
                spravochnik_budjet_name.name AS budjet_name
            FROM main_schet
            JOIN spravochnik_budjet_name 
                ON spravochnik_budjet_name.id = main_schet.spravochnik_budjet_name_id
            WHERE main_schet.isdeleted = false 
                AND main_schet.user_id = $1 
                AND main_schet.id = $2
    `, [user_id, id])
    return result.rows[0]
});


const createMain_schet = asyncFunctionHandler(async (account_number, spravochnik_budjet_name_id, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, tashkilot_inn, account_name, jur1_schet, jur1_subschet, jur2_schet, jur2_subschet, jur3_schet, jur3_subschet, jur4_subschet, jur4_schet, user_id) => {
    const result = await pool.query(`INSERT INTO main_schet(account_number, spravochnik_budjet_name_id, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, tashkilot_inn, account_name, jur1_schet, jur1_subschet, jur2_schet, jur2_subschet, jur3_schet, jur3_subschet, jur4_subschet, jur4_schet, user_id) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *
    `, [account_number, spravochnik_budjet_name_id, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, tashkilot_inn, account_name, jur1_schet, jur1_subschet, jur2_schet, jur2_subschet, jur3_schet, jur3_subschet, jur4_subschet, jur4_schet, user_id]);
    return result.rows[0]
})

const getAllMain_schet = asyncFunctionHandler(async (user_id) => {
    const result = await pool.query(`
        SELECT 
            main_schet.id, 
            main_schet.account_number, 
            main_schet.spravochnik_budjet_name_id, 
            main_schet.tashkilot_nomi, 
            main_schet.tashkilot_bank, 
            main_schet.tashkilot_mfo, 
            main_schet.tashkilot_inn, 
            main_schet.account_name, 
            main_schet.jur1_schet, 
            main_schet.jur1_subschet,
            main_schet.jur2_schet, 
            main_schet.jur2_subschet,
            main_schet.jur3_schet,
            main_schet.jur3_subschet, 
            main_schet.jur4_schet,
            main_schet.jur4_subschet, 
            spravochnik_budjet_name.name AS budjet_name,
            spravochnik_budjet_name.id AS spravochnik_budjet_name_id 
        FROM main_schet
        JOIN spravochnik_budjet_name 
            ON spravochnik_budjet_name.id = main_schet.spravochnik_budjet_name_id
        WHERE main_schet.isdeleted = false 
            AND main_schet.user_id = $1 
        ORDER BY main_schet.id
    `, [user_id]);
    return result.rows
})

const updateMain_schet = asyncFunctionHandler(async (account_number, spravochnik_budjet_name_id, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, tashkilot_inn, account_name, jur1_schet, jur1_subschet, jur2_schet, jur2_subschet, jur3_schet, jur3_subschet, jur4_subschet, jur4_schet, id) => {
    const result = await pool.query(`UPDATE  main_schet SET 
        account_number = $1, 
        spravochnik_budjet_name_id = $2, 
        tashkilot_nomi = $3, 
        tashkilot_bank = $4, 
        tashkilot_mfo = $5, 
        tashkilot_inn = $6, 
        account_name = $7, 
        jur1_schet = $8, 
        jur1_subschet = $9, 
        jur2_schet = $10, 
        jur2_subschet = $11, 
        jur3_schet = $12, 
        jur3_subschet = $13, 
        jur4_subschet = $14, 
        jur4_schet = $15
        WHERE id = $16
        RETURNING *
    `, [account_number, spravochnik_budjet_name_id, tashkilot_nomi, tashkilot_bank, tashkilot_mfo, tashkilot_inn, account_name, jur1_schet, jur1_subschet, jur2_schet, jur2_subschet, jur3_schet, jur3_subschet, jur4_subschet, jur4_schet, id]);
    return result.rows[0]
})

const deleteMain_schet = asyncFunctionHandler(async (id) => {
    const deleteValue = await pool.query(`UPDATE main_schet SET isdeleted = $1 WHERE id = $2 RETURNING *`, [true, id])
    return deleteValue.rows[0]
})

const getByBudjet_idMain_schet = asyncFunctionHandler(async (id) => {
    const result = await pool.query(`SELECT id AS main_schet_id, account_number FROM main_schet WHERE spravochnik_budjet_name_id = $1`, [id])
    return result.rows
})

module.exports = {
    getByIdMainSchet,
    createMain_schet,
    getAllMain_schet,
    updateMain_schet,
    deleteMain_schet,
    getByBudjet_idMain_schet
}