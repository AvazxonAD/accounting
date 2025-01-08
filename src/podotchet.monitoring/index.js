const { Router } = require('express')
const router = Router()

const {
    monitoringSchema,
    prixodRasxodSchema,
    getByIdPodotchetToExcelSchema
} = require('./schemas');
const { Controller } = require('./controllers');
const { validator } = require('../helper/validator');

router.get('/', validator(Controller.getMonitoring, monitoringSchema))
router.get('/prixod/rasxod', validator(Controller.prixodRasxodPodotchet, prixodRasxodSchema))
router.get('/export/:id', validator(Controller.getByIdPodotchetToExcel, getByIdPodotchetToExcelSchema))

module.exports = router