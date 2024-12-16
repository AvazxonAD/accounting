const { IznosService } = require('./service');
const { Controller } = require('../../helper/controller');
const {
    getByTovarIdSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/', Controller(IznosService.getByTovarIdIznos, getByTovarIdSchema));

module.exports = router;