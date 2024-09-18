const asyncHandler = require("../../middleware/asyncHandler");
const { checkNotNull, checkValueString, checkValueNumber, checkValueBoolean, checkValueObject } = require("../../utils/check.functions");
const ErrorResponse = require("../../utils/errorResponse");
const pool = require('../../config/db')

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
        main_schet_id,
        own_schet,
        own_subschet,
        childs
    } = req.body;

    // Parametrlar bo'sh emasligini tekshirish
    checkNotNull(
        doc_num, 
        doc_date, 
        summa, 
        provodki_boolean, 
        dop_provodki_boolean, 
        opisanie, 
        id_spravochnik_organization, 
        id_shartnomalar_organization, 
        main_schet_id,
        own_schet,
        own_subschet,
        childs
    );

    // Parametr turlari to'g'riligini tekshirish
    checkValueString(doc_date, doc_num, opisanie, own_subschet, own_schet);
    checkValueNumber(id_spravochnik_organization, id_shartnomalar_organization, main_schet_id);
    checkValueBoolean(provodki_boolean, dop_provodki_boolean);
    checkValueObject(childs);

    // Asosiy schetni olish
    let main_schet = await pool.query(`SELECT * FROM main_schet WHERE id = $1 AND user_id = $2`, [main_schet_id, req.user.region_id]);
    main_schet = main_schet.rows[0];
    if(!main_schet){
        return next(new ErrorResponse("Server xatoli. Schet topilmadi"));
    }

    // Tashkilotni olish
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

    // Schet va subschetni tekshirish
    let jur2_schet = await pool.query(`SELECT * FROM main_schet WHERE id = $1 AND jur2_schet = $2 AND user_id = $3 AND isdeleted = false`, [main_schet_id, own_schet, req.user.region_id]);
    jur2_schet = jur2_schet.rows[0];
    if(!jur2_schet){
        return next(new ErrorResponse('own_schet noto`g`ri kiritildi', 404));
    }

    let jur2_subschet = await pool.query(`SELECT * FROM main_schet WHERE id = $1 AND jur2_subschet = $2 AND user_id = $3 AND isdeleted = false`, [main_schet_id, own_subschet, req.user.region_id]);
    jur2_subschet = jur2_subschet.rows[0]; 
    if(!jur2_subschet){
        return next(new ErrorResponse('jur2_subschet noto`g`ri kiritildi', 404));
    }

    // Childlarni tekshirish va qayta ishlash
    for(let child of childs){
        checkNotNull(
            child.summa, 
            child.spravochnik_operatsii_id,
            child.id_spravochnik_podrazdelenie,
            child.id_spravochnik_sostav,
            child.id_spravochnik_type_operatsii,
            child.id_spravochnik_podotchet_litso
        );    
        checkValueNumber(
            child.summa, 
            child.spravochnik_operatsii_id,
            child.id_spravochnik_podrazdelenie,
            child.id_spravochnik_sostav,
            child.id_spravochnik_type_operatsii,
            child.id_spravochnik_podotchet_litso
        );

        // Spravochniklar tekshiruvi
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

    // Bank prixod yaratish
    const prixod = await pool.query(`INSERT INTO bank_prixod(doc_num, doc_date, summa, provodki_boolean, dop_provodki_boolean, opisanie, id_spravochnik_organization, id_shartnomalar_organization, main_schet_id, user_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, [doc_num, doc_date, summa, provodki_boolean, dop_provodki_boolean, opisanie, id_spravochnik_organization, id_shartnomalar_organization, main_schet_id, req.user.region_id]);

    if(!prixod.rows[0]){
        return next(new ErrorResponse('Server xatolik. Malumot kiritilmadi', 500));
    }

    // Bank child yozuvlarini yaratish
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
                id_bank_prixod
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, [
                child.spravochnik_operatsii_id,
                child.summa, 
                child.id_spravochnik_podrazdelenie,
                child.id_spravochnik_sostav,
                child.id_spravochnik_type_operatsii,
                child.id_spravochnik_podotchet_litso,
                own_schet,
                own_subschet,
                main_schet.id,
                prixod.rows[0].id
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

// for create and update page 
exports.forCreateAndUpdatePage = asyncHandler(async (req, res, next) => {
    const  spravochnik_organization = await pool.query(`
        SELECT  
            id, name, bank_klient, raschet_schet, raschet_schet_gazna, mfo, inn, okonx
        FROM spravochnik_organization
        WHERE user_id = $1 AND isdeleted = false 
    `, [req.user.region_id])

    const spravochnik_operatsii = await pool.query(`
        SELECT id, name, schet, sub_schet
        FROM spravochnik_operatsii
        WHERE type_schet = $1 AND isdeleted = false
    `, ['bank_prixod'])

    const spravochnik_podrazdelenie = await pool.query(`
        SELECT id, name, rayon 
        FROM spravochnik_podrazdelenie
        WHERE user_id = $1 AND isdeleted = false
    `, [req.user.region_id])

    const spravochnik_sostav = await pool.query(`
        SELECT id, name, rayon 
        FROM spravochnik_sostav
        WHERE user_id = $1 AND isdeleted = false
    `, [req.user.region_id])

    const spravochnik_type_operatsii = await pool.query(`
        SELECT id, name, rayon 
        FROM spravochnik_type_operatsii
        WHERE user_id = $1 AND isdeleted = false
    `, [req.user.region_id])

    const spravochnik_podotchet_litso = await pool.query(`
        SELECT id, name, rayon 
        FROM spravochnik_podotchet_litso
        WHERE user_id = $1 AND isdeleted = false
    `, [req.user.region_id])

    return res.status(200).json({
        success: true,
        data: {
            spravochnik_organization: spravochnik_organization.rows,
            spravochnik_operatsii: spravochnik_operatsii.rows,
            spravochnik_podrazdelenie: spravochnik_podrazdelenie.rows,
            spravochnik_sostav: spravochnik_sostav.rows,
            spravochnik_type_operatsii: spravochnik_type_operatsii.rows,
            spravochnik_podotchet_litso: spravochnik_podotchet_litso.rows
        }
    })
})