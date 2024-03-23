const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "temp/" });
const Jimp = require("jimp");
const fs = require("fs").promises;

router.patch("/users/avatars", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const image = await Jimp.read(filePath);
    await image.resize(250, 250);
    const processedFilePath = `public/avatars/${req.user._id}.jpg`;
    await image.writeAsync(processedFilePath);

    req.user.avatarUrl = `/avatars/${req.user._id}.jpg`;
    await req.user.save();

    await fs.unlike(filePath);

    res.json({ avatarUrl: req.user.avatarUrl });
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
});
