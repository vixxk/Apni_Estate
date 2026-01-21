import express from "express";
import { uploadAvatar } from '../../middleware/uploadMiddleware.js';
import { adminOnly } from '../admin/adminMiddleware.js';
import {
  getSponsors,
  uploadSponsorLogo,
  addSponsor,
  deleteSponsor,
} from './sponsorController.js';

const router = express.Router();

router.get("/", getSponsors);
router.post("/upload", adminOnly, uploadAvatar.single("logo"), uploadSponsorLogo);
router.post("/add", adminOnly, addSponsor);
router.delete("/:id", adminOnly, deleteSponsor);

export default router;
