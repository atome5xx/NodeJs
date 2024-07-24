import USER from '../models/userModels.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from "../config/logger.js";

// Fonction d'inscription
export const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    let user = await USER.findOne({ email });
    if (user) {
      logger.warn(`Registration attempt with existing email: ${email}`);
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new USER({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    if (!process.env.JWT_SECRET) {
      logger.error('JWT secret is not defined');
      return res.status(500).json({ msg: 'JWT secret is not defined' });
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        logger.error(`JWT Signing Error: ${err.message}`);
        return res.status(500).send('Server error');
      }
      logger.info(`User registered successfully: ${email}, ID: ${user.id}`);
      res.json({ token });
    });
  } catch (err) {
    logger.error(`Registration Error: ${err.message}`);
    res.status(500).send('Server error');
  }
};

// Fonction de connexion
export const login = async (req, res) => {
  const { email, password } = req.body;
  logger.info(`Login attempt with email: ${email}`);

  try {
    const user = await USER.findOne({ email: email }).exec();
    if (!user) {
      logger.warn(`Login failed: Invalid credentials for email: ${email}`);
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed: Invalid credentials for email: ${email}`);
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        logger.error(`JWT Signing Error: ${err.message}`);
        throw err;
      }
      logger.info(`User logged in successfully: ${email}, ID: ${user.id}`);
      res.json({ token });
    });
  } catch (err) {
    logger.error(`Login Error: ${err.message}`);
    res.status(500).send('Server error');
  }
};

export default login;
