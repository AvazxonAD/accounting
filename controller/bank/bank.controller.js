const asyncHandler = require("../../middleware/asyncHandler");
const {checkValueString, checkValueNumber, checkValueBoolean, checkValueObject } = require("../../utils/check.functions");
const ErrorResponse = require("../../utils/errorResponse");
const pool = require('../../config/db')


// bank prixod 
exports.bank_prixod = asyncHandler(async (req, res, next) => {
    const {
        doc_num, 
        doc_date, 
        summa, 
        provodki_boolean, 
        dop_provodki_boolean, 
        opisanie, 
        id_spravochnik_organization, 
        id_shartnomalar_organization, 
        childs
    } = req.body;

    checkValueString(doc_date, doc_num, opisanie);
    checkValueNumber(id_spravochnik_organization, id_shartnomalar_organization);
    checkValueBoolean(provodki_boolean, dop_provodki_boolean);
    checkValueObject(childs);

    const main_schet_id = req.query.main_schet_id
    let main_schet = await pool.query(`SELECT * FROM main_schet WHERE id = $1 AND user_id = $2`, [main_schet_id, req.user.region_id]);
    main_schet = main_schet.rows[0];
    if(!main_schet){
        return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
    }

    let organization = await pool.query(`SELECT * FROM spravochnik_organization WHERE id = $1 AND user_id = $2`, [id_spravochnik_organization, req.user.region_id]);
    organization = organization.rows[0];
    if(!organization){
        return next(new ErrorResponse('Hamkor korxona topilmadi', 404));
    }

    // Shartnomani olish
    let contract = await pool.query(`SELECT * FROM shartnomalar_organization WHERE user_id = $1 AND spravochnik_organization_id = $2 AND id = $3`, [req.user.region_id, id_spravochnik_organization, id_shartnomalar_organization]);
    contract = contract.rows[0];
    if(!contract){
        return next(new ErrorResponse('Shartnoma topilmadi', 404));
    }

    for(let child of childs){    
        checkValueNumber(
            child.summa, 
            child.spravochnik_operatsii_id,
            child.id_spravochnik_podrazdelenie,
            child.id_spravochnik_sostav,
            child.id_spravochnik_type_operatsii,
            child.id_spravochnik_podotchet_litso
        );

        const spravochnik_operatsii = await pool.query(`SELECT id, name, schet, sub_schet FROM spravochnik_operatsii WHERE type_schet = $1 AND isdeleted = false AND id = $2`, ['bank_prixod', child.spravochnik_operatsii_id]);
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

        const spravochnik_podotchet_litso = await pool.query(`SELECT id, name FROM spravochnik_podotchet_litso WHERE user_id = $1 AND isdeleted = false AND id = $2`, [req.user.region_id, child.id_spravochnik_podotchet_litso]);
        if(!spravochnik_podotchet_litso.rows[0]){
            return next(new ErrorResponse('spravochnik_podotchet_litso topilmadi', 404));
        }
    }

    const prixod = await pool.query(`
        INSERT INTO bank_prixod(
            doc_num, 
            doc_date, 
            summa, 
            provodki_boolean, 
            dop_provodki_boolean, 
            opisanie, 
            id_spravochnik_organization, 
            id_shartnomalar_organization, 
            main_schet_id, 
            user_id
        ) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING *
        `, [
            doc_num, 
            doc_date, 
            summa, 
            provodki_boolean, 
            dop_provodki_boolean, 
            opisanie, id_spravochnik_organization, 
            id_shartnomalar_organization, 
            main_schet_id, 
            req.user.region_id
        ]
    );

    if(!prixod.rows[0]){
        return next(new ErrorResponse('Server xatolik. Malumot kiritilmadi', 500));
    }

    for(let child of childs){
        const bank_child = await pool.query(`
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
                main_schet.id,
                prixod.rows[0].id,
                req.user.region_id
            ]
        );
        if(!bank_child.rows[0]){
            return next(new ErrorResponse('Server xatolik. Child yozuv kiritilmadi', 500));
        }
    }

    res.status(201).json({
        success: true,
        data: "Muvaffaqiyatli kiritildi"
    });
});

// select shartnoma 
exports.select_shartnoma = asyncHandler(async (req, res, next) => {
    const contracts = await pool.query(`
        SELECT 
            id, doc_num, doc_date, summa, opisanie, smeta_id, user_id, smeta_2 
        FROM shartnomalar_organization 
        WHERE spravochnik_organization_id = $1 AND user_id = $2
    `, [req.params.id, req.user.region_id])

    return res.status(200).json({
        success: true,
        data: contracts.rows
    })
})

// bank prixod update 
exports.bank_prixod_update = asyncHandler(async (req, res, next) => {
    const main_schet_id = req.query.main_schet_id

    let bank_prixod = await pool.query(`SELECT * FROM bank_prixod WHERE id = $1 AND user_id = $2 AND main_schet_id = $3
    `, [req.params.id, req.user.region_id, main_schet_id])
    bank_prixod = bank_prixod.rows[0]
    if(!bank_prixod){
        return next(new ErrorResponse('Prixod document topilmadi', 404))
    }

    const {
        doc_num, 
        doc_date, 
        summa, 
        provodki_boolean, 
        dop_provodki_boolean, 
        opisanie, 
        id_spravochnik_organization, 
        id_shartnomalar_organization, 
        own_schet,
        own_subschet,
        childs
    } = req.body;

    checkValueString(doc_date, doc_num, opisanie);
    checkValueNumber(id_spravochnik_organization, id_shartnomalar_organization,  own_subschet, own_schet);
    checkValueBoolean(provodki_boolean, dop_provodki_boolean);
    checkValueObject(childs);

    let main_schet = await pool.query(`SELECT * FROM main_schet WHERE id = $1 AND user_id = $2 AND isdeleted = false`, [main_schet_id, req.user.region_id]);
    main_schet = main_schet.rows[0];
    if(!main_schet){
        return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
    }

    let organization = await pool.query(`SELECT * FROM spravochnik_organization WHERE id = $1 AND user_id = $2 AND isdeleted = false`, [id_spravochnik_organization, req.user.region_id]);
    organization = organization.rows[0];
    if(!organization){
        return next(new ErrorResponse('Hamkor korxona topilmadi', 404));
    }

    let contract = await pool.query(`SELECT * FROM shartnomalar_organization WHERE user_id = $1 AND spravochnik_organization_id = $2 AND id = $3  AND isdeleted = false`, [req.user.region_id, id_spravochnik_organization, id_shartnomalar_organization]);
    contract = contract.rows[0];
    if(!contract){
        return next(new ErrorResponse('Shartnoma topilmadi', 404));
    }

    for(let child of childs){    
        checkValueNumber(
            child.summa, 
            child.spravochnik_operatsii_id,
            child.id_spravochnik_podrazdelenie,
            child.id_spravochnik_sostav,
            child.id_spravochnik_type_operatsii,
            child.id_spravochnik_podotchet_litso
        );

        const spravochnik_operatsii = await pool.query(`SELECT id, name, schet, sub_schet FROM spravochnik_operatsii WHERE type_schet = $1 AND isdeleted = false AND id = $2`, ['bank_prixod', child.spravochnik_operatsii_id]);
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

        const spravochnik_podotchet_litso = await pool.query(`SELECT id, name FROM spravochnik_podotchet_litso WHERE user_id = $1 AND isdeleted = false AND id = $2`, [req.user.region_id, child.id_spravochnik_podotchet_litso]);
        if(!spravochnik_podotchet_litso.rows[0]){
            return next(new ErrorResponse('spravochnik_podotchet_litso topilmadi', 404));
        }
    }

    const prixod = await pool.query(`
        UPDATE bank_prixod SET 
            doc_num = $1, 
            doc_date = $2, 
            summa = $3, 
            provodki_boolean = $4, 
            dop_provodki_boolean = $5, 
            opisanie = $6, 
            id_spravochnik_organization = $7, 
            id_shartnomalar_organization = $8
        WHERE id = $9
        RETURNING *
        `, [
            doc_num, 
            doc_date, 
            summa, 
            provodki_boolean, 
            dop_provodki_boolean, 
            opisanie, 
            id_spravochnik_organization, 
            id_shartnomalar_organization, 
            req.params.id
        ]
    );

    if(!prixod.rows[0]){
        return next(new ErrorResponse('Server xatolik. Malumot Yangilanmadi', 500));
    }
    await pool.query(`DELETE FROM bank_prixod_child WHERE id_bank_prixod = $1`, [ bank_prixod.id])

    for(let child of childs){
        const bank_child = await pool.query(`
            INSERT INTO bank_prixod_child(
                spravochnik_operatsii_id,
                summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                id_spravochnik_podotchet_litso,
                main_schet_id,
                id_bank_prixod,
                user_id
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, [
                child.spravochnik_operatsii_id,
                child.summa, 
                child.id_spravochnik_podrazdelenie,
                child.id_spravochnik_sostav,
                child.id_spravochnik_type_operatsii,
                child.id_spravochnik_podotchet_litso,
                main_schet.id,
                bank_prixod.id,
                req.user.region_id
            ]
        );
        if(!bank_child.rows[0]){
            return next(new ErrorResponse('Server xatolik. Child yozuv kiritilmadi', 500));
        }
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli yangilandi"
    })

})

