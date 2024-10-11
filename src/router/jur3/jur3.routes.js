const { Router } = require('express');
const router = Router();
const { createJurnal3 } = require('../../controller/jur3/jurnal3.controller');
const { protect } = require('../../middleware/auth');

router.post('/', createJurnal3)

module.exports = router;