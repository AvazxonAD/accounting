const { Router } = require("express");
const router = Router();

const { validator } = require('../../helper/validator');
const { KassaRasxodSchema } = require('./schema')
const { Controller } = require("./controller");


router.get('/', validator(Controller.get, KassaRasxodSchema.get()))
    .get('/cap', validator(Controller.c));


module.exports = router;
