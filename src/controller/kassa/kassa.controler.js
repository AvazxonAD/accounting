const asyncHandler = require("../../middleware/asyncHandler");
const {checkValueString, checkValueNumber, checkValueBoolean, checkValueArray } = require("../../utils/check.functions");
const ErrorResponse = require("../../utils/errorResponse");
const pool = require('../../config/db')

// kassa prixod and rasxod
const kassa_prixod_and_rasxod = asyncHandler(async (req, res, next) => {
    const {
        doc_num, 
        doc_date, 
        prixod_summa,
        rasxod_summa, 
        opisanie, 
        id_podotchet_litso, 
        childs
    } = req.body;

    checkValueString(doc_date, doc_num, opisanie);
    checkValueNumber(id_podotchet_litso, rasxod_summa, prixod_summa);
    checkValueArray(childs);

    const main_schet_id = req.query.main_schet_id
    let main_schet = await pool.query(`SELECT * FROM main_schet WHERE id = $1 AND user_id = $2 AND isdeleted = false`, [main_schet_id, req.user.region_id]);
    main_schet = main_schet.rows[0];
    if(!main_schet){
        return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
    }

    let podotchet_litso = await pool.query(`SELECT * FROM spravochnik_podotchet_litso WHERE id = $1 AND user_id = $2 AND isdeleted = false`, [id_podotchet_litso, req.user.region_id]);
    podotchet_litso = podotchet_litso.rows[0];
    if(!podotchet_litso){
        return next(new ErrorResponse('podotchet_litso topilmadi', 404));
    }

    for(let child of childs){    
        checkValueNumber(
            child.spravochnik_operatsii_id,
            child.summa, 
            child.id_spravochnik_podrazdelenie,
            child.id_spravochnik_sostav,
            child.id_spravochnik_type_operatsii
        );

        const spravochnik_operatsii = await pool.query(`SELECT * FROM spravochnik_operatsii WHERE type_schet = $1 AND isdeleted = false AND id = $2`, ['kassa_prixod_rasxod', child.spravochnik_operatsii_id]);
        if(!spravochnik_operatsii.rows[0]){
            return next(new ErrorResponse('spravochnik_operatsii topilmadi', 404));
        }
    
        const spravochnik_podrazdelenie = await pool.query(`SELECT * FROM spravochnik_podrazdelenie WHERE user_id = $1 AND isdeleted = false AND id = $2`, [req.user.region_id, child.id_spravochnik_podrazdelenie]);
        if(!spravochnik_podrazdelenie.rows[0]){
            return next(new ErrorResponse('spravochnik_podrazdelenie topilmadi', 404));
        }

        const spravochnik_sostav = await pool.query(`SELECT * FROM spravochnik_sostav WHERE user_id = $1 AND isdeleted = false AND id = $2`, [req.user.region_id, child.id_spravochnik_sostav]);
        if(!spravochnik_sostav.rows[0]){
            return next(new ErrorResponse('spravochnik_sostav topilmadi', 404));
        }

        const spravochnik_type_operatsii = await pool.query(`SELECT * FROM spravochnik_type_operatsii WHERE isdeleted = false AND id = $1 AND user_id = $2`, [child.id_spravochnik_type_operatsii, req.user.region_id]);
        if(!spravochnik_type_operatsii.rows[0]){
            return next(new ErrorResponse('spravochnik_type_operatsii topilmadi', 404));
        }
    }

    const result = await pool.query(`
        INSERT INTO kassa_prixod_rasxod(
            doc_num, 
            doc_date, 
            opisanie, 
            prixod_summa, 
            rasxod_summa,
            id_podotchet_litso, 
            main_schet_id, 
            user_id
        ) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *
        `, [
            doc_num, 
            doc_date, 
            opisanie, 
            prixod_summa,
            rasxod_summa, 
            id_podotchet_litso,
            main_schet_id, 
            req.user.region_id
        ]
    );

    if(!result.rows[0]){
        return next(new ErrorResponse('Server xatolik. Malumot kiritilmadi', 500));
    }

    for(let child of childs){
        const result_child = await pool.query(`
            INSERT INTO kassa_prixod_rasxod_child(
                spravochnik_operatsii_id,
                summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                own_schet,
                own_subschet,
                main_schet_id,
                kassa_prixod_rasxod_id,
                user_id
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, [
                child.spravochnik_operatsii_id,
                child.summa, 
                child.id_spravochnik_podrazdelenie,
                child.id_spravochnik_sostav,
                child.id_spravochnik_type_operatsii,
                main_schet.jur2_schet,
                main_schet.jur2_subschet,
                main_schet.id,
                result.rows[0].id, 
                req.user.region_id
            ]
        );
        if(!result_child.rows[0]){
            return next(new ErrorResponse('Server xatolik. Child yozuv kiritilmadi', 500));
        }
    }

    res.status(201).json({
        success: true,
        data: "Muvaffaqiyatli kiritildi"
    });
});

// get all kassa prixod  rasxod
const getAllKassaPrixodRasxod = asyncHandler(async (req, res, next) => {
    const main_schet_id = req.query.main_schet_id
    let main_schet = await pool.query(`SELECT * FROM main_schet WHERE id = $1 AND user_id = $2 AND isdeleted = false`, [main_schet_id, req.user.region_id]);
    main_schet = main_schet.rows[0];
    if(!main_schet){
        return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
    }
    
    let results = await pool.query(` SELECT id, doc_num, doc_date, opisanie, prixod_summa, rasxod_summa, id_podotchet_litso 
        FROM kassa_prixod_rasxod 
        WHERE main_schet_id = $1 AND user_id = $2 AND isdeleted = false
    `, [main_schet_id, req.user.region_id])
    results = results.rows

    if(results.length === 0){
        return next(new ErrorResponse('Server xatolik. Prixod documentlar topilmadi', [404]))
    }

    const resultArray = []

    for(let result of results){
        const prixod_child = await pool.query(`
            SELECT  
                kassa_prixod_rasxod_child.id,
                kassa_prixod_rasxod_child.spravochnik_operatsii_id,
                spravochnik_operatsii.name AS spravochnik_operatsii_name,
                kassa_prixod_rasxod_child.summa,
                kassa_prixod_rasxod_child.id_spravochnik_podrazdelenie,
                spravochnik_podrazdelenie.name AS spravochnik_podrazdelenie_name,
                kassa_prixod_rasxod_child.id_spravochnik_sostav,
                spravochnik_sostav.name AS spravochnik_sostav_name,
                kassa_prixod_rasxod_child.id_spravochnik_type_operatsii,
                spravochnik_type_operatsii.name AS spravochnik_type_operatsii_name,
                kassa_prixod_rasxod_child.own_schet,
                kassa_prixod_rasxod_child.own_subschet
            FROM kassa_prixod_rasxod_child 
            JOIN spravochnik_operatsii ON spravochnik_operatsii.id = kassa_prixod_rasxod_child.spravochnik_operatsii_id
            JOIN spravochnik_podrazdelenie ON spravochnik_podrazdelenie.id = kassa_prixod_rasxod_child.id_spravochnik_podrazdelenie
            JOIN spravochnik_sostav ON spravochnik_sostav.id = kassa_prixod_rasxod_child.id_spravochnik_sostav
            JOIN spravochnik_type_operatsii ON spravochnik_type_operatsii.id = kassa_prixod_rasxod_child.id_spravochnik_type_operatsii
            WHERE kassa_prixod_rasxod_child.user_id = $1 AND kassa_prixod_rasxod_child.isdeleted = false AND kassa_prixod_rasxod_child.kassa_prixod_rasxod_id = $2
        `, [req.user.region_id, result.id])

        let object = {...result}
        object.childs = prixod_child.rows
        resultArray.push(object)
    }

    return res.status(200).json({
        success: true,
        data: resultArray
    })
})

// kassa prixod rasxod update 
const updateKassaPrixodBank = asyncHandler(async (req, res, next) => {
    const {
        doc_num, 
        doc_date, 
        prixod_summa,
        rasxod_summa, 
        opisanie, 
        id_podotchet_litso, 
        childs
    } = req.body;

    checkValueString(doc_date, doc_num, opisanie);
    checkValueNumber(id_podotchet_litso, rasxod_summa, prixod_summa);
    checkValueArray(childs);

    const main_schet_id = req.query.main_schet_id
    let main_schet = await pool.query(`SELECT * FROM main_schet WHERE id = $1 AND user_id = $2 AND isdeleted = false`, [main_schet_id, req.user.region_id]);
    main_schet = main_schet.rows[0];
    if(!main_schet){
        return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
    }

    let value  = await pool.query(`SELECT * 
        FROM kassa_prixod_rasxod 
        WHERE user_id = $1 AND main_schet_id = $2 AND isdeleted = false AND id = $3
    `, [req.user.region_id, main_schet_id, req.params.id])
    if(!value.rows[0]){
        return next(new ErrorResponse('Server xatolik. Kassa document topilmadi', 404))
    }

    let podotchet_litso = await pool.query(`SELECT * FROM spravochnik_podotchet_litso WHERE id = $1 AND user_id = $2 AND isdeleted = false`, [id_podotchet_litso, req.user.region_id]);
    podotchet_litso = podotchet_litso.rows[0];
    if(!podotchet_litso){
        return next(new ErrorResponse('podotchet_litso topilmadi', 404));
    }

    for(let child of childs){    
        checkValueNumber(
            child.spravochnik_operatsii_id,
            child.summa, 
            child.id_spravochnik_podrazdelenie,
            child.id_spravochnik_sostav,
            child.id_spravochnik_type_operatsii
        );

        const spravochnik_operatsii = await pool.query(`SELECT * FROM spravochnik_operatsii WHERE type_schet = $1 AND isdeleted = false AND id = $2`, ['kassa_prixod_rasxod', child.spravochnik_operatsii_id]);
        if(!spravochnik_operatsii.rows[0]){
            return next(new ErrorResponse('spravochnik_operatsii topilmadi', 404));
        }
    
        const spravochnik_podrazdelenie = await pool.query(`SELECT * FROM spravochnik_podrazdelenie WHERE user_id = $1 AND isdeleted = false AND id = $2`, [req.user.region_id, child.id_spravochnik_podrazdelenie]);
        if(!spravochnik_podrazdelenie.rows[0]){
            return next(new ErrorResponse('spravochnik_podrazdelenie topilmadi', 404));
        }

        const spravochnik_sostav = await pool.query(`SELECT * FROM spravochnik_sostav WHERE user_id = $1 AND isdeleted = false AND id = $2`, [req.user.region_id, child.id_spravochnik_sostav]);
        if(!spravochnik_sostav.rows[0]){
            return next(new ErrorResponse('spravochnik_sostav topilmadi', 404));
        }

        const spravochnik_type_operatsii = await pool.query(`SELECT * FROM spravochnik_type_operatsii WHERE isdeleted = false AND id = $1 AND user_id = $2`, [child.id_spravochnik_type_operatsii, req.user.region_id]);
        if(!spravochnik_type_operatsii.rows[0]){
            return next(new ErrorResponse('spravochnik_type_operatsii topilmadi', 404));
        }
    }

    const updateValue = await pool.query(`UPDATE kassa_prixod_rasxod SET
            doc_num = $1, 
            doc_date = $2, 
            opisanie = $3, 
            prixod_summa = $4, 
            rasxod_summa = $5,
            id_podotchet_litso = $6
        WHERE id = $7
        RETURNING * 
        `, [
            doc_num, 
            doc_date, 
            opisanie, 
            prixod_summa,
            rasxod_summa, 
            id_podotchet_litso,
            req.params.id
        ]
    )

    if(!updateValue.rows[0]){
        return next(new ErrorResponse('Server xatolik. Malumot yangilamadi', 500))
    }

    await pool.query(`DELETE FROM kassa_prixod_rasxod_child WHERE kassa_prixod_rasxod_id = $1`, [req.params.id])

    for(let child of childs){
        const result_child = await pool.query(`
            INSERT INTO kassa_prixod_rasxod_child(
                spravochnik_operatsii_id,
                summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                own_schet,
                own_subschet,
                main_schet_id,
                kassa_prixod_rasxod_id,
                user_id
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, [
                child.spravochnik_operatsii_id,
                child.summa, 
                child.id_spravochnik_podrazdelenie,
                child.id_spravochnik_sostav,
                child.id_spravochnik_type_operatsii,
                main_schet.jur2_schet,
                main_schet.jur2_subschet,
                main_schet.id,
                req.params.id, 
                req.user.region_id
            ]
        );
        if(!result_child.rows[0]){
            return next(new ErrorResponse('Server xatolik. Child yozuv kiritilmadi', 500));
        }
    }

    res.status(201).json({
        success: true,
        data: "Muvaffaqiyatli yangilandi"
    });

})

// delete kassa prixod rasxod 
const deleteKassaPrixodRasxod = asyncHandler(async (req, res, next) => {
    const main_schet_id = req.query.main_schet_id
    let main_schet = await pool.query(`SELECT * FROM main_schet WHERE id = $1 AND user_id = $2 AND isdeleted = false`, [main_schet_id, req.user.region_id]);
    main_schet = main_schet.rows[0];
    if(!main_schet){
        return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
    }

    const childs = await pool.query(`UPDATE kassa_prixod_rasxod_child 
        SET isdeleted = true
        WHERE kassa_prixod_rasxod_id = $1 AND isdeleted = false AND  user_id = $2 AND main_schet_id = $3
        RETURNING * 
    `, [req.params.id, req.user.region_id, main_schet_id])

    if(childs.rows.length === 0 ){
        return next(new ErrorResponse("Server xatolik. Malumot ochirilmadi", 500))
    }

    const result = await pool.query(`UPDATE kassa_prixod_rasxod
        SET isdeleted = true
        WHERE id = $1 AND isdeleted = false AND  user_id = $2 AND main_schet_id = $3
        RETURNING * 
    `, [req.params.id, req.user.region_id, main_schet_id])
    
    if(result.rows.length === 0 ){
        return next(new ErrorResponse("Server xatolik. Malumot ochirilmadi", 500))
    }

    return res.status(200).json({
        success: true, 
        data: "Muvaffaqiyatli ochirildi"
    })
})

// get element by id bank prixod
const getElementByIdKassaPrixodRasxod = asyncHandler(async (req, res, next) => {
    let results = await pool.query(` SELECT id, doc_num, doc_date, opisanie, prixod_summa, rasxod_summa, id_podotchet_litso 
        FROM kassa_prixod_rasxod 
        WHERE main_schet_id = $1 AND user_id = $2 AND isdeleted = false AND id = $3
    `, [req.query.main_schet_id, req.user.region_id, req.params.id])
    results = results.rows

    if(results.length === 0){
        return next(new ErrorResponse('Server xatolik. Prixod document topilmadi', [404]))
    }

    const resultArray = []

    for(let result of results){
        const prixod_child = await pool.query(`
            SELECT  
                kassa_prixod_rasxod_child.id,
                kassa_prixod_rasxod_child.spravochnik_operatsii_id,
                spravochnik_operatsii.name AS spravochnik_operatsii_name,
                kassa_prixod_rasxod_child.summa,
                kassa_prixod_rasxod_child.id_spravochnik_podrazdelenie,
                spravochnik_podrazdelenie.name AS spravochnik_podrazdelenie_name,
                kassa_prixod_rasxod_child.id_spravochnik_sostav,
                spravochnik_sostav.name AS spravochnik_sostav_name,
                kassa_prixod_rasxod_child.id_spravochnik_type_operatsii,
                spravochnik_type_operatsii.name AS spravochnik_type_operatsii_name,
                kassa_prixod_rasxod_child.own_schet,
                kassa_prixod_rasxod_child.own_subschet
            FROM kassa_prixod_rasxod_child 
            JOIN spravochnik_operatsii ON spravochnik_operatsii.id = kassa_prixod_rasxod_child.spravochnik_operatsii_id
            JOIN spravochnik_podrazdelenie ON spravochnik_podrazdelenie.id = kassa_prixod_rasxod_child.id_spravochnik_podrazdelenie
            JOIN spravochnik_sostav ON spravochnik_sostav.id = kassa_prixod_rasxod_child.id_spravochnik_sostav
            JOIN spravochnik_type_operatsii ON spravochnik_type_operatsii.id = kassa_prixod_rasxod_child.id_spravochnik_type_operatsii
            WHERE kassa_prixod_rasxod_child.user_id = $1 AND kassa_prixod_rasxod_child.isdeleted = false AND kassa_prixod_rasxod_child.kassa_prixod_rasxod_id = $2
        `, [req.user.region_id, result.id])

        let object = {...result}
        object.childs = prixod_child.rows
        resultArray.push(object)
    }

    return res.status(200).json({
        success: true,
        data: resultArray
    })
})

module.exports = {
    kassa_prixod_and_rasxod,
    getAllKassaPrixodRasxod,
    updateKassaPrixodBank,
    deleteKassaPrixodRasxod,
    getElementByIdKassaPrixodRasxod
}