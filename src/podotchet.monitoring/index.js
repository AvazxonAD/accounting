const { Router } = require('express')
const router = Router()

const {
    getByIdPodotchetSchema,
    getPodotchetSchema,
    prixodRasxodSchema,
    getByIdPodotchetToExcelSchema
} = require('./schema');
const { PodotchetMonitoringService } = require('./service');
const { Controller } = require('../helper/controller');

router.get('/:id', Controller(PodotchetMonitoringService.getByIdPodotchetMonitoring, getByIdPodotchetSchema))
router.get('/', Controller(PodotchetMonitoringService.getPodotchetMonitroing, getPodotchetSchema))
router.get('/prixod/rasxod', Controller(PodotchetMonitoringService.prixodRasxodPodotchet, prixodRasxodSchema))
router.get('/export/:id', Controller(PodotchetMonitoringService.getByIdPodotchetToExcel, getByIdPodotchetToExcelSchema))

module.exports = router