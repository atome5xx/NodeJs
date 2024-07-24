import USER from "../models/userModels.js";
import MOVIE from "../models/movieModels.js";
import logger from "../config/logger.js";

// Récupérer tous les utilisateurs
export const getAll = async (req, res) => {
  try {
    const users = await USER.find({}, { _id: 0 }).exec();
    res.json(users);
  } catch (error) {
    logger.error('Erreur lors de la récupération des utilisateurs :', error.message);
    res.status(500).json('Erreur lors de la récupération des utilisateurs.');
  }
}

// Afficher les données d'un utilisateur
export const getProfile = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    const user = await USER.findOne({ id: userId }, { _id: 0 }).exec();
    if (user) {
      res.json(user);
    } else {
      logger.warn(`Utilisateur non trouvé pour l'ID ${userId}.`);
      res.status(404).json('Utilisateur non trouvé.');
    }
  } catch (err) {
    logger.error('Erreur lors de la récupération du profil utilisateur :', err.message);
    res.status(500).send('Server error');
  }
};

// Mettre à jour le profil d'un utilisateur
export const updateUser = async (req, res) => {
  const userId = req.body.id;
  const userFirstName = req.body.firstName;
  const userLastName = req.body.lastName;
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  try {
    const user = await USER.findOne({ id: userId }, { _id: 0 }).exec();

    if (user) {
      const misesAJour = {};
      if (userFirstName !== undefined) misesAJour.firstName = userFirstName;
      if (userLastName !== undefined) misesAJour.lastName = userLastName;
      if (userEmail !== undefined) misesAJour.email = userEmail;
      if (userPassword !== undefined) misesAJour.password = userPassword;

      const result = await USER.updateOne({ id: userId }, { $set: misesAJour });

      if (result.matchedCount === 1 && result.modifiedCount === 1) {
        res.status(200).json({ message: "Utilisateur mis à jour avec succès", data: result });
      } else if (result.matchedCount === 1 && result.modifiedCount === 0) {
        res.status(200).json({ message: "Aucune modification effectuée" });
      } else {
        res.status(404).json({ message: "Utilisateur non trouvé" });
      }
    } else {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  } catch (error) {
    logger.error('Erreur lors de la mise à jour de l\'utilisateur :', error.message);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour de l'utilisateur", error });
  }
}

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    const result = await USER.deleteOne({ id: userId }).exec();
    if (result.deletedCount === 0) {
      logger.warn(`Suppression échouée : utilisateur non trouvé pour l'ID ${userId}.`);
      return res.status(404).json('Aucun utilisateur trouvé.');
    }

    res.status(200).json('Utilisateur supprimé avec succès.');
  } catch (error) {
    logger.error('Erreur lors de la suppression de l\'utilisateur :', error.message);
    res.status(500).json('Erreur lors de la suppression de l\'utilisateur.');
  }
}

// Créer une liste de lecture pour un utilisateur
export const creerListeLecture = async (req, res) => {
  const userId = req.body.id;
  try {
    const user = await USER.findOne({ id: userId }).exec();
    if (user) {
      user.listeLecture = user.listeLecture || { a_voir: [], vue: [], en_cours: [] };

      await user.save();
      res.status(200).json('Liste créée');
    } else {
      logger.warn(`Liste de lecture non créée : utilisateur non trouvé pour l'ID ${userId}.`);
      res.status(404).json('Utilisateur non trouvé.');
    }
  } catch (err) {
    logger.error('Erreur lors de la création de la liste de lecture :', err.message);
    res.status(500).send('Server error');
  }
}

// Ajouter un film à la liste de lecture d'un utilisateur
export const ajouterFilmListeLecture = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const movieId = req.body.movieId;
  const typeListe = req.body.type;

  try {
    const user = await USER.findOne({ id: userId }).exec();
    if (user) {
      user.listeLecture = user.listeLecture || { a_voir: [], vue: [], en_cours: [] };

      if (typeListe == 1) {
        if (!user.listeLecture.a_voir.includes(movieId)) {
          user.listeLecture.a_voir.push(movieId);
          await user.save();
          res.status(200).json('Film ajouté!');
        } else {
          res.status(201).json('Film déjà présent');
        }
      } else if (typeListe == 2) {
        if (!user.listeLecture.vue.includes(movieId)) {
          user.listeLecture.vue.push(movieId);
          await user.save();
          res.status(200).json('Film ajouté!');
        } else {
          res.status(201).json('Film déjà présent');
        }
      } else if (typeListe == 3) {
        if (!user.listeLecture.en_cours.includes(movieId)) {
          user.listeLecture.en_cours.push(movieId);
          await user.save();
          res.status(200).json('Film ajouté!');
        } else {
          res.status(201).json('Film déjà présent');
        }
      } else {
        res.status(405).json('Mauvaise requête');
      }
    } else {
      logger.warn(`Ajout au liste de lecture échoué : utilisateur non trouvé pour l'ID ${userId}.`);
      res.status(404).json('Utilisateur non trouvé.');
    }
  } catch (err) {
    logger.error('Erreur lors de l\'ajout du film à la liste de lecture :', err.message);
    res.status(500).send('Server error');
  }
}

