const { Router } = require('express')
const router = Router()
const { Controller } = require('../../helper/controller')
const { AccessService } = require('./service')
const {
    updateAccessSchema,
    getByRoleIdAccessSchema
} = require('./schema');

router.get('/', Controller(AccessService.getByRoleIdAccess, getByRoleIdAccessSchema))
router.put('/:id', Controller(AccessService.updateAccess, updateAccessSchema))

module.exports = router;