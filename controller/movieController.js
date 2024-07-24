import MOVIE from "../models/movieModels.js";
import logger from "../config/logger.js"; // Assurez-vous que ce chemin est correct

export const getAll = async (req, res) => {
    try {
        // Récupérer le numéro de la page depuis les paramètres de la requête, par défaut à 1
        const page = parseInt(req.query.page, 10) || 1;
        const limit = 2; // Limite à deux films par page
        const skip = (page - 1) * limit; // Calculer le nombre de films à sauter


        // Récupérer les films avec pagination
        const movies = await MOVIE.find({}, { _id: 0 })
            .skip(skip)
            .limit(limit)
            .exec();

        res.json(movies);
    } catch (error) {
        // Log de l'erreur
        logger.error('Erreur lors de la récupération des films:', error);

        // Réponse au client avec message d'erreur
        res.status(500).json({ message: 'Erreur lors de la récupération des films.', error: error.message });
    }
}

export const getById = async (req, res) => {
    // Récupérer les paramètres de l'URL
    const params = req.params.params;

    // Extraire l'ID et vérifier la présence de 'modif'
    const [idPart, modifPart] = params.split('&');
    const movieId = parseInt(idPart, 10);
    const isModif = modifPart === 'modif';

    try {
        // Je regarde si le film existe dans la BDD
        const movie = await MOVIE.findOne({ id: movieId }, { _id: 0 }).exec();
        if (movie) {
            // Je regarde si il y a un paramètre modif dans l'URL
            if (isModif) {
                res.render('movieUpdate', { title: `Modification du Film`, movie });
            } else {
                res.json(movie);
            }
        } else {
            logger.warn(`Film avec ID ${movieId} non trouvé.`);
            res.status(404).json('Film non trouvé.');
        }
    } catch (error) {
        // Log de l'erreur
        logger.error('Erreur lors de la récupération du film:', error);
        res.status(500).json('Erreur lors de la récupération du film.');
    }
};


export const searchMovie = async (req, res) => {
    try {
        // Récupération des paramètres de requête
        const { title, year, rating } = req.query;

        // Création d'un objet de requête dynamique pour la recherche
        const query = {};

        if (title) {
            query.title = { $regex: new RegExp(title, 'i') };
        }

        if (year) {
            const parsedYear = parseInt(year, 10);
            if (!isNaN(parsedYear)) {
                query.year = parsedYear;
            } else {
                return res.status(400).json('Année invalide.');
            }
        }

        if (rating) {
            const parsedRating = parseFloat(rating);
            if (!isNaN(parsedRating)) {
                query.rating = parsedRating;
            } else {
                return res.status(400).json('Note invalide.');
            }
        }

        // Recherche des films dans la base de données
        const movies = await MOVIE.find(query).exec();

        if (movies.length > 0) {
            res.json(movies);
        } else {
            res.status(404).json('Aucun film correspondant trouvé.');
        }
    } catch (error) {
        // Log de l'erreur
        logger.error('Erreur lors de la récupération des films:', error);
        res.status(500).json('Erreur lors de la récupération des films.');
    }
};

export const deleteMovie = async (req, res) => {
    const movieId = parseInt(req.params.id, 10);
    try {
        const result = await MOVIE.deleteOne({ id: movieId }).exec();

        if (result.deletedCount === 0) {
            logger.warn(`Aucun film trouvé pour l'ID ${movieId}.`);
            return res.status(404).json('Aucun film trouvé.');
        }

        res.status(200).json('Film supprimé avec succès.');
    } catch (error) {
        // Log de l'erreur
        logger.error('Erreur lors de la suppression du film:', error);
        res.status(500).json('Erreur lors de la suppression du film.');
    }
};

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
                res.status(200).json({ message: "Film mis à jour avec succès", data: result });
            } else {
                res.status(200).json({ message: "Aucune modification effectuée" });
            }
        } else {
            res.status(404).json({ message: "Film non trouvé" });
        }
    } catch (error) {
        // Log de l'erreur
        logger.error('Erreur lors de la mise à jour du film:', error);
        res.status(500).json({ message: "Erreur serveur lors de la mise à jour du film", error });
    }
};

export const addMovie = async (req, res) => {
    try {
        // Récupérer le plus grand ID
        const idMaxDoc = await MOVIE.findOne({}, {}, { sort: { 'id': -1 } });
        let movieId = 1;

        if (idMaxDoc) {
            movieId = idMaxDoc.id + 1;
        }

        // Récupérer les données du corps de la requête
        const movieRating = req.body.rating;
        const movieTitle = req.body.title;
        const movieYear = req.body.year;
        const movieActors = req.body.actors;

        // Créer un nouveau film
        const newMovie = new MOVIE({
            id: movieId,
            rating: movieRating,
            title: movieTitle,
            year: movieYear,
            actors: movieActors
        });

        // Enregistrer le nouveau film dans la base de données
        await newMovie.save();

        res.redirect('/movies');
    } catch (error) {
        // Log de l'erreur
        logger.error('Erreur lors de la création du film:', error);
        res.status(500).json({ message: "Erreur serveur lors de la création du film", error });
    }
};

export const createFilm = async (req, res) => {
    try {
        res.render('movieCreation');
    } catch (error) {
        // Log de l'erreur
        logger.error('Erreur lors de l\'affichage du formulaire de création de film:', error);
        res.status(500).json('Erreur lors de l\'affichage du formulaire de création de film.');
    }
};


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