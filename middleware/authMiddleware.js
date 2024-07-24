import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import logger from '../config/logger.js'; // Assurez-vous d'avoir un logger configuré

dotenv.config();

export const checkJWT = async (req, res, next) => {
  // Obtenir le token du header de la requête
  const token = req.header('Authorization');

  // Vérifier si le token existe
  if (!token) {
    logger.warn('Aucun token trouvé dans l\'en-tête Authorization.');
    return res.status(401).json({ msg: 'Aucun token, autorisation refusée.' });
  }

  try {
    // Décoder et vérifier le token
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

    // Ajouter l'utilisateur du token décodé à la requête
    req.user = decoded.user;
    next();
  } catch (err) {
    logger.error('Erreur lors de la vérification du token :', err.message);
    res.status(401).json({ msg: 'Le token n\'est pas valide.' });
  }
};

export default checkJWT;