// get all bank prixod 
exports.getAllBankPrixod = asyncHandler(async (req, res, next) => {
    let all_prixod = await pool.query(`
        SELECT 
            id,
            doc_num, 
            doc_date, 
            summa, 
            provodki_boolean, 
            dop_provodki_boolean, 
            opisanie, 
            id_spravochnik_organization, 
            id_shartnomalar_organization
        FROM bank_prixod 
        WHERE main_schet_id = $1 AND user_id = $2 AND isdeleted = false
    `, [req.query.main_schet_id, req.user.region_id])
    all_prixod = all_prixod.rows

    if(all_prixod.length === 0){
        return next(new ErrorResponse('Server xatolik. Prixod documentlar topilmadi', [404]))
    }

    const resultArray = []

    for(let prixod of all_prixod){
        const prixod_child = await pool.query(`
            SELECT  
                bank_prixod_child.id,
                bank_prixod_child.spravochnik_operatsii_id,
                spravochnik_operatsii.name AS spravochnik_operatsii_name,
                bank_prixod_child.summa,
                bank_prixod_child.id_spravochnik_podrazdelenie,
                spravochnik_podrazdelenie.name AS spravochnik_podrazdelenie_name,
                bank_prixod_child.id_spravochnik_sostav,
                spravochnik_sostav.name AS spravochnik_sostav_name,
                bank_prixod_child.id_spravochnik_type_operatsii,
                spravochnik_type_operatsii.name AS spravochnik_type_operatsii_name,
                bank_prixod_child.id_spravochnik_podotchet_litso,
                spravochnik_podotchet_litso.name AS spravochnik_podotchet_litso_name,
                bank_prixod_child.own_schet,
                bank_prixod_child.own_subschet
            FROM bank_prixod_child 
            JOIN spravochnik_operatsii ON spravochnik_operatsii.id = bank_prixod_child.spravochnik_operatsii_id
            JOIN spravochnik_podrazdelenie ON spravochnik_podrazdelenie.id = bank_prixod_child.id_spravochnik_podrazdelenie
            JOIN spravochnik_sostav ON spravochnik_sostav.id = bank_prixod_child.id_spravochnik_sostav
            JOIN spravochnik_type_operatsii ON spravochnik_type_operatsii.id = bank_prixod_child.id_spravochnik_type_operatsii
            JOIN spravochnik_podotchet_litso ON spravochnik_podotchet_litso.id = bank_prixod_child.id_spravochnik_podotchet_litso
            WHERE bank_prixod_child.user_id = $1 AND bank_prixod_child.isdeleted = false AND bank_prixod_child.id_bank_prixod = $2
        `, [req.user.region_id, prixod.id])

        let object = {...prixod}
        object.childs = prixod_child.rows
        resultArray.push(object)
    }

    return res.status(200).json({
        success: true,
        data: resultArray
    })
})

