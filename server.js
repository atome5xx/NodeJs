const express = require('express');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes'); // Assurez-vous que ce chemin est correct
const errorHandler = require('./middlewares/errorHandler');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Connexion à la base de données
connectDB();

app.use(morgan('dev'));
app.use(bodyParser.json());

// Utilisation des routes d'authentification
app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
