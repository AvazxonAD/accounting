const asyncHandler = require("../../middleware/asyncHandler");
const { checkNotNull, checkValueString, checkValueNumber, checkValueBoolean } = require("../../utils/check.functions");
const ErrorResponse = require("../../utils/errorResponse");
const pool = require('../../config/db')

exports.bank_prixod = asyncHandler(async (req, res, next) => {
    const {doc_number, doc_date, summa, provodki_boolean, dop_provodki_boolean, opisanie, id_spravochnik_organization, id_shartnomalar_organization, main_schet_id} = req.body
    checkNotNull(doc_date, doc_number, summa, provodki_boolean, dop_provodki_boolean, opisanie, id_spravochnik_organization, id_shartnomalar_organization, main_schet_id)
    checkValueString(doc_date, doc_number, opisanie)
    checkValueNumber(id_spravochnik_organization, id_shartnomalar_organization, main_schet_id)
    checkValueBoolean(provodki_boolean, dop_provodki_boolean)

    let main_schet = await pool.query(`SELECT * FROM main_schet WHERE id = $1 AND user_id = $2`, [main_schet_id, req.user.region_id])
    main_schet = main_schet.rows[0]
    if(!main_schet){
        return next(new ErrorResponse("Server xatoli. Schet topilmadi"))
    }

    let organization = await pool.query(`SELECT * FROM spravochnik_organization WHERE id = $1 AND user_id = $2`, [id_spravochnik_organization, req.user.region_id])
    organization = organization.rows[0]
    if(!organization.rows[0]){
        return next(new ErrorResponse('Hamkor korxona topilmadi', 404))
    }

    let contract = await pool.query(`SELECT * FROM shartnomalar_organization WHERE user_id = $1 AND spravochnik_organization_id = $2 AND id = $3
    `, [req.user.region_id, id_spravochnik_organization, id_shartnomalar_organization])
    contract = contract.rows[0]
    if(!contract.rows[0]){
        return next(new ErrorResponse('Shartnoma topilmadi', 404))
    }

    const prixod = await pool.query(`INSERT INTO 
        bank_prixod(
            doc_number, 
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
        `,[
            doc_number, 
            doc_date, 
            summa, 
            provodki_boolean, 
            dop_provodki_boolean, 
            opisanie, 
            id_spravochnik_organization, 
            id_shartnomalar_organization,
            main_schet_id,
            req.user.region_id
        ]   
    )
    
})

// select shartnoma 
exports.select_shartnoma = asyncHandler(async (req, res, next) => {
    const contracts = await pool.query(`SELECT * FROM shartnomalar_organization WHERE spravochnik_organization_id = $1 AND user_id = $2`, [req.params.id, req.user.region_id])

    return res.status(200).json({
        success: true,
        data: contracts.rows
    })
})