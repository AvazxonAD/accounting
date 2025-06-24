const { Controller } = require("./controller");
const { validator } = require("@helper/validator");
const {
  createPodrazdelenieSchema,
  getPodrazdelenieSchema,
  updatePodrazdelenieSchema,
  getByIdPodrazdelenieSchema,
  deletePodrazdelenieSchema,
  PodrazSchema,
} = require("./schema");

const { Router } = require("express");
const router = Router();

router
  .post(
    "/",
    validator(Controller.createPodrazdelenie, createPodrazdelenieSchema)
  )
  .get(
    "/:id",
    validator(Controller.getByIdPodrazdelenie, getByIdPodrazdelenieSchema)
  )
  .put(
    "/:id",
    validator(Controller.updatePodrazdelenie, updatePodrazdelenieSchema)
  )
  .delete(
    "/:id",
    validator(Controller.deletePodrazdelenie, deletePodrazdelenieSchema)
  )
  .get("/", validator(Controller.get, getPodrazdelenieSchema));

module.exports = router;
