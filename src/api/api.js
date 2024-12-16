const router = require("express").Router();

const { authenticateToken } = require("../middlewares/auth.midleware");
const { register, login, refreshToken } = require("../services/auth.service");
const { getRoles } = require("../services/roles.service");

router.use("/admin", authenticateToken);

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/refresh/token", refreshToken);
router.get("/admin/api/v1/get/roles", getRoles);

module.exports = { router };
