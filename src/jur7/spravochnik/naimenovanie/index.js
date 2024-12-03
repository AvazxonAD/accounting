const { NaimenovanieService } = require("./service");
const { Controller } = require('../../../helper/controller');
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

router.get('/kol', Controller(NaimenovanieService.getProductKol, getProductKolSchema));
router.post('/', Controller(NaimenovanieService.createNaimenovanie, createNaimenovanieSchema));
router.get('/:id', Controller(NaimenovanieService.getByIdNaimenovanie, getByIdNaimenovanieSchema));
router.put('/:id', Controller(NaimenovanieService.updateNaimenovanie, updateNaimenovanieSchema));
router.delete('/:id', Controller(NaimenovanieService.deleteNaimenovanie, deleteNaimenovanieSchema));
router.get('/', Controller(NaimenovanieService.getNaimenovanie, getNaimenovanieSchema));

module.exports = router;