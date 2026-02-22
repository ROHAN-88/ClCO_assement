const express = require("express");
const router = express.Router();
const musicController = require("../controllers/songController");
const { verifyToken, authorize } = require("../middleware/authMiddleware");

router.use(verifyToken);

router.get(
  "/artist/:artist_id",
  authorize(["super_admin", "artist_manager", "artist"]),
  musicController.getMusicByArtist,
);

router.post("/", authorize(["artist"]), musicController.createMusic);
router.put("/:id", authorize(["artist"]), musicController.updateMusic);
router.delete("/:id", authorize(["artist"]), musicController.deleteMusic);

module.exports = router;
