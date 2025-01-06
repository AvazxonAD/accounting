const { Router } = require('express');
const router = Router();
const { validator } = require('../../helper/validator')
const { Controller } = require('./controller')
const {
    createSchema,
    getSchema,
    getByIdSchema,
    deleteSchema,
    updateSchema
} = require('./schema')


router.get("/:id", validator(Controller.getByIdSmetaGrafik, getByIdSchema));
router.get("/", validator(Controller.getSmetaGrafik, getSchema));
router.post("/", validator(Controller.createSmetaGrafik, createSchema));
router.put("/:id", validator(Controller.updateSmetaGrafik, updateSchema));
router.delete("/:id", validator(Controller.deleteSmetGrafik, deleteSchema));

module.exports = router;
