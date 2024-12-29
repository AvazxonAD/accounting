const { NaimenovanieService } = require("./service");
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

router.get('/kol', validator(NaimenovanieService.getProductKol, getProductKolSchema));
router.post('/', validator(NaimenovanieService.createNaimenovanie, createNaimenovanieSchema));
router.get('/:id', validator(NaimenovanieService.getByIdNaimenovanie, getByIdNaimenovanieSchema));
router.put('/:id', validator(NaimenovanieService.updateNaimenovanie, updateNaimenovanieSchema));
router.delete('/:id', validator(NaimenovanieService.deleteNaimenovanie, deleteNaimenovanieSchema));
router.get('/', validator(NaimenovanieService.getNaimenovanie, getNaimenovanieSchema));

module.exports = router;