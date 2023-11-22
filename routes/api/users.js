const express = require("express");
const router = express.Router();
const { auth } = require("../../middelwares/auth");
const multer = require("multer");
const path = require("path");
const {
  getAll,
  getUsersController,
  createUserController,
  loginUserController,
  updateUserController,
  logoutUserController,
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

const fileFilter = (req, file, cb) => {
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
router.get("/users", auth, getUsersController);
router.post("/users/signup", createUserController);
router.post("/users/login", loginUserController);
router.get("/users/logout", auth, logoutUserController);
router.patch("/users/:userId", auth, updateUserController);
router.get("/contacts", auth, getAll);
router.patch("/avatars", auth, upload.single("avatar"), uploadAvatarController);
module.exports = router;
