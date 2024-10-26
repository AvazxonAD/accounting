const { Router } = require("express");
const router = Router();

const {
    getByIdAccess,
    updateAccess
} = require("./access.controller");

router.get('/:id', getByIdAccess)
router.put('/:id', updateAccess)

module.exports = router;
