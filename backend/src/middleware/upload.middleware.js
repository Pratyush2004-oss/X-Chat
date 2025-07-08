import multer from 'multer'

const storage = multer.memoryStorage();
export const singleUpload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    },
    limits: {fileSize: 5 * 1024 * 1024}, // 5mb limit
}).single("image");
