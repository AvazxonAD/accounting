const { Controller } = require("./controller");
const { validator } = require('../../../helper/validator');
const {
    createPodrazdelenieSchema,
    getPodrazdelenieSchema,
    updatePodrazdelenieSchema,
    getByIdPodrazdelenieSchema,
    deletePodrazdelenieSchema
} = require("./schema");

const { Router } = require('express')
const router = Router()

router.post('/', validator(Controller.createPodrazdelenie, createPodrazdelenieSchema));
router.get('/:id', validator(Controller.getByIdPodrazdelenie, getByIdPodrazdelenieSchema));
router.put('/:id', validator(Controller.updatePodrazdelenie, updatePodrazdelenieSchema));
router.delete('/:id', validator(Controller.deletePodrazdelenie, deletePodrazdelenieSchema));
router.get('/', validator(Controller.getPodrazdelenie, getPodrazdelenieSchema));


module.exports = router;