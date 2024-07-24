import USER from '../models/userModels.js';
import Counter from '../models/counterModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from "../config/logger.js";

// Fonction d'inscription
export const register = async (req, res) => {
  const { firstName, lastName, email, password, favoris = [] } = req.body;

  try {
    let user = await USER.findOne({ email });
    if (user) {
      logger.warn(`Inscription échouée : l'utilisateur avec l'email ${email} existe déjà.`);
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Obtenir le prochain ID à partir du compteur
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'userId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const id = counter.seq;

    user = new USER({
      id,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      favoris,
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin,
      },
    };

    if (!process.env.JWT_SECRET) {
      logger.error('JWT secret is not defined.');
      return res.status(500).json({ msg: 'JWT secret is not defined' });
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        logger.error('JWT Signing Error:', err.message);
        return res.status(500).send('Server error');
      }
      res.json({ token });
    });
  } catch (err) {
    logger.error('Registration Error:', err.message);
    res.status(500).send('Server error');
  }
};

// Fonction de connexion
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await USER.findOne({ email }).exec();
    if (!user) {
      logger.warn(`Connexion échouée : utilisateur non trouvé pour l'email ${email}.`);
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Connexion échouée : mot de passe incorrect pour l'utilisateur ${email}.`);
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        logger.error('JWT Signing Error:', err.message);
        return res.status(500).send('Server error');
      }
      res.header('Authorization', 'Bearer ' + token);
      res.json({ token });
    });
  } catch (err) {
    logger.error('Login Error:', err.message);
    res.status(500).send('Server error');
  }
};

export default {
  register,
  login,
};
