import Sponsor from './sponsorModel.js';
import { uploadToImageKit } from '../../config/imagekit.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { appConfig as config } from '../../config/config.js';

// @desc    GET all sponsors
// @route   GET /api/sponsors
// @access  Public
export const getSponsors = asyncHandler(async (req, res) => {
  const sponsors = await Sponsor.find().sort({ createdAt: -1 });
  res.json({ success: true, data: sponsors });
});

// @desc    Upload sponsor logo
// @route   POST /api/sponsors/upload
// @access  Admin Protected (Header based in routes or here)
export const uploadSponsorLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image uploaded');
  }

  const result = await uploadToImageKit(req.file, 'sponsors');
  res.json({ success: true, url: result.url });
});

// @desc    Add sponsor
// @route   POST /api/sponsors/add
// @access  Admin Protected
export const addSponsor = asyncHandler(async (req, res) => {
  const { name, logoUrl, description } = req.body;

  if (!name || !logoUrl) {
    res.status(400);
    throw new Error('Name and Logo URL are required');
  }

  const newSponsor = new Sponsor({ name, logoUrl, description });
  await newSponsor.save();

  res.status(201).json({
    success: true,
    data: newSponsor,
    message: 'Sponsor added successfully',
  });
});

// @desc    Delete sponsor
// @route   DELETE /api/sponsors/:id
// @access  Admin Protected
export const deleteSponsor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Sponsor.findByIdAndDelete(id);
  res.json({ success: true, message: 'Sponsor deleted successfully' });
});
