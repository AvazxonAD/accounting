const { Router } = require("express");
const router = Router();


const {
    pereotsenkaCreate,
    getPereotsenka,
    getByIdPereotsenka,
    updatePereotsenka,
    deletePereotsenka
} = require("../../controller/jur_7/pereotsenka.controller");

router.post("/", pereotsenkaCreate)
    .get("/", getPereotsenka)
    .put("/:id", updatePereotsenka)
    .delete("/:id", deletePereotsenka)
    .get("/:id", getByIdPereotsenka); 

module.exports = router;
