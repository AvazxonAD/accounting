const { ControlService } = require('./service')
const {
    controlSchema
} = require('./schema')

const { Router } = require('express')
const router = Router()
const { Controller } = require('../../helper/controller')

router.get('/tables/count', Controller(ControlService.getControl))

module.exports = router;