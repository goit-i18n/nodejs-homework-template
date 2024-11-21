const multer = require('multer');
const path = require('path');

<<<<<<< Updated upstream
const tempDir = path.join(__dirname, '../tmp');
const storage = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`),
=======
const tmpDir = path.join(__dirname, '../tmp');

const storage = multer.diskStorage({
  destination: tmpDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
>>>>>>> Stashed changes
});

const upload = multer({ storage });

module.exports = upload;
