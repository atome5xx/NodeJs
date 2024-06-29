import MOVIE from "../models/movieModels.js";

export const getAll = async (req, res) => {
    try {
        const movies = await MOVIE.find({}, { _id: 0 }).exec(); // Supposant que vous utilisez Mongoose pour interroger MongoDB
        res.render('movies', { title: 'Liste des Films', movies });
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des films.');
    }
}

export const getById = async (req, res) => {
    const movieId = parseInt(req.params.id, 10);
    try {
        const movie = await MOVIE.findOne({ id: movieId }, { _id: 0 }).exec();
        if (movie) {
            res.render('movieDetail', { title: `Détails du Film`, movie });
        } else {
            res.status(404).send('Film non trouvé.');
        }
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération du film.');
    }
};

export const deleteMovie = async (req, res) => {
    console.log("delete appelé");
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

const controller = {
    getAll,
    getById,
    deleteMovie,
};

export default controller;