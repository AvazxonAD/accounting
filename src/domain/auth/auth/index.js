const { validator } = require('@helper/validator');
const { AuthService } = require('./service')
const { protect } = require('@middleware/auth')
const {
    loginSchema,
    updateSchema,
} = require('./schema');


const { Router } = require('express');
const router = Router();

router.post('/', validator(AuthService.loginAuth, loginSchema))
    .patch('/', protect, validator(AuthService.updateAuth, updateSchema));

module.exports = router;