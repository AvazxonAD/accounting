const { Router } = require("express");
const router = Router();


const {
    docJur7Create,
    getAllDocJur7,
    updateDocJur7,
    deleteDocJur7,
    getElementByIdDocJur7
} = require("../../controller/jur_7/doc_prixod_jur7.controller");

router.post("/", docJur7Create)
    .get("/", getAllDocJur7)
    .put("/:id", updateDocJur7)
    .delete("/:id", deleteDocJur7)
    .get("/:id", getElementByIdDocJur7);

module.exports = router;
