const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artistController");
const { verifyToken, authorize } = require("../middleware/authMiddleware");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.use(verifyToken);

router.get(
  "/",
  authorize(["super_admin", "artist_manager", "artist"]),
  artistController.getArtists,
);

router.post("/", authorize(["artist_manager"]), artistController.createArtist);
router.put(
  "/:id",
  authorize(["artist_manager"]),
  artistController.updateArtist,
);
router.delete(
  "/:id",
  authorize(["artist_manager"]),
  artistController.deleteArtist,
);

router.post(
  "/import",
  authorize(["artist_manager"]),
  upload.single("file"),
  artistController.importCSV,
);
router.get(
  "/export",
  authorize(["artist_manager"]),
  artistController.exportCSV,
);

module.exports = router;
