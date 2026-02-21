const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, authorize } = require("../middleware/authMiddleware");

router.use(verifyToken);

router.use(authorize(["super_admin"]));

router.get("/", userController.getUsers);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
