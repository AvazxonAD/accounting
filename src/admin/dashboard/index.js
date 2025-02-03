const { Controller } = require('./controller');
const { validator } = require('../../helper/validator');
const { DashboardSchema } = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/budjet', validator(Controller.getBudjet))
    .get('/', validator(Controller.get, DashboardSchema.get()));

module.exports = router;