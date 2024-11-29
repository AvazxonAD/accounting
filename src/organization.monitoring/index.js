const { OrganizationMonitoringService } = require('./service')
const { getMonitoringSchema } = require('./schema')
const { Controller } = require('../helper/controller')


const { Router } = require('express')
const router = Router()

router.get('/', Controller(OrganizationMonitoringService.getMonitoring, getMonitoringSchema))

module.exports = router;