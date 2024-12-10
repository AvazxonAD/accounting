const { OrganizationService } = require('./service');
const { Controller } = require('../../helper/controller');
const {
    createOrganizationSchema,
    getOrganizationSchema,
    updateOrganizationSchema,
    getByIdOrganizationSchema,
    deleteOrganizationSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', Controller(OrganizationService.createOrganization, createOrganizationSchema));
router.get('/:id', Controller(OrganizationService.getByIdOrganization, getByIdOrganizationSchema));
router.put('/:id', Controller(OrganizationService.updateOrganization, updateOrganizationSchema));
router.delete('/:id', Controller(OrganizationService.deleteOrganization, deleteOrganizationSchema));
router.get('/', Controller(OrganizationService.getOrganization, getOrganizationSchema));


module.exports = router;