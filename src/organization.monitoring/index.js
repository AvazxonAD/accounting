const { OrganizationMonitoringService } = require('./service')
const { Controller } = require('../helper/controller')

const { 
    getMonitoringSchema, 
    getByOrganizationIdMonitoringSchema,
    aktSverkaSchema
 } = require('./schema')


const { Router } = require('express')
const router = Router()

router.get('/', Controller(OrganizationMonitoringService.getMonitoring, getMonitoringSchema))
router.get('/id', Controller(OrganizationMonitoringService.getByOrganizationIdMonitoring, getByOrganizationIdMonitoringSchema))
router.get('/akt/sverka', Controller(OrganizationMonitoringService.aktSverka, aktSverkaSchema))

module.exports = router;