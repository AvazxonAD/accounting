const { Controller } = require('./controller');
const { validator } = require('../../helper/validator');
const {
    getByTovarIdSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/', validator(Controller.getByTovarIdIznos, getByTovarIdSchema));

module.exports = router;