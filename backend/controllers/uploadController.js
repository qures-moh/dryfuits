const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname).toLowerCase();

    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${ext}`
    );
  }
});

const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];

const allowedExtensions = [
  '.jpeg',
  '.jpg',
  '.png',
  '.gif',
  '.webp',
  '.svg'
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (
    allowedExtensions.includes(ext) &&
    allowedMimeTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Only JPEG, JPG, PNG, GIF, WEBP and SVG images are allowed'
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10
  }
});

exports.uploadSingle = upload.single('image');

exports.uploadMultiple = upload.array('images', 10);

exports.uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded'
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    return res.status(201).json({
      message: 'File uploaded successfully',
      imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);

    return res.status(500).json({
      message: 'Upload failed'
    });
  }
};

exports.uploadMultipleImages = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'No files uploaded'
      });
    }

    const imageUrls = req.files.map(
      (file) => `/uploads/${file.filename}`
    );

    return res.status(201).json({
      message: 'Files uploaded successfully',
      imageUrls
    });
  } catch (error) {
    console.error('Upload error:', error);

    return res.status(500).json({
      message: 'Upload failed'
    });
  }
};