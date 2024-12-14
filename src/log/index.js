const { LogService } = require('./service');
const { Controller } = require('../helper/controller');
const {
    getSchema,
    getUserSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/get', Controller(LogService.getLogs, getSchema));
router.get('/user/:id', Controller(LogService.getUser, getUserSchema));

module.exports = router;