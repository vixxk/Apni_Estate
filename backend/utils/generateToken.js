import jwt from 'jsonwebtoken';
import { appConfig as config } from '../config/config.js';

const generateToken = (id) => {
  if (!config.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing in config');
  }

  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN || '30d',
  });
};

export default generateToken;
