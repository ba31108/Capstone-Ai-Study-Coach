const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed.'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

const handlePdfUpload = (req, res, next) => {
  upload.single('pdf')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        message: err.code === 'LIMIT_FILE_SIZE'
          ? 'File too large. Maximum size is 10 MB.'
          : err.message,
      });
    }
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

module.exports = { handlePdfUpload };
