const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");

const {
    getByIdAccess,
    updateAccess
} = require("../../controller/auth/access.controller");

router.get('/:id', getByIdAccess)
router.put('/:id', updateAccess)

module.exports = router;