// delete bank_prixod 
exports.delete_bank_prixod = asyncHandler(async (req, res, next) => {
    const main_schet_id = req.query.main_schet_id
    const main_schet = await pool.query(`SELECT * FROM main_schet WHERE id = $1 AND  user_id = $2 AND isdeleted = false
    `, [main_schet_id, req.user.region_id])
    if(!main_schet.rows[0]){
        return next(new ErrorResponse('Server xatolik. Main schet topilmadi', 500))
    }

    const childs = await pool.query(`DELETE FROM bank_prixod_child 
        WHERE user_id = $1 AND id_bank_prixod = $2 AND isdeleted = false AND main_schet_id = $3 
        RETURNING * 
    `, [req.user.region_id, req.params.id, main_schet_id])
    if(childs.rows.length === 0){
        return next(new ErrorResponse('Server xatolik. Bank child ochirilmadi', 500))
    }

    const bank_prixod = await pool.query(`DELETE FROM bank_prixod WHERE user_id = $1 AND id = $2 AND isdeleted = false
    `, [req.user.region_id, req.params.id])
    if(!bank_prixod.rows.length === 0){
        return next(new ErrorResponse('Server xatolik. Bank prixod topilmadi', 500))
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli ochirildi"
    })
})

// get element by id bank prixod 
exports.getElementByIdBankPrixod = asyncHandler(async (req, res, next) => {
    let all_prixod = await pool.query(`
        SELECT 
            id,
            doc_num, 
            doc_date, 
            summa, 
            provodki_boolean, 
            dop_provodki_boolean, 
            opisanie, 
            id_spravochnik_organization, 
            id_shartnomalar_organization
        FROM bank_prixod
        WHERE main_schet_id = $1 AND user_id = $2 AND isdeleted = false AND id = $3
    `, [req.query.main_schet_id, req.user.region_id, req.params.id])
    all_prixod = all_prixod.rows

    if(all_prixod.length === 0){
        return next(new ErrorResponse('Server xatolik. Rasxod documentlar topilmadi', [404]))
    }

    const resultArray = []

    for(let prixod of all_prixod){
        const prixod_child = await pool.query(`
            SELECT  
                bank_prixod_child.id,
                bank_prixod_child.spravochnik_operatsii_id,
                spravochnik_operatsii.name AS spravochnik_operatsii_name,
                bank_prixod_child.summa,
                bank_prixod_child.id_spravochnik_podrazdelenie,
                spravochnik_podrazdelenie.name AS spravochnik_podrazdelenie_name,
                bank_prixod_child.id_spravochnik_sostav,
                spravochnik_sostav.name AS spravochnik_sostav_name,
                bank_prixod_child.id_spravochnik_type_operatsii,
                spravochnik_type_operatsii.name AS spravochnik_type_operatsii_name,
                bank_prixod_child.id_spravochnik_podotchet_litso,
                spravochnik_podotchet_litso.name AS spravochnik_podotchet_litso_name,
                bank_prixod_child.own_schet,
                bank_prixod_child.own_subschet
            FROM bank_prixod_child 
            JOIN spravochnik_operatsii ON spravochnik_operatsii.id = bank_prixod_child.spravochnik_operatsii_id
            JOIN spravochnik_podrazdelenie ON spravochnik_podrazdelenie.id = bank_prixod_child.id_spravochnik_podrazdelenie
            JOIN spravochnik_sostav ON spravochnik_sostav.id = bank_prixod_child.id_spravochnik_sostav
            JOIN spravochnik_type_operatsii ON spravochnik_type_operatsii.id = bank_prixod_child.id_spravochnik_type_operatsii
            JOIN spravochnik_podotchet_litso ON spravochnik_podotchet_litso.id = bank_prixod_child.id_spravochnik_podotchet_litso
            WHERE bank_prixod_child.user_id = $1 AND bank_prixod_child.isdeleted = false AND bank_prixod_child.id_bank_prixod = $2
        `, [req.user.region_id, prixod.id])

        let object = {...prixod}
        object.childs = prixod_child.rows
        resultArray.push(object)
    }

    return res.status(200).json({
        success: true,
        data: resultArray[0]
    })
})

