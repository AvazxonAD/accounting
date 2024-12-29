const { LogService } = require('./service');
const { validator } = require('../helper/validator');
const {
    getSchema,
    getUserSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/get', validator(LogService.getLogs, getSchema));
router.get('/user/:id', validator(LogService.getUser, getUserSchema));

module.exports = router;