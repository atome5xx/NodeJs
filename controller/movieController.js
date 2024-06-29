import MOVIE from "../models/movieModels.js";

export const getAll = async (req, res) => {
    try {
        const movies = await MOVIE.find({}, { _id: 0 }).exec();
        res.render('movies', { title: 'Liste des Films', movies });
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des films.');
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
        //je regarde si le film existe dans la bdd
        const movie = await MOVIE.findOne({ id: movieId }, { _id: 0 }).exec();
        if (movie) {
            //je regarde si il y a un parametre modif dans l'url
            if (isModif) {
                res.render('movieUpdate', { title: `Modification du Film`, movie });
            } else {
                res.render('movieDetail', { title: `Détails du Film`, movie });
            }
        } else {
            res.status(404).send('Film non trouvé.');
        }
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération du film.');
    }
};

export const deleteMovie = async (req, res) => {
    const movieId = parseInt(req.params.id, 10);
    try {
        const result = await MOVIE.deleteOne({ id: movieId }).exec();
        // Vérifier si des films ont été supprimés
        if (result.deletedCount === 0) {
            return res.status(404).send('Aucun film trouvé.');
        }

        // Répondre avec succès
        res.status(200).send('Films supprimés avec succès.');
    } catch (error) {
        res.status(500).send('Erreur lors de la supression du film.');
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
                res.status(200).json({ message: "Film mis à jour avec succès", data: result });
            } else {
                res.status(200).json({ message: "Aucune modification effectuée" });
            }
        } else {
            res.status(404).json({ message: "Film non trouvé" });
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du film :', error);
        res.status(500).json({ message: "Erreur serveur lors de la mise à jour du film", error });
    }
}

export const addMovie = async (req, res) => {
    try {
        // Récupérer le plus grand ID
        const idMaxDoc = await MOVIE.findOne({}, {}, { sort: { 'id': -1 } });
        let movieId = 1; // Valeur par défaut si aucune entrée dans la base de données

        if (idMaxDoc) {
            movieId = idMaxDoc.id + 1; // Incrémenter l'ID maximal trouvé
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

        // Répondre avec succès
        res.redirect('/movies');
    } catch (error) {
        console.error('Erreur lors de la création du film :', error);
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
};

export default controller;