const { Router } = require('express')
const router = Router()

const { getByIdPodotchetSchema } = require('./schema');
const { PodotchetMonitoringService } = require('./service');
const { Controller } = require('../helper/controller');

router.get('/:id', Controller(PodotchetMonitoringService.getByIdPodotchetMonitoring, getByIdPodotchetSchema))

module.exports = router