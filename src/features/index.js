const { Controller } = require('./controller');
const { validator } = require('../helper/validator');
const {
    getDocNumSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/doc/num/:page', validator(Controller.getDocNum, getDocNumSchema));

module.exports = router;