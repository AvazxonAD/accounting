const { Controller } = require('./controllers')
const { validator } = require('../helper/validator')

const {
    monitoringSchema,
    aktSverkaSchema,
    prixodRasxodSchema,
    orderOrganizationSchema,
    capSchema,
    consolidatedSchema
} = require('./schemas')


const { Router } = require('express')
const router = Router()

router.get('/', validator(Controller.monitoring, monitoringSchema))
    .get('/prixod/rasxod', validator(Controller.prixodRasxod, prixodRasxodSchema))
    .get('/cap', validator(Controller.cap, capSchema))
    .get('/order', validator(Controller.consolidated, consolidatedSchema));
    //.get('/akt/sverka', validator(Controller.aktSverka, aktSverkaSchema))

module.exports = router;