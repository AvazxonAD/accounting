const { MonitoringService } = require('./service');
const { Controller } = require('../../helper/controller');
const {
    getObrotkaSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/obrotka', Controller(MonitoringService.obrotkaReport, getObrotkaSchema));

module.exports = router;