import express from "express";

import movieRoutes from "./routes/movieRoutes.js";

const PORT = 3000;

const app = express();

app.use(express.json());

app.use("/movies", movieRoutes);

app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
});