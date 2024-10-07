const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");
const {
    createController,
    getShowService,
    getByIdShowService,
    updateShowService,
    deleteShowService
} = require("../../controller/show.services/show.services.controller");

router.post("/", protect, createController)
    .get('/', protect, getShowService)
    .get('/:id', protect, getByIdShowService)
    .put('/:id', protect, updateShowService)
    .delete('/:id', protect, deleteShowService)


module.exports = router;