// Afficher la liste de lecture d'un utilisateur avec les titres des films
export const afficherListeLecture = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    const user = await USER.findOne({ id: userId }).exec();
    if (user) {
      const films = await MOVIE.find({ id: { $in: [...user.listeLecture.a_voir, ...user.listeLecture.vue, ...user.listeLecture.en_cours] } }).exec();

      const filmTitles = films.reduce((acc, film) => {
        acc[film.id] = film.title;
        return acc;
      }, {});

      const listeAvecTitres = {
        a_voir: user.listeLecture.a_voir.map(id => ({ id, titre: filmTitles[id] || 'Titre inconnu' })),
        vue: user.listeLecture.vue.map(id => ({ id, titre: filmTitles[id] || 'Titre inconnu' })),
        en_cours: user.listeLecture.en_cours.map(id => ({ id, titre: filmTitles[id] || 'Titre inconnu' }))
      };

      res.status(200).json(listeAvecTitres);
    } else {
      logger.warn(`Affichage de la liste de lecture échoué : utilisateur non trouvé pour l'ID ${userId}.`);
      res.status(404).json('Utilisateur non trouvé.');
    }
  } catch (err) {
    logger.error('Erreur lors de l\'affichage de la liste de lecture :', err.message);
    res.status(500).send('Server error');
  }
}


// Modifier la liste de lecture d'un utilisateur
export const modifierListeLecture = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const listeArrivee = req.body.listeArrivee;
  const movieId = req.body.movieId;

  try {
    const user = await USER.findOne({ id: userId }).exec();

    if (user) {
      // Vérifier que la liste d'arrivée est valide
      if (!['a_voir', 'vue', 'en_cours'].includes(listeArrivee)) {
        return res.status(400).json({ message: 'Liste d\'arrivée invalide' });
      }

      // Trouver la liste de départ en fonction de la présence du film
      let listeDepart;
      for (const key of ['a_voir', 'vue', 'en_cours']) {
        if (user.listeLecture[key].includes(movieId)) {
          listeDepart = key;
          break;
        }
      }

      if (!listeDepart) {
        return res.status(404).json({ message: 'Film non trouvé dans les listes' });
      }

      // Mettre à jour les listes
      user.listeLecture[listeDepart] = user.listeLecture[listeDepart].filter(id => id !== movieId);
      user.listeLecture[listeArrivee] = [...user.listeLecture[listeArrivee], movieId];

      // Sauvegarder les modifications
      await user.save();

      // Retourner la réponse de succès
      res.status(200).json({ message: 'Film déplacé avec succès', listeLecture: user.listeLecture });
    } else {
      logger.warn(`Utilisateur non trouvé pour l'ID ${userId}.`);
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  } catch (error) {
    logger.error('Erreur lors de la mise à jour de la liste de lecture :', error.message);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour de la liste de lecture", error });
  }
}

// Ajouter un film aux favoris d'un utilisateur
export const addFavorite = async (req, res) => {
  logger.info('Received request:', { method: req.method, url: req.originalUrl });

  try {
    const userId = req.body.id;
    const movieId = req.body.movieId;

    // Vérification de la validité des IDs
    if (isNaN(userId) || isNaN(movieId)) {
      return res.status(400).json('ID utilisateur ou ID film invalide.');
    }

    // Vérification si le film existe
    const movie = await MOVIE.findOne({ id: movieId });
    if (!movie) {
      return res.status(404).json('Film non trouvé.');
    }

    // Vérification si l'utilisateur existe
    const user = await USER.findOne({ id: userId });
    if (!user) {
      return res.status(404).json('Utilisateur non trouvé.');
    }

    // Vérification si le film est déjà dans les favoris
    if (user.favoris.includes(movieId)) {
      return res.status(400).json('Le film est déjà dans la liste des favoris.');
    }

    // Ajout du film aux favoris de l'utilisateur
    user.favoris.push(movieId);
    await user.save();

    res.status(200).json('Film ajouté aux favoris avec succès.');
  } catch (error) {
    logger.error('Erreur lors de l\'ajout du film aux favoris :', error.message);
    res.status(500).json('Erreur lors de l\'ajout du film aux favoris.');
  }
};

