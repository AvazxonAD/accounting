const { Router } = require("express");
const router = Router();

const { validator } = require('@helper/validator');
const { KassaRasxodSchema } = require('./schema')
const { Controller } = require("./controller");


router.get('/', validator(Controller.get, KassaRasxodSchema.get()))
    .get('/daily', validator(Controller.daily, KassaRasxodSchema.daily()))
    .get('/cap', validator(Controller.cap, KassaRasxodSchema.cap()));


module.exports = router;
