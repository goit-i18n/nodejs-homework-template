import multer from "multer";
import path from "path";

// Configurarea pentru salvarea fișierelor în folderul temporar tmp
const tmpDir = path.join(process.cwd(), "tmp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    // Denumește fișierul cu ID-ul utilizatorului și numele original
    const uniqueFilename = `${req.user._id}_${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

// Setări pentru a limita tipurile de fișiere acceptate (ex: doar imagini)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Middleware-ul multer pentru upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 }, // Limita de 1 MB pentru fișier
});

export default upload;
