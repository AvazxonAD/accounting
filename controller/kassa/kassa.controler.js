const asyncHandler = require("../../middleware/asyncHandler");
const {checkValueString, checkValueNumber, checkValueBoolean, checkValueObject } = require("../../utils/check.functions");
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
    checkValueObject(childs);

    const main_schet_id = req.query.main_schet_id
    let main_schet = await pool.query(`SELECT * FROM main_schet WHERE id = $1 AND user_id = $2`, [main_schet_id, req.user.region_id]);
    main_schet = main_schet.rows[0];
    if(!main_schet){
        return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
    }

    let podotchet_litso = await pool.query(`SELECT * FROM spravochnik_podotchet_litso WHERE id = $1 AND user_id = $2`, [id_spravochnik_organization, req.user.region_id]);
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

        const spravochnik_operatsii = await pool.query(`SELECT id, name, schet, sub_schet FROM spravochnik_operatsii WHERE type_schet = $1 AND isdeleted = false AND id = $2`, ['kassa_prixod', child.spravochnik_operatsii_id]);
        if(!spravochnik_operatsii.rows[0]){
            return next(new ErrorResponse('spravochnik_operatsii topilmadi', 404));
        }
    
        const spravochnik_podrazdelenie = await pool.query(`SELECT id, name, rayon FROM spravochnik_podrazdelenie WHERE user_id = $1 AND isdeleted = false AND id = $2`, [req.user.region_id, child.id_spravochnik_podrazdelenie]);
        if(!spravochnik_podrazdelenie.rows[0]){
            return next(new ErrorResponse('spravochnik_podrazdelenie topilmadi', 404));
        }

        const spravochnik_sostav = await pool.query(`SELECT id, name FROM spravochnik_sostav WHERE user_id = $1 AND isdeleted = false AND id = $2`, [req.user.region_id, child.id_spravochnik_sostav]);
        if(!spravochnik_sostav.rows[0]){
            return next(new ErrorResponse('spravochnik_sostav topilmadi', 404));
        }

        const spravochnik_type_operatsii = await pool.query(`SELECT id, name FROM spravochnik_type_operatsii WHERE user_id = $1 AND isdeleted = false AND id = $2`, [req.user.region_id, child.id_spravochnik_type_operatsii]);
        if(!spravochnik_type_operatsii.rows[0]){
            return next(new ErrorResponse('spravochnik_type_operatsii topilmadi', 404));
        }
    }

    const result = await pool.query(`
        INSERT INTO kassa_prixod(
            doc_num, 
            doc_date, 
            opisanie, 
            prixod_summa, 
            rasxod_summma,
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
            INSERT INTO kassa_prixod_child(
                spravochnik_operatsii_id,
                summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                id_spravochnik_podotchet_litso,
                own_schet,
                own_subschet,
                main_schet_id,
                id_kassa_prixod,
                user_id
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`, [
                child.spravochnik_operatsii_id,
                child.summa, 
                child.id_spravochnik_podrazdelenie,
                child.id_spravochnik_sostav,
                child.id_spravochnik_type_operatsii,
                child.id_spravochnik_podotchet_litso,
                main_schet.jur2_schet,
                main_schet.jur2_subschet,
                prixod.rows[0].id,
                main_schet.id,
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

module.exports = {
    kassa_prixod_and_rasxod
}