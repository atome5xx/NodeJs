<<<<<<< Updated upstream
import express from "express";
import movieRoutes from "./routes/movieRoutes.js";
import userRoutes from "./routes/userRoutes.js";
=======
import express from 'express';
import dotenv from 'dotenv';

dotenv.config(); // Doit être appelé avant tout autre code

import movieRoutes from './routes/movieRoutes.js';
import authRoutes from './routes/authRoutes.js';
>>>>>>> Stashed changes

const PORT = 3000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

<<<<<<< Updated upstream
app.use("/movies", movieRoutes);
app.use("/users", userRoutes);
=======
// Routes
app.use('/api/v1/auth', authRoutes);
>>>>>>> Stashed changes

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('JWT_SECRET:', process.env.JWT_SECRET); // Vérifiez la valeur de JWT_SECRET
});
