const express = require("express");
const router = express.Router();
const { auth } = require("../../middelwares/auth");
const multer = require("multer");
const path = require("path");
const {
  getUsersController,
  createUserController,
  loginUserController,

  logoutUserController,
  findUserController,
  uploadAvatarController,
} = require("../../controllers/index");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/avatars/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const filefilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
router.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

// Ruta pentru obținerea tuturor utilizatorilor
router.get("/users", getUsersController);

// Rute pentru autentificare și gestionarea utilizatorilor
router.post("/signup", createUserController);
router.post("/login", loginUserController);
router.get("/current", auth, findUserController);
router.get("/logout", auth, logoutUserController);

// Rută pentru încărcarea avatarului utilizatorului autentificat
router.patch("/avatars", auth, upload.single("avatar"), uploadAvatarController);

module.exports = router;
