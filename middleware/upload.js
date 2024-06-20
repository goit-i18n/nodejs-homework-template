// middleware/upload.js
import multer from "multer";
import path from "path";

// Set up storage for multer
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "tmp/");
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + path.extname(file.originalname));
	},
});

const upload = multer({ storage });

export default upload;
