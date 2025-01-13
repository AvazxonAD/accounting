const { Controller } = require('./controller');
const { validator } = require('../../helper/validator');
const {
    getObrotkaSchema,
    getMaterialSchema,
    capSchema,
    backCapSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/obrotka/report', validator(Controller.obrotkaReport, getObrotkaSchema))
    .get('/cap/report', validator(Controller.cap, capSchema))
    .get('/cap/back/report', validator(Controller.backCap, backCapSchema))
    .get('/material/report', validator(Controller.materialReport, getMaterialSchema));

module.exports = router;