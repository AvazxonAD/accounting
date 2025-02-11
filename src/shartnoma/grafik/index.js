const { Router } = require("express");
const router = Router();
const { validator } = require('../../helper/validator');
const { Controller } = require('./controller')
const { GrafikSchema } = require('./schema');

const {
  getAllGrafik,
  getElementByIdGrafik,
  updateShartnomaGrafik,
} = require("../shartnoma.grafik.controller");

router
  .post('/', validator(Controller.create, GrafikSchema.create()))
  .get("/", getAllGrafik)
  .get("/:id", getElementByIdGrafik)
  .put("/:id", updateShartnomaGrafik);

module.exports = router;
