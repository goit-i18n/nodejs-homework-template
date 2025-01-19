const multer = require('multer');
const path = require('path');
const fs = require('fs')

const tmpDir = path.join(__dirname, "../tmp");


if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}



const upload = multer({
  dest: tmpDir,
  fileFilter: (req, file, cb) => {
    console.log("File", file);
    cb(null, req);
  }
});


module.exports = upload;