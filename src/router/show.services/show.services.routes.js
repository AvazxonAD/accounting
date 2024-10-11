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

router.post("/", createController)
    .get('/', getShowService)
    .get('/:id', getByIdShowService)
    .put('/:id', updateShowService)
    .delete('/:id', deleteShowService)


module.exports = router;
