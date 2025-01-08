const { Controller } = require("./controller");
const { validator } = require('../../../helper/validator');
const {
    createNaimenovanieSchema,
    getNaimenovanieSchema,
    updateNaimenovanieSchema,
    getByIdNaimenovanieSchema,
    deleteNaimenovanieSchema,
    getProductKolSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/kol', validator(Controller.getProductKol, getProductKolSchema));
router.post('/', validator(Controller.createNaimenovanie, createNaimenovanieSchema));
router.get('/:id', validator(Controller.getByIdNaimenovanie, getByIdNaimenovanieSchema));
router.put('/:id', validator(Controller.updateNaimenovanie, updateNaimenovanieSchema));
router.delete('/:id', validator(Controller.deleteNaimenovanie, deleteNaimenovanieSchema));
router.get('/', validator(Controller.getNaimenovanie, getNaimenovanieSchema));

module.exports = router;