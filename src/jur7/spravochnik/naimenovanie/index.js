const { Controller } = require("./controller");
const { validator } = require('../../../helper/validator');
const {
    getByIdNaimenovanieSchema,
    getNaimenovanieSchema,
    createNaimenovanieSchema,
    updateNaimenovanieSchema,
    deleteNaimenovanieSchema,
    getProductKolSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.get('/', validator(Controller.getNaimenovanie, getNaimenovanieSchema));
router.get('/:id', validator(Controller.getByIdNaimenovanie, getByIdNaimenovanieSchema));
//router.get('/kol', validator(Controller.getProductKol, getProductKolSchema));
//router.post('/', validator(Controller.createNaimenovanie, createNaimenovanieSchema));
//router.put('/:id', validator(Controller.updateNaimenovanie, updateNaimenovanieSchema));
//router.delete('/:id', validator(Controller.deleteNaimenovanie, deleteNaimenovanieSchema));

module.exports = router;