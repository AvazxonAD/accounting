const { ControlService } = require('./service')
const {
    controlSchema
} = require('./schema')

const { Router } = require('express')
const router = Router()
const { validator } = require('@helper/validator')

router.get('/tables/count', validator(ControlService.getControl))

module.exports = router;