// bank rasxod
exports.bank_rasxod = asyncHandler(async (req, res, next) => {
    const {
        doc_num, 
        doc_date, 
        summa, 
        opisanie, 
        id_spravochnik_organization, 
        id_shartnomalar_organization, 
        childs
    } = req.body;
    const main_schet_id = req.query.main_schet_id

    checkValueString(doc_date, doc_num, opisanie);
    checkValueNumber(id_spravochnik_organization, id_shartnomalar_organization, main_schet_id);
    checkValueObject(childs);

    let main_schet = await pool.query(`SELECT * FROM main_schet WHERE id = $1 AND user_id = $2`, [main_schet_id, req.user.region_id]);
    main_schet = main_schet.rows[0];
    if(!main_schet){
        return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
    }

    let organization = await pool.query(`SELECT * FROM spravochnik_organization WHERE id = $1 AND user_id = $2`, [id_spravochnik_organization, req.user.region_id]);
    organization = organization.rows[0];
    if(!organization){
        return next(new ErrorResponse('Hamkor korxona topilmadi', 404));
    }

    let contract = await pool.query(`SELECT * FROM shartnomalar_organization WHERE user_id = $1 AND spravochnik_organization_id = $2 AND id = $3`, [req.user.region_id, id_spravochnik_organization, id_shartnomalar_organization]);
    contract = contract.rows[0];
    if(!contract){
        return next(new ErrorResponse('Shartnoma topilmadi', 404));
    }

    for(let child of childs){    
        checkValueNumber(
            child.summa, 
            child.spravochnik_operatsii_id,
            child.id_spravochnik_podrazdelenie,
            child.id_spravochnik_sostav,
            child.id_spravochnik_type_operatsii,
        );

        const spravochnik_operatsii = await pool.query(`SELECT id, name, schet, sub_schet FROM spravochnik_operatsii WHERE type_schet = $1 AND isdeleted = false AND id = $2`, ['bank_prixod', child.spravochnik_operatsii_id]);
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

    const rasxod = await pool.query(`
        INSERT INTO bank_rasxod(
            doc_num, 
            doc_date, 
            summa, 
            opisanie, 
            id_spravochnik_organization, 
            id_shartnomalar_organization, 
            main_schet_id, 
            user_id
        ) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *
        `, [
            doc_num, 
            doc_date, 
            summa, 
            opisanie, id_spravochnik_organization, 
            id_shartnomalar_organization, 
            main_schet_id, 
            req.user.region_id
        ]
    );

    if(!rasxod.rows[0]){
        return next(new ErrorResponse('Server xatolik. Malumot kiritilmadi', 500));
    }

    for(let child of childs){
        const bank_child = await pool.query(`
            INSERT INTO bank_rasxod_child(
                spravochnik_operatsii_id,
                summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                own_schet,
                own_subschet,
                main_schet_id,
                id_bank_rasxod,
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
                rasxod.rows[0].id, 
                req.user.region_id
            ]
        );
        if(!bank_child.rows[0]){
            return next(new ErrorResponse('Server xatolik. Child yozuv kiritilmadi', 500));
        }
    }

    res.status(201).json({
        success: true,
        data: "Muvaffaqiyatli kiritildi"
    });
});

// bank rasxod update 
exports.bank_rasxod_update = asyncHandler(async (req, res, next) => {
    const main_schet_id = req.query.main_schet_id

    let bank_rasxod = await pool.query(`SELECT * FROM bank_prixod WHERE id = $1 AND user_id = $2 AND main_schet_id = $3
    `, [req.params.id, req.user.region_id, main_schet_id])
    bank_rasxod = bank_rasxod.rows[0]
    if(!bank_rasxod){
        return next(new ErrorResponse('Prixod document topilmadi', 404))
    }

    const {
        doc_num, 
        doc_date, 
        summa, 
        provodki_boolean, 
        dop_provodki_boolean, 
        opisanie, 
        id_spravochnik_organization, 
        id_shartnomalar_organization, 
        childs
    } = req.body;

    checkValueString(doc_date, doc_num, opisanie);
    checkValueNumber(id_spravochnik_organization, id_shartnomalar_organization);
    checkValueObject(childs);

    let main_schet = await pool.query(`SELECT * FROM main_schet WHERE id = $1 AND user_id = $2 AND isdeleted = false`, [main_schet_id, req.user.region_id]);
    main_schet = main_schet.rows[0];
    if(!main_schet){
        return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
    }

    let organization = await pool.query(`SELECT * FROM spravochnik_organization WHERE id = $1 AND user_id = $2 AND isdeleted = false`, [id_spravochnik_organization, req.user.region_id]);
    organization = organization.rows[0];
    if(!organization){
        return next(new ErrorResponse('Hamkor korxona topilmadi', 404));
    }

    let contract = await pool.query(`SELECT * FROM shartnomalar_organization WHERE user_id = $1 AND spravochnik_organization_id = $2 AND id = $3  AND isdeleted = false`, [req.user.region_id, id_spravochnik_organization, id_shartnomalar_organization]);
    contract = contract.rows[0];
    if(!contract){
        return next(new ErrorResponse('Shartnoma topilmadi', 404));
    }

    for(let child of childs){    
        checkValueNumber(
            child.summa, 
            child.spravochnik_operatsii_id,
            child.id_spravochnik_podrazdelenie,
            child.id_spravochnik_sostav,
            child.id_spravochnik_type_operatsii,
            child.id_spravochnik_podotchet_litso
        );

        const spravochnik_operatsii = await pool.query(`SELECT id, name, schet, sub_schet FROM spravochnik_operatsii WHERE type_schet = $1 AND isdeleted = false AND id = $2`, ['bank_prixod', child.spravochnik_operatsii_id]);
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

    const prixod = await pool.query(`
        UPDATE bank_prixod SET 
            doc_num = $1, 
            doc_date = $2, 
            summa = $3, 
            provodki_boolean = $4, 
            dop_provodki_boolean = $5, 
            opisanie = $6, 
            id_spravochnik_organization = $7, 
            id_shartnomalar_organization = $8
        WHERE id = $9
        RETURNING *
        `, [
            doc_num, 
            doc_date, 
            summa, 
            provodki_boolean, 
            dop_provodki_boolean, 
            opisanie, 
            id_spravochnik_organization, 
            id_shartnomalar_organization, 
            req.params.id
        ]
    );

    if(!prixod.rows[0]){
        return next(new ErrorResponse('Server xatolik. Malumot Yangilanmadi', 500));
    }
    await pool.query(`DELETE FROM bank_rasxod_child WHERE id_bank_rasxod = $1`, [ bank_rasxod.id])

    for(let child of childs){
        const bank_child = await pool.query(`
            INSERT INTO bank_rasxod_child(
                spravochnik_operatsii_id,
                summa,
                id_spravochnik_podrazdelenie,
                id_spravochnik_sostav,
                id_spravochnik_type_operatsii,
                main_schet_id,
                id_bank_rasxod,
                user_id,
                own_schet,
                own_subschet
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, [
                child.spravochnik_operatsii_id,
                child.summa, 
                child.id_spravochnik_podrazdelenie,
                child.id_spravochnik_sostav,
                child.id_spravochnik_type_operatsii,
                main_schet.id,
                bank_rasxod.id,
                req.user.region_id,
                main_schet.jur2_schet,
                main_schet.jur2_subschet
            ]
        );
        if(!bank_child.rows[0]){
            return next(new ErrorResponse('Server xatolik. Child yozuv kiritilmadi', 500));
        }
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli yangilandi"
    })

})

// get all bank rasxod 
exports.getAllBankRasxod = asyncHandler(async (req, res, next) => {
    let all_rasxod = await pool.query(`
        SELECT 
            id,
            doc_num, 
            doc_date, 
            summa, 
            opisanie, 
            id_spravochnik_organization, 
            id_shartnomalar_organization
        FROM bank_rasxod 
        WHERE main_schet_id = $1 AND user_id = $2 AND isdeleted = false
    `, [req.query.main_schet_id, req.user.region_id])
    all_rasxod = all_rasxod.rows

    if(all_rasxod.length === 0){
        return next(new ErrorResponse('Server xatolik. Prixod documentlar topilmadi', [404]))
    }

    const resultArray = []

    for(let rasxod of all_rasxod){
        const rasxod_child = await pool.query(`
            SELECT  
                bank_rasxod_child.id,
                bank_rasxod_child.spravochnik_operatsii_id,
                spravochnik_operatsii.name AS spravochnik_operatsii_name,
                bank_rasxod_child.summa,
                bank_rasxod_child.id_spravochnik_podrazdelenie,
                spravochnik_podrazdelenie.name AS spravochnik_podrazdelenie_name,
                bank_rasxod_child.id_spravochnik_sostav,
                spravochnik_sostav.name AS spravochnik_sostav_name,
                bank_rasxod_child.id_spravochnik_type_operatsii,
                spravochnik_type_operatsii.name AS spravochnik_type_operatsii_name,
                bank_rasxod_child.own_schet,
                bank_rasxod_child.own_subschet
            FROM bank_rasxod_child 
            JOIN spravochnik_operatsii ON spravochnik_operatsii.id = bank_rasxod_child.spravochnik_operatsii_id
            JOIN spravochnik_podrazdelenie ON spravochnik_podrazdelenie.id = bank_rasxod_child.id_spravochnik_podrazdelenie
            JOIN spravochnik_sostav ON spravochnik_sostav.id = bank_rasxod_child.id_spravochnik_sostav
            JOIN spravochnik_type_operatsii ON spravochnik_type_operatsii.id = bank_rasxod_child.id_spravochnik_type_operatsii
            WHERE bank_rasxod_child.user_id = $1 AND bank_rasxod_child.isdeleted = false AND bank_rasxod_child.id_bank_rasxod = $2
        `, [req.user.region_id, rasxod.id])

        let object = {...rasxod}
        object.childs = rasxod_child.rows
        resultArray.push(object)
    }

    return res.status(200).json({
        success: true,
        data: resultArray
    })
})

// get element by id bank rasxod 
exports.getElementByIdBankRasxod = asyncHandler(async (req, res, next) => {
    let all_rasxod = await pool.query(`
        SELECT 
            id,
            doc_num, 
            doc_date, 
            summa, 
            opisanie, 
            id_spravochnik_organization, 
            id_shartnomalar_organization
        FROM bank_rasxod 
        WHERE main_schet_id = $1 AND user_id = $2 AND isdeleted = false AND id = $3
    `, [req.query.main_schet_id, req.user.region_id, req.params.id])
    all_rasxod = all_rasxod.rows

    if(all_rasxod.length === 0){
        return next(new ErrorResponse('Server xatolik. Prixod documentlar topilmadi', [404]))
    }

    const resultArray = []

    for(let rasxod of all_rasxod){
        const rasxod_child = await pool.query(`
            SELECT  
                bank_rasxod_child.id,
                bank_rasxod_child.spravochnik_operatsii_id,
                spravochnik_operatsii.name AS spravochnik_operatsii_name,
                bank_rasxod_child.summa,
                bank_rasxod_child.id_spravochnik_podrazdelenie,
                spravochnik_podrazdelenie.name AS spravochnik_podrazdelenie_name,
                bank_rasxod_child.id_spravochnik_sostav,
                spravochnik_sostav.name AS spravochnik_sostav_name,
                bank_rasxod_child.id_spravochnik_type_operatsii,
                spravochnik_type_operatsii.name AS spravochnik_type_operatsii_name,
                bank_rasxod_child.own_schet,
                bank_rasxod_child.own_subschet
            FROM bank_rasxod_child 
            JOIN spravochnik_operatsii ON spravochnik_operatsii.id = bank_rasxod_child.spravochnik_operatsii_id
            JOIN spravochnik_podrazdelenie ON spravochnik_podrazdelenie.id = bank_rasxod_child.id_spravochnik_podrazdelenie
            JOIN spravochnik_sostav ON spravochnik_sostav.id = bank_rasxod_child.id_spravochnik_sostav
            JOIN spravochnik_type_operatsii ON spravochnik_type_operatsii.id = bank_rasxod_child.id_spravochnik_type_operatsii
            WHERE bank_rasxod_child.user_id = $1 AND bank_rasxod_child.isdeleted = false AND bank_rasxod_child.id_bank_rasxod = $2
        `, [req.user.region_id, rasxod.id])

        let object = {...rasxod}
        object.childs = rasxod_child.rows
        resultArray.push(object)
    }

    return res.status(200).json({
        success: true,
        data: resultArray
    })
})

// delete bank_rasxod
exports.delete_bank_rasxod = asyncHandler(async (req, res, next) => {
    const main_schet_id = req.query.main_schet_id
    const main_schet = await pool.query(`SELECT * FROM main_schet WHERE id = $1 AND  user_id = $2 AND isdeleted = false
    `, [main_schet_id, req.user.region_id])
    if(!main_schet.rows[0]){
        return next(new ErrorResponse('Server xatolik. Main schet topilmadi', 500))
    }

    const childs = await pool.query(`DELETE FROM bank_rasxod_child 
        WHERE user_id = $1 AND id_bank_rasxod = $2 AND isdeleted = false AND main_schet_id = $3 
        RETURNING * 
    `, [req.user.region_id, req.params.id, main_schet_id])
    if(childs.rows.length === 0){
        return next(new ErrorResponse('Server xatolik. Bank child ochirilmadi', 500))
    }

    const bank_rasxod = await pool.query(`DELETE FROM bank_rasxod WHERE user_id = $1 AND id = $2 AND isdeleted = false
    `, [req.user.region_id, req.params.id])
    if(!bank_rasxod.rows.length === 0){
        return next(new ErrorResponse('Server xatolik. Bank prixod topilmadi', 500))
    }

    return res.status(200).json({
        success: true,
        data: "Muvaffaqiyatli ochirildi"
    })
})
