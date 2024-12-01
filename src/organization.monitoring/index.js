const { OrganizationMonitoringService } = require('./service')
const { Controller } = require('../helper/controller')

const { 
    getMonitoringSchema, 
    getByOrganizationIdMonitoringSchema,
    aktSverkaSchema,
    prixodRasxodOrganizationSchema
 } = require('./schema')


const { Router } = require('express')
const router = Router()

router.get('/', Controller(OrganizationMonitoringService.getMonitoring, getMonitoringSchema))
router.get('/id', Controller(OrganizationMonitoringService.getByOrganizationIdMonitoring, getByOrganizationIdMonitoringSchema))
router.get('/akt/sverka', Controller(OrganizationMonitoringService.aktSverka, aktSverkaSchema))
router.get('/prixod/rasxod', Controller(OrganizationMonitoringService.prixodRasxodOrganization, prixodRasxodOrganizationSchema))

module.exports = router;