const { IznosService } = require('./service');
const { validator } = require('../../helper/validator');
const {
    getByTovarIdSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/', validator(IznosService.getByTovarIdIznos, getByTovarIdSchema));

module.exports = router;