import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const checkId = async (req, res, next) => {
    // Obtenir le token du header de la requête
    const token = req.header('Authorization');

    // Vérifier si le token existe
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Décoder et vérifier le token
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        // Récupérer l'ID de l'utilisateur passé par une des méthodes (params, query ou body)
        const userIdFromParams = req.params.id ? parseInt(req.params.id) : null;
        const userIdFromQuery = req.query.id ? parseInt(req.query.id) : null;
        const userIdFromBody = req.body.id ? parseInt(req.body.id) : null;

        // Utiliser l'ID trouvé dans l'une des sources, ou undefined si aucune n'est trouvée
        const userIdFromRequest = userIdFromParams || userIdFromQuery || userIdFromBody;

        // Vérifier si un ID a été fourni dans la requête
        if (!userIdFromRequest) {
            return res.status(400).json({ msg: 'No user ID provided in request' });
        }

        // Comparer l'ID du token avec l'ID de l'URL
        if (decoded.user.id !== userIdFromRequest) {
            return res.status(401).json({ msg: 'User ID does not match token' });
        }
        // Ajouter l'utilisateur du token décodé à la requête
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

export default checkId;