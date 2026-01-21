import { asyncHandler } from '../../middleware/asyncHandler.js';
import { uploadToImageKit } from '../../config/imagekit.js';

// @desc    IMAGE UPLOAD ENDPOINT
// @route   POST /api/upload/property-images
// @access  Admin/Vendor
export const uploadPropertyImages = asyncHandler(async (req, res) => {
  const files = req.files || [];

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const urls = files.map((f) => ({
    url: `${baseUrl}/uploads/${f.filename}`,
  }));

  res.json({
    success: true,
    data: { images: urls },
  });
});

// @desc    SERVICE IMAGE UPLOAD ENDPOINT
// @route   POST /api/upload/service-images
// @access  Vendor
export const uploadServiceImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No images uploaded');
  }

  const uploads = await Promise.all(
    req.files.map((file, idx) =>
      uploadToImageKit(file, 'services').then((img) => ({
        ...img,
        isPrimary: idx === 0,
      }))
    )
  );

  res.json({
    success: true,
    data: { images: uploads },
  });
});
