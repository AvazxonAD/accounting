const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");

const {
    getByIdAccess,
    updateAccess
} = require("../../controller/auth/access.controller");

router.get('/:id', protect, getByIdAccess)
router.put('/:id', protect, updateAccess)

module.exports = router;
