import USER from '../models/userModels.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Fonction d'inscription
export const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    let user = await USER.findOne({ email });
    if (user) {
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

    // Vérifiez si JWT_SECRET est défini
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
        },
      };
  
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
export default login;