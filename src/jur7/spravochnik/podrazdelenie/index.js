const { PodrazdelenieService } = require("./service");
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

router.post('/', validator(PodrazdelenieService.createPodrazdelenie, createPodrazdelenieSchema));
router.get('/:id', validator(PodrazdelenieService.getByIdPodrazdelenie, getByIdPodrazdelenieSchema));
router.put('/:id', validator(PodrazdelenieService.updatePodrazdelenie, updatePodrazdelenieSchema));
router.delete('/:id', validator(PodrazdelenieService.deletePodrazdelenie, deletePodrazdelenieSchema));
router.get('/', validator(PodrazdelenieService.getPodrazdelenie, getPodrazdelenieSchema));


module.exports = router;