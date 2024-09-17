const asyncHandler = require("../../middleware/asyncHandler");
const { checkNotNull, checkValueString, checkValueNumber, checkValueBoolean } = require("../../utils/check.functions");
const ErrorResponse = require("../../utils/errorResponse");

exports.bank_prixod = asyncHandler(async (req, res, next) => {
    const {doc_number, doc_date, summa, provodki_boolean, dop_provodki_boolean, opisanie, id_spravochnik_organization } = req.body
    checkNotNull(doc_date, doc_number, summa, provodki_boolean, dop_provodki_boolean, opisanie, id_spravochnik_organization)
    checkValueString(doc_date, doc_number, opisanie)
    checkValueNumber(id_spravochnik_organization)
    checkValueBoolean(provodki_boolean, dop_provodki_boolean)

    const organization = await pool.query(`SELECT * FROM spravochnik_organization WHERE id = $1 AND user_id = $2`, [id_spravochnik_organization, req.user.region_id])
    if(!organization.rows[0]){
        return next(new ErrorResponse('Hamkor korxona topilmadi', 404))
    }
    
    
})