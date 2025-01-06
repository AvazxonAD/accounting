const { Controller } = require('./controller');
const { validator } = require('../../helper/validator');
const {
    getReportSchema,
    updateReportSchema,
    getByIdSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/id', validator(Controller.getByIdReport, getByIdSchema))
    .get('/', validator(Controller.getReport, getReportSchema))
    .put('/', validator(Controller.updateReport, updateReportSchema));


module.exports = router;