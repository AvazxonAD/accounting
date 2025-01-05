const { Controller } = require('./controller');
const { validator } = require('../../helper/validator');
const {
    createReportSchema,
    getReportSchema,
    updateReportSchema,
    getInfoReportSchema,
    deleteReportSchema,
    getByIdSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(Controller.createReport, createReportSchema))
    .get('/info', validator(Controller.getInfo, getInfoReportSchema))
    .get('/id', validator(Controller.getByIdReport, getByIdSchema))
    .get('/', validator(Controller.getReport, getReportSchema))
    .put('/', validator(Controller.updateReport, updateReportSchema))
    .delete('/', validator(Controller.deleteReport, deleteReportSchema));


module.exports = router;