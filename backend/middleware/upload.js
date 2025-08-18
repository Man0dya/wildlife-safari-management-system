import multer from 'multer';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Custom middleware to handle multipart form data properly
const handleMultipartForm = (fieldName, maxCount) => {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      
      // Ensure text fields are available in req.body
      if (req.body) {
        console.log('Request body after multer:', req.body);
        console.log('Request files after multer:', req.files);
      }
      
      next();
    });
  };
};

export { upload as default, handleMultipartForm };
