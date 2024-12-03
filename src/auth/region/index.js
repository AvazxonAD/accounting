const { RegionService } = require('./service')
const {
    createSchema,
    getByIdSchema,
    updateSchema,
    deleteSchema
} = require('./schema')

const { Router } = require('express')
const router = Router()
const { Controller } = require('../../helper/controller')

router.post('/', Controller(RegionService.createRegion, createSchema))
    .get('/', Controller(RegionService.getRegion))
    .get('/:id', Controller(RegionService.getByIdRegion, getByIdSchema))
    .delete('/:id', Controller(RegionService.deleteRegion, deleteSchema))
    .put('/:id', Controller(RegionService.updateRegion, updateSchema))

module.exports = router;