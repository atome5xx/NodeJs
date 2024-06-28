import MOVIE from "../models/movieModels.js";

export const getAll = async (req, res) => {
    try {
        console.log('Fetching all movies...');
        const movies = await MOVIE.find({}, { _id: 0 }).exec();
        console.log('Movies found:', movies);

        if (!movies || movies.length === 0) {
            console.log('No movies found.');
            return res.status(404).json({ message: 'No movies found' });
        }

        res.status(200).json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ message: error.message });
    }
}

export const getById = async (req, res) => {
    const movieId = parseInt(req.params.id, 10);
    try {
        console.log('Fetching one movies...');
        const movie = await MOVIE.findOne({ id: movieId }, { _id: 0 }).exec();
        console.log('Movie found:', movie);
        if (!movie || movie.length === 0) {
            console.log('No movies found.');
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(movie);
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ message: error.message });
    }
};

const controller = {
    getAll,
    getById,
};

export default controller;