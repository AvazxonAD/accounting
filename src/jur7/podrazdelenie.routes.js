const { Router } = require("express");
const router = Router();


const {
    podrazdelenieCreate,
    getpodrazdelenie,
    getByIdpodrazdelenie,
    updatepodrazdelenie,
    deletepodrazdelenie
} = require("./podrazdelenie.controller");

router.post("/", podrazdelenieCreate)
    .get("/", getpodrazdelenie)
    .put("/:id", updatepodrazdelenie)
    .delete("/:id", deletepodrazdelenie)
    .get("/:id", getByIdpodrazdelenie); 

module.exports = router;
