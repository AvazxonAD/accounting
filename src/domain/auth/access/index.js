const { Router } = require("express");
const router = Router();
const { validator } = require("@helper/validator");
const { AccessService } = require("./service");
const { updateAccessSchema, getByRoleIdAccessSchema } = require("./schema");

router.get(
  "/",
  validator(AccessService.getByRoleIdAccess, getByRoleIdAccessSchema)
);
router.put("/:id", validator(AccessService.updateAccess, updateAccessSchema));

module.exports = router;
