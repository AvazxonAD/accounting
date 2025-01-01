const { Router } = require('express')
const router = Router()

const {
    getByIdPodotchetSchema,
    getPodotchetSchema,
    prixodRasxodSchema,
    getByIdPodotchetToExcelSchema
} = require('./schemas');
const { Controller } = require('./controllers');
const { validator } = require('../helper/validator');

router.get('/:id', validator(Controller.getByIdPodotchetMonitoring, getByIdPodotchetSchema))
router.get('/', validator(Controller.getPodotchetMonitroing, getPodotchetSchema))
router.get('/prixod/rasxod', validator(Controller.prixodRasxodPodotchet, prixodRasxodSchema))
router.get('/export/:id', validator(Controller.getByIdPodotchetToExcel, getByIdPodotchetToExcelSchema))

module.exports = router