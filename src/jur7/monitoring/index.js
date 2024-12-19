const { MonitoringService } = require('./service');
const { Controller } = require('../../helper/controller');
const {
    getObrotkaSchema,
    getMaterialSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/obrotka/report', Controller(MonitoringService.obrotkaReport, getObrotkaSchema));
router.get('/material/report', Controller(MonitoringService.materialReport, getMaterialSchema));

module.exports = router;