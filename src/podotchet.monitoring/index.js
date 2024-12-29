const { Router } = require('express')
const router = Router()

const {
    getByIdPodotchetSchema,
    getPodotchetSchema,
    prixodRasxodSchema,
    getByIdPodotchetToExcelSchema
} = require('./schema');
const { PodotchetMonitoringService } = require('./service');
const { validator } = require('../helper/validator');

router.get('/:id', validator(PodotchetMonitoringService.getByIdPodotchetMonitoring, getByIdPodotchetSchema))
router.get('/', validator(PodotchetMonitoringService.getPodotchetMonitroing, getPodotchetSchema))
router.get('/prixod/rasxod', validator(PodotchetMonitoringService.prixodRasxodPodotchet, prixodRasxodSchema))
router.get('/export/:id', validator(PodotchetMonitoringService.getByIdPodotchetToExcel, getByIdPodotchetToExcelSchema))

module.exports = router