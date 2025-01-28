const { Controller } = require('./controller');
const { validator } = require('../../helper/validator');
const { } = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/budjet', validator(Controller.getBudjet));

module.exports = router;