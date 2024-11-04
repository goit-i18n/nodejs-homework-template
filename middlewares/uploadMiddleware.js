const multer = require('multer');
const path = require('path');

const tmpDir = path.join(__dirname, '../tmp');

const storage = multer.diskStorage({
    destination: tmpDir,
    filename: (req, file, cb) => {
        const uniqueSuffix = `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueSuffix);
    },
});

const upload = multer({ storage });

module.exports = upload;
