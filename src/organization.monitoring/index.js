const { OrganizationMonitoringService } = require('./service')
const { Controller } = require('../helper/controller')

const { 
    getMonitoringSchema, 
    getByOrganizationIdMonitoringSchema,
    aktSverkaSchema,
    prixodRasxodOrganizationSchema,
    orderOrganizationSchema
 } = require('./schema')


const { Router } = require('express')
const router = Router()

router.get('/', Controller(OrganizationMonitoringService.getMonitoring, getMonitoringSchema))
router.get('/id', Controller(OrganizationMonitoringService.getByOrganizationIdMonitoring, getByOrganizationIdMonitoringSchema))
router.get('/akt/sverka', Controller(OrganizationMonitoringService.aktSverka, aktSverkaSchema))
router.get('/prixod/rasxod', Controller(OrganizationMonitoringService.prixodRasxodOrganization, prixodRasxodOrganizationSchema))
router.get('/order', Controller(OrganizationMonitoringService.orderorganization, orderOrganizationSchema))

module.exports = router;