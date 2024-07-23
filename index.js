import express from "express";
import movieRoutes from "./routes/movieRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const PORT = 3000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use("/movies", movieRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
});