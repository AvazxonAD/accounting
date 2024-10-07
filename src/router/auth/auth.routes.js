const { Router } = require("express");
const router = Router();

const { protect } = require("../../middleware/auth");

const {
  login,
  update,
  getProfile,
  select_budget,
  forLogin
} = require("../../controller/auth/auth.controller");

router.post("/", login);
router.patch("/", protect, update);
router.get("/", protect, getProfile);
router.get("/select/budjet/:id", select_budget);
router.get('/budjet/region', forLogin)

module.exports = router;
