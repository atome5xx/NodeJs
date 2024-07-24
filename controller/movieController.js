import MOVIE from "../models/movieModels.js";
import logger from "../config/logger.js";

export const getAll = async (req, res) => {
    try {
        const movies = await MOVIE.find({}, { _id: 0 }).exec();
        logger.info('Successfully retrieved all movies');
        res.json(movies);
    } catch (error) {
        logger.error(`Error retrieving movies: ${error.message}`);
        res.status(500).json('Erreur lors de la récupération des films.');
    }
}

export const getById = async (req, res) => {
    const params = req.params.params;
    const [idPart, modifPart] = params.split('&');
    const movieId = parseInt(idPart, 10);
    const isModif = modifPart === 'modif';

    try {
        const movie = await MOVIE.findOne({ id: movieId }, { _id: 0 }).exec();
        if (movie) {
            logger.info(`Movie with ID ${movieId} found`);
            if (isModif) {
                res.render('movieUpdate', { title: `Modification du Film`, movie });
            } else {
                res.json(movie);
            }
        } else {
            logger.warn(`Movie with ID ${movieId} not found`);
            res.status(404).json('Film non trouvé.');
        }
    } catch (error) {
        logger.error(`Error retrieving movie by ID ${movieId}: ${error.message}`);
        res.status(500).json('Erreur lors de la récupération du film.');
    }
};

export const searchMovie = async (req, res) => {
    try {
        const { title, year, rating } = req.query;
        const query = {};

        if (title) {
            query.title = { $regex: new RegExp(title, 'i') };
        }

        if (year) {
            const parsedYear = parseInt(year, 10);
            if (!isNaN(parsedYear)) {
                query.year = parsedYear;
            } else {
                logger.warn('Invalid year parameter');
                return res.status(400).json('Année invalide.');
            }
        }

        if (rating) {
            const parsedRating = parseFloat(rating);
            if (!isNaN(parsedRating)) {
                query.rating = parsedRating;
            } else {
                logger.warn('Invalid rating parameter');
                return res.status(400).json('Note invalide.');
            }
        }

        const movies = await MOVIE.find(query).exec();
        if (movies.length > 0) {
            logger.info(`Found ${movies.length} movies matching the query`);
            res.json(movies);
        } else {
            logger.info('No matching movies found');
            res.status(404).json('Aucun film correspondant trouvé.');
        }
    } catch (error) {
        logger.error(`Error searching movies: ${error.message}`);
        res.status(500).json('Erreur lors de la récupération des films.');
    }
};

export const deleteMovie = async (req, res) => {
    const movieId = parseInt(req.params.id, 10);
    try {
        const result = await MOVIE.deleteOne({ id: movieId }).exec();
        if (result.deletedCount === 0) {
            logger.warn(`No movies found with ID ${movieId} to delete`);
            return res.status(404).json('Aucun film trouvé.');
        }

        logger.info(`Movie with ID ${movieId} deleted successfully`);
        res.status(200).json('Films supprimés avec succès.');
    } catch (error) {
        logger.error(`Error deleting movie with ID ${movieId}: ${error.message}`);
        res.status(500).json('Erreur lors de la suppression du film.');
    }
}

export const updateMovie = async (req, res) => {
    const movieId = req.body.id;
    const movieRating = req.body.rating;
    const movieTitle = req.body.title;
    const movieYear = req.body.year;
    const movieActors = req.body.actors;

    try {
        const movie = await MOVIE.findOne({ id: movieId }, { _id: 0 }).exec();
        if (movie) {
            const misesAJour = {};
            if (movieRating !== undefined) misesAJour.rating = movieRating;
            if (movieTitle !== undefined) misesAJour.title = movieTitle;
            if (movieYear !== undefined) misesAJour.year = movieYear;
            if (movieActors !== undefined) misesAJour.actors = movieActors;

            const result = await MOVIE.updateOne({ id: movieId }, { $set: misesAJour });
            if (result.nModified === 1) {
                logger.info(`Movie with ID ${movieId} updated successfully`);
                res.status(200).json({ message: "Film mis à jour avec succès", data: result });
            } else {
                logger.info(`No modifications made to movie with ID ${movieId}`);
                res.status(200).json({ message: "Aucune modification effectuée" });
            }
        } else {
            logger.warn(`Movie with ID ${movieId} not found`);
            res.status(404).json({ message: "Film non trouvé" });
        }
    } catch (error) {
        logger.error(`Error updating movie with ID ${movieId}: ${error.message}`);
        res.status(500).json({ message: "Erreur serveur lors de la mise à jour du film", error });
    }
}

export const addMovie = async (req, res) => {
    try {
        const idMaxDoc = await MOVIE.findOne({}, {}, { sort: { 'id': -1 } });
        let movieId = 1;
        if (idMaxDoc) {
            movieId = idMaxDoc.id + 1;
        }

        const movieRating = req.body.rating;
        const movieTitle = req.body.title;
        const movieYear = req.body.year;
        const movieActors = req.body.actors;

        const newMovie = new MOVIE({
            id: movieId,
            rating: movieRating,
            title: movieTitle,
            year: movieYear,
            actors: movieActors
        });

        await newMovie.save();
        logger.info(`New movie added with ID ${movieId}`);
        res.redirect('/movies');
    } catch (error) {
        logger.error(`Error creating new movie: ${error.message}`);
        res.status(500).json({ message: "Erreur serveur lors de la création du film", error });
    }
}

export const createFilm = async (req, res) => {
    res.render('movieCreation');
}

const controller = {
    getAll,
    getById,
    deleteMovie,
    updateMovie,
    addMovie,
    createFilm,
    searchMovie,
};

export default controller;
