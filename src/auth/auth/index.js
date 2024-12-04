const { Controller } = require('../../helper/controller');
const { AuthService } = require('./service')
const { protect } = require('../../middleware/auth')
const {
    loginSchema,
    updateSchema,
} = require('./schema');


const { Router } = require('express');
const router = Router();

router.post('/', Controller(AuthService.loginAuth, loginSchema))
    .patch('/', protect, Controller(AuthService.updateAuth, updateSchema));

module.exports = router;