// Supprimer un film des favoris d'un utilisateur
export const delFavorite = async (req, res) => {
  logger.info('Received request:', { method: req.method, url: req.originalUrl });

  try {
    const userId = req.body.id;
    const movieId = req.body.movieId;

    // Vérification de la validité des IDs
    if (isNaN(userId) || isNaN(movieId)) {
      return res.status(400).json('ID utilisateur ou ID film invalide.');
    }

    // Vérification si le film existe
    const movie = await MOVIE.findOne({ id: movieId });
    if (!movie) {
      return res.status(404).json('Film non trouvé.');
    }

    // Vérification si l'utilisateur existe
    const user = await USER.findOne({ id: userId });
    if (!user) {
      return res.status(404).json('Utilisateur non trouvé.');
    }

    // Vérification si le film est dans les favoris
    if (!user.favoris.includes(movieId)) {
      return res.status(400).json('Le film n\'est pas dans la liste des favoris.');
    }

    // Suppression du film des favoris
    user.favoris = user.favoris.filter(favId => favId !== movieId);
    await user.save();

    res.status(200).json('Film supprimé des favoris avec succès.');
  } catch (error) {
    logger.error('Erreur lors de la suppression du film des favoris :', error.message);
    res.status(500).json('Erreur lors de la suppression du film des favoris.');
  }
};

////////////////////

// Afficher les favoris d'un utilisateur
export const affFavoris = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json('ID utilisateur invalide.');
    }

    const user = await USER.findOne({ id: userId }).exec();
    if (!user) {
      logger.warn(`Utilisateur non trouvé pour l'ID ${userId}.`);
      return res.status(404).json('Utilisateur non trouvé.');
    }

    const movieIds = user.favoris;

    if (movieIds.length === 0) {
      return res.status(200).json('Aucun film dans la liste des favoris.');
    }

    const movies = await MOVIE.find({ id: { $in: movieIds } }).exec();
    const movieTitles = movies.map(movie => movie.title);

    res.status(200).json({ favoris: movieTitles });
  } catch (error) {
    logger.error('Erreur lors de l\'affichage des favoris :', error.message);
    res.status(500).json('Erreur lors de l\'affichage des favoris.');
  }
};

// Ajouter un film à l'historique d'un utilisateur
export const addHistorique = async (req, res) => {
  logger.info('Received request:', { method: req.method, url: req.originalUrl });

  try {
    const userId = req.body.id;
    const movieId = req.body.movieId;

    if (isNaN(userId) || isNaN(movieId)) {
      return res.status(400).json('ID utilisateur ou ID film invalide.');
    }

    const movie = await MOVIE.findOne({ id: movieId }).exec();
    if (!movie) {
      return res.status(404).json('Film non trouvé.');
    }

    const user = await USER.findOne({ id: userId }).exec();
    if (!user) {
      return res.status(404).json('Utilisateur non trouvé.');
    }

    if (user.historique.includes(movieId)) {
      return res.status(400).json('Le film est déjà dans l\'historique.');
    }

    user.historique.push(movieId);
    await user.save();

    res.status(200).json('Film ajouté à l\'historique avec succès.');
  } catch (error) {
    logger.error('Erreur lors de l\'ajout du film à l\'historique :', error.message);
    res.status(500).json('Erreur lors de l\'ajout du film à l\'historique.');
  }
};

// Afficher l'historique d'un utilisateur
export const affHistorique = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json('ID utilisateur invalide.');
    }

    const user = await USER.findOne({ id: userId }).exec();
    if (!user) {
      logger.warn(`Utilisateur non trouvé pour l'ID ${userId}.`);
      return res.status(404).json('Utilisateur non trouvé.');
    }

    const movieIds = user.historique;

    if (movieIds.length === 0) {
      return res.status(200).json('Aucun film dans l\'historique.');
    }

    const movies = await MOVIE.find({ id: { $in: movieIds } }).exec();
    const movieTitles = movies.map(movie => movie.title);

    res.status(200).json({ historique: movieTitles });
  } catch (error) {
    logger.error('Erreur lors de l\'affichage de l\'historique :', error.message);
    res.status(500).json('Erreur lors de l\'affichage de l\'historique.');
  }
};

const userController = {
  getAll,
  getProfile,
  updateUser,
  deleteUser,
  creerListeLecture,
  ajouterFilmListeLecture,
  afficherListeLecture,
  modifierListeLecture,
  addFavorite,
  delFavorite,
  affFavoris,
  addHistorique,
  affHistorique
};

export default userController;