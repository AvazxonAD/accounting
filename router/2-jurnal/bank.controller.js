const asyncHandler = require("../../middleware/asyncHandler");

// bank prixod 
exports.bankPrixod = asyncHandler(async (req, res, next) => {
    const {doc_number, doc_table, summa, provodki} = req.body
})