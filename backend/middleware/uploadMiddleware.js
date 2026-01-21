import multer from 'multer';

// Profile/Avatar upload config (Image only, 5MB)
const avatarStorage = multer.memoryStorage();

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Property/General upload config (Any image, 10MB per file, max 5 files)
// Used in propertRoutes.js
const propertyStorage = multer.memoryStorage();

export const uploadPropertyImages = multer({
  storage: propertyStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
