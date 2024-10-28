const multer = require('multer');
const path = require('path');

const tempDir = path.join(__dirname, '../tmp');
const storage = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, cb) => cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({ storage });

module.exports = upload;
