const { RegionService } = require('./service')
const {
    createSchema,
    getByIdSchema,
    updateSchema,
    deleteSchema
} = require('./schema')

const { Router } = require('express')
const router = Router()
const { validator } = require('../../helper/validator')

router.post('/', validator(RegionService.createRegion, createSchema))
    .get('/', validator(RegionService.getRegion))
    .get('/:id', validator(RegionService.getByIdRegion, getByIdSchema))
    .delete('/:id', validator(RegionService.deleteRegion, deleteSchema))
    .put('/:id', validator(RegionService.updateRegion, updateSchema))

module.exports = router;