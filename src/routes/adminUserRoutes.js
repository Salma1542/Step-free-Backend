const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getAllUsers,
  createUser,
  updateUserRole,
  toggleBlockUser,
  deleteUser,
  updateUser,
} = require("../controllers/adminUserController");

router.use(protect);

router.get("/", getAllUsers);

router.post("/", createUser);

router.patch("/:id/role", updateUserRole);

router.patch("/:id/toggle-block", toggleBlockUser);

router.patch("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;