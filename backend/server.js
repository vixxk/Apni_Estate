import './config/env.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/mongodb.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

import uploadRoutes from './features/upload/uploadRoutes.js';
import userRoutes from './features/users/userRoutes.js';
import propertyRoutes from './features/properties/propertyRoutes.js';
import adminRoutes from './features/admin/adminRoutes.js';
import chatRoutes from './features/chat/chatRoutes.js';
import chatUploadRoute from './features/chat/chatUploadRoutes.js';
import appointmentRoutes from './features/appointments/appointmentRoutes.js';
import contactRequestRoutes from './features/contact/requestRoutes.js';
import formRoutes from './features/contact/formRoutes.js';
import vendorServiceRoutes from './features/services/serviceRoutes.js';
import serviceUploadRoutes from './features/services/uploadRoutes.js';
import testimonialRoutes from './features/testimonials/testimonialRoutes.js';
import sponsorRoutes from './features/sponsors/sponsorRoutes.js';
import estimatorRoutes from './features/tools/estimatorRoutes.js';
import loanAnalysisRoute from './features/tools/loanRoutes.js';
import vastuRoutes from './features/tools/vastuRoutes.js';
import telecallerRoutes from './features/telecaller/telecallerRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

app.use(helmet());
app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/', (req, res) => {
  res.json({
    message: 'ApniEstate Backend API is running!',
    status: 'healthy',
  });
});

app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vendor/services', vendorServiceRoutes);
app.use('/api/contact-requests', contactRequestRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/upload', chatUploadRoute);
app.use('/api/loan', loanAnalysisRoute);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/estimator', estimatorRoutes);
app.use('/api/vastu', vastuRoutes);
app.use('/api/telecallers', telecallerRoutes);

app.use('/api/upload/property', uploadRoutes);
app.use('/api/upload/service', serviceUploadRoutes);

app.get('/status', (req, res) => {
  res.json({
    status: 'OK',
    time: new Date().toISOString(),
  });
});


app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});