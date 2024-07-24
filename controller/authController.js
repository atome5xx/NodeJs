import USER from '../models/userModels.js';
import Counter from '../models/counterModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Fonction d'inscription
export const register = async (req, res) => {
  const { firstName, lastName, email, password, favoris = [] } = req.body; // Ajout de favoris avec une valeur par défaut vide

  try {
    let user = await USER.findOne({ email });
    if (user) {
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
      favoris, // Utilisation de la variable favoris
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
        isAdmin : user.isAdmin,
      },
    };

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: 'JWT secret is not defined' });
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        console.error('JWT Signing Error:', err.message);
        return res.status(500).send('Server error');
      }
      res.json({ token });
    });
  } catch (err) {
    console.error('Registration Error:', err.message);
    res.status(500).send('Server error');
  }
};

// Fonction de connexion
export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt with email:', email);
  try {
    const user = await USER.findOne({ email: email }).exec();
    console.log('User found:', user);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.header('Authorization', 'Bearer ' + token);
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export default login;
