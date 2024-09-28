const pool = require("../../config/db");
const { handleServiceError } = require("../../middleware/service.handle");
const { newDate, returnLocalAllDate } = require('../../utils/date.function')


const kassaPrixoidCreateDB = handleServiceError(async (object) => {
    
    const test = await pool.query(`select * from kassa_prixod WHERE id = 11`)
    console.log(returnLocalAllDate(test.rows[0].created_at))
    await pool.query(
        `
            INSERT INTO kassa_prixod(
                doc_num, 
                doc_date, 
                opisanie, 
                summa, 
                id_podotchet_litso, 
                main_schet_id, 
                user_id,
                updated_at
            ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
            `,
        [
            object.doc_num,
            object.doc_date,
            object.opisanie,
            object.summa,
            object.id_podotchet_litso,
            object.main_schet_id,
            object.user_id,
            new Date(newDate()).toISOString()
        ],
    );

})

module.exports = {
    kassaPrixoidCreateDB
}