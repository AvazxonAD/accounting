const { MonitoringService } = require('./service');
const { validator } = require('../../helper/validator');
const {
    getObrotkaSchema,
    getMaterialSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/obrotka/report', validator(MonitoringService.obrotkaReport, getObrotkaSchema));
router.get('/material/report', validator(MonitoringService.materialReport, getMaterialSchema));

module.exports = router;