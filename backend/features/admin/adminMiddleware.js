import { appConfig as config } from '../../config/config.js';

export const adminOnly = (req, res, next) => {
  const adminEmail = req.headers.email;
  const adminPassword = req.headers.password;

  if (
    adminEmail === config.ADMIN_EMAIL &&
    adminPassword === config.ADMIN_PASSWORD
  ) {
    next();
  } else {
    res
      .status(401)
      .json({ success: false, message: 'Unauthorized: Admin access only' });
  }
};
