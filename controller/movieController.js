import { MOVIES } from "../models/dummys.js";

export const getAll = (req, res) => {
    res.json(MOVIES);
}

export const getById = (req, res) => {
    const movieId = parseInt(req.params.id, 10);
    const movie = MOVIES.find(m => m.id === movieId);

    if (movie) {
        res.json(movie);
    } else {
        res.status(404).json({ message: 'Movie not found' });
    }
};

const controller = {
    getAll,
    getById,
};

export default controller;