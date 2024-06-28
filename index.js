import express from "express";
import mongoose from 'mongoose';

import movieRoutes from "./routes/movieRoutes.js";

mongoose.connect('mongodb://localhost:27017/Movies');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

const PORT = 4000;

const app = express();

app.use(express.json());

app.use("/movies", movieRoutes);

app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
});