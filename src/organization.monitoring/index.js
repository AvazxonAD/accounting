const { OrganizationMonitoringService } = require('./service')
const { validator } = require('../helper/validator')

const { 
    getMonitoringSchema, 
    getByOrganizationIdMonitoringSchema,
    aktSverkaSchema,
    prixodRasxodOrganizationSchema,
    orderOrganizationSchema
 } = require('./schema')


const { Router } = require('express')
const router = Router()

router.get('/', validator(OrganizationMonitoringService.getMonitoring, getMonitoringSchema))
router.get('/id', validator(OrganizationMonitoringService.getByOrganizationIdMonitoring, getByOrganizationIdMonitoringSchema))
router.get('/akt/sverka', validator(OrganizationMonitoringService.aktSverka, aktSverkaSchema))
router.get('/prixod/rasxod', validator(OrganizationMonitoringService.prixodRasxodOrganization, prixodRasxodOrganizationSchema))
router.get('/order', validator(OrganizationMonitoringService.orderorganization, orderOrganizationSchema))

module.exports = router;