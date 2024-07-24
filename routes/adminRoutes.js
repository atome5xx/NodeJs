import express from 'express';
import adminMiddleware from '../middleware/adminMiddleware.js'; 
import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Route protégée pour les administrateurs seulement
router.get('/admin-only', adminMiddleware, (req, res) => {
  res.send('Welcome, Admin!');
});

export default router;
