const { OrganizationService } = require('./service');
const { validator } = require('../../helper/validator');
const {
    createOrganizationSchema,
    getOrganizationSchema,
    updateOrganizationSchema,
    getByIdOrganizationSchema,
    deleteOrganizationSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(OrganizationService.createOrganization, createOrganizationSchema));
router.get('/:id', validator(OrganizationService.getByIdOrganization, getByIdOrganizationSchema));
router.put('/:id', validator(OrganizationService.updateOrganization, updateOrganizationSchema));
router.delete('/:id', validator(OrganizationService.deleteOrganization, deleteOrganizationSchema));
router.get('/', validator(OrganizationService.getOrganization, getOrganizationSchema));


module.exports = router;