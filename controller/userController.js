import USER from "../models/userModels.js";
import MOVIE from "../models/movieModels.js";
import logger from "../config/logger.js";

export const getAll = async (req, res) => {
  console.log('Requête pour récupérer tous les utilisateurs');
  try {
    const users = await USER.find({}, { _id: 0 }).exec();
    console.log('Utilisateurs récupérés avec succès:', users);
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json('Erreur lors de la récupération des utilisateurs.');
  }
};

export const getProfile = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  console.log(`Requête pour récupérer le profil de l'utilisateur avec l'ID: ${userId}`);
  try {
    const user = await USER.findOne({ id: userId }, { _id: 0 }).exec();
    if (user) {
      console.log('Profil utilisateur récupéré:', user);
      res.json(user);
    } else {
      console.log('Utilisateur non trouvé.');
      res.status(404).json('Utilisateur non trouvé.');
    }
  } catch (err) {
    console.error('Erreur lors de la récupération du profil utilisateur:', err);
    res.status(500).send('Server error');
  }
};

export const updateUser = async (req, res) => {
  const userId = req.body.id;
  console.log(`Requête pour mettre à jour l'utilisateur avec l'ID: ${userId}`);
  try {
    const user = await USER.findOne({ id: userId }, { _id: 0 }).exec();
    if (user) {
      const misesAJour = {};
      const userFirstName = req.body.firstName;
      const userLastName = req.body.lastName;
      const userEmail = req.body.email;
      const userPassword = req.body.password;

      if (userFirstName !== undefined) misesAJour.firstName = userFirstName;
      if (userLastName !== undefined) misesAJour.lastName = userLastName;
      if (userEmail !== undefined) misesAJour.email = userEmail;
      if (userPassword !== undefined) misesAJour.password = userPassword;

      const result = await USER.updateOne({ id: userId }, { $set: misesAJour });

      if (result.matchedCount === 1 && result.modifiedCount === 1) {
        console.log('Utilisateur mis à jour avec succès:', result);
        res.status(200).json({ message: "Utilisateur mis à jour avec succès", data: result });
      } else if (result.matchedCount === 1 && result.modifiedCount === 0) {
        console.log('Aucune modification effectuée.');
        res.status(200).json({ message: "Aucune modification effectuée" });
      }
    } else {
      console.log('Utilisateur non trouvé.');
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour de l'utilisateur", error });
  }
};

export const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  console.log(`Requête pour supprimer l'utilisateur avec l'ID: ${userId}`);
  try {
    const result = await USER.deleteOne({ id: userId }).exec();
    if (result.deletedCount === 0) {
      console.log('Aucun utilisateur trouvé à supprimer.');
      return res.status(404).json('Aucun utilisateur trouvé.');
    }
    console.log('Utilisateur supprimé avec succès.');
    res.status(200).json('Utilisateur supprimé avec succès.');
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json('Erreur lors de la suppression de l\'utilisateur.');
  }
};

export const creerListeLecture = async (req, res) => {
  const userId = req.body.id;
  console.log(`Requête pour créer une liste de lecture pour l'utilisateur avec l'ID: ${userId}`);
  try {
    const user = await USER.findOne({ id: userId }).exec();
    if (user) {
      user.listeLecture = user.listeLecture || { a_voir: [], vue: [], en_cours: [] };
      await user.save();
      console.log('Liste de lecture créée pour l\'utilisateur.');
      res.status(200).json('Liste créée');
    } else {
      console.log('Utilisateur non trouvé.');
      res.status(404).json('Utilisateur non trouvé.');
    }
  } catch (err) {
    console.error('Erreur lors de la création de la liste de lecture:', err);
    res.status(500).send('Server error');
  }
};

export const ajouterFilmListeLecture = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const movieId = req.body.movieId;
  const typeListe = req.body.type;
  console.log(`Requête pour ajouter le film ID ${movieId} à la liste de type ${typeListe} pour l'utilisateur ID ${userId}`);
  try {
    const user = await USER.findOne({ id: userId }).exec();
    if (user) {
      user.listeLecture = user.listeLecture || { a_voir: [], vue: [], en_cours: [] };
      if (typeListe == 1) {
        if (!user.listeLecture.a_voir.includes(movieId)) {
          user.listeLecture.a_voir.push(movieId);
          console.log('Film ajouté à la liste a_voir.');
          res.status(200).json('Film ajouté!');
          await user.save();
        } else {
          console.log('Film déjà présent dans la liste a_voir.');
          res.status(201).json('Film déjà présent');
        }
      } else if (typeListe == 2) {
        if (!user.listeLecture.vue.includes(movieId)) {
          user.listeLecture.vue.push(movieId);
          console.log('Film ajouté à la liste vue.');
          res.status(200).json('Film ajouté!');
          await user.save();
        } else {
          console.log('Film déjà présent dans la liste vue.');
          res.status(201).json('Film déjà présent');
        }
      } else if (typeListe == 3) {
        if (!user.listeLecture.en_cours.includes(movieId)) {
          user.listeLecture.en_cours.push(movieId);
          console.log('Film ajouté à la liste en_cours.');
          res.status(200).json('Film ajouté!');
          await user.save();
        } else {
          console.log('Film déjà présent dans la liste en_cours.');
          res.status(201).json('Film déjà présent');
        }
      } else {
        console.log('Type de liste invalide.');
        res.status(405).json('Mauvaise requête');
      }
    } else {
      console.log('Utilisateur non trouvé.');
      res.status(404).json('Utilisateur non trouvé.');
    }
  } catch (err) {
    console.error('Erreur lors de l\'ajout du film à la liste de lecture:', err);
    res.status(500).send('Server error');
  }
};

export const afficherListeLecture = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  console.log(`Start afficherListeLecture for userId: ${userId}`); // Log du début

  try {
    const user = await USER.findOne({ id: userId }).exec();
    if (user) {
      console.log(`User found for userId: ${userId}`); // Log de l'utilisateur trouvé

      // Récupérer les titres des films pour chaque liste
      const films = await MOVIE.find({ id: { $in: [...user.listeLecture.a_voir, ...user.listeLecture.vue, ...user.listeLecture.en_cours] } }).exec();
      console.log(`Films retrieved for userId: ${userId}`); // Log des films récupérés

      // Créer un dictionnaire pour un accès rapide aux titres des films
      const filmTitles = films.reduce((acc, film) => {
        acc[film.id] = film.title;
        return acc;
      }, {});

      // Ajouter les titres des films à la liste de lecture
      const listeAvecTitres = {
        a_voir: user.listeLecture.a_voir.map(id => ({ id, titre: filmTitles[id] || 'Titre inconnu' })),
        vue: user.listeLecture.vue.map(id => ({ id, titre: filmTitles[id] || 'Titre inconnu' })),
        en_cours: user.listeLecture.en_cours.map(id => ({ id, titre: filmTitles[id] || 'Titre inconnu' }))
      };

      console.log(`Liste de lecture construite pour userId: ${userId}`); // Log de la construction de la liste

      // Retourner la liste de lecture avec les titres
      res.status(200).json(listeAvecTitres);
      console.log(`Liste de lecture envoyée pour userId: ${userId}`); // Log de la réponse envoyée
    } else {
      console.warn(`User not found for userId: ${userId}`); // Log d'utilisateur non trouvé
      res.status(404).json('Utilisateur non trouvé.');
    }
  } catch (err) {
    console.error(`Error in afficherListeLecture for userId: ${userId}: ${err.message}`); // Log de l'erreur
    res.status(500).send('Server error');
  }
}


export const modifierListeLecture = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  console.log(`Start modifierListeLecture for userId: ${userId}`); // Log du début

  const listeArrivee = req.body.listeArrivee;
  const movieId = req.body.movieId;

  try {
    const user = await USER.findOne({ id: userId }).exec();
    if (user) {
      console.log(`User found for userId: ${userId}`); // Log de l'utilisateur trouvé

      // Vérifier que la liste d'arrivée est valide
      if (!['a_voir', 'vue', 'en_cours'].includes(listeArrivee)) {
        console.warn(`Invalid destination list: ${listeArrivee} for userId: ${userId}`); // Log de liste d'arrivée invalide
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
        console.warn(`Movie not found in any list for movieId: ${movieId}, userId: ${userId}`); // Log de film non trouvé
        return res.status(404).json({ message: 'Film non trouvé dans les listes' });
      }

      // Mettre à jour les listes
      user.listeLecture[listeDepart] = user.listeLecture[listeDepart].filter(id => id !== movieId);
      user.listeLecture[listeArrivee] = [...user.listeLecture[listeArrivee], movieId];
      console.log(`Movie moved from ${listeDepart} to ${listeArrivee} for movieId: ${movieId}, userId: ${userId}`); // Log du déplacement du film

      // Sauvegarder les modifications
      await user.save();
      console.log(`User list updated for userId: ${userId}`); // Log de sauvegarde réussie

      // Retourner la réponse de succès
      res.status(200).json({ message: 'Film déplacé avec succès', listeLecture: user.listeLecture });
    } else {
      console.warn(`User not found for userId: ${userId}`); // Log d'utilisateur non trouvé
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  } catch (error) {
    console.error(`Error in modifierListeLecture for userId: ${userId}: ${error.message}`); // Log de l'erreur
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour de l'utilisateur", error });
  }
}


//favoris
export const addFavorite = async (req, res) => {
  console.log('Start addFavorite:', req.method, req.originalUrl); // Log du début

  try {
    const { userId, movieId } = req.body;
    console.log(`Request to add favorite with userId: ${userId}, movieId: ${movieId}`); // Log des IDs reçus

    if (isNaN(userId) || isNaN(movieId)) {
      console.warn('Invalid userId or movieId:', userId, movieId); // Log des IDs invalides
      return res.status(400).json('ID utilisateur ou ID film invalide.');
    }

    const movie = await MOVIE.findOne({ id: movieId });
    if (!movie) {
      console.warn(`Movie not found for movieId: ${movieId}`); // Log de film non trouvé
      return res.status(404).json('Film non trouvé.');
    }

    const user = await USER.findOne({ id: userId });
    if (!user) {
      console.warn(`User not found for userId: ${userId}`); // Log d'utilisateur non trouvé
      return res.status(404).json('Utilisateur non trouvé.');
    }

    if (user.favoris.includes(movieId)) {
      console.warn(`Movie already in favorites for userId: ${userId}, movieId: ${movieId}`); // Log de film déjà en favoris
      return res.status(400).json('Le film est déjà dans la liste des favoris.');
    }

    user.favoris.push(movieId);
    await user.save();
    console.log(`Movie added to favorites for userId: ${userId}, movieId: ${movieId}`); // Log de film ajouté avec succès

    res.status(200).json('Film ajouté aux favoris avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'ajout du film aux favoris:', error); // Log de l'erreur
    res.status(500).json('Erreur lors de l\'ajout du film aux favoris.');
  }
};


////////////////////

// Suppression d'un film des favoris
export const delFavorite = async (req, res) => {
  console.log('Received request:', req.method, req.originalUrl);  // Log de la méthode et de l'URL

  try {
    // Récupération des IDs depuis le corps de la requête
    const { userId, movieId } = req.body;
    console.log('Request body:', req.body);

    // Vérification de la validité des IDs
    if (isNaN(userId) || isNaN(movieId)) {
      console.warn('ID utilisateur ou ID film invalide:', userId, movieId);
      return res.status(400).json('ID utilisateur ou ID film invalide.');
    }

    // Vérification si le film existe
    const movie = await MOVIE.findOne({ id: movieId });
    console.log('Movie found:', movie);

    if (!movie) {
      console.warn('Film non trouvé pour ID:', movieId);
      return res.status(404).json('Film non trouvé.');
    }

    // Vérification si l'utilisateur existe
    const user = await USER.findOne({ id: userId });
    console.log('User found:', user);

    if (!user) {
      console.warn('Utilisateur non trouvé pour ID:', userId);
      return res.status(404).json('Utilisateur non trouvé.');
    }

    // Vérification si le film est dans la liste des favoris de l'utilisateur
    if (!user.favoris.includes(movieId)) {
      console.warn('Le film n\'est pas dans la liste des favoris:', movieId);
      return res.status(400).json('Le film n\'est pas dans la liste des favoris.');
    }

    // Suppression du film de la liste des favoris de l'utilisateur
    user.favoris = user.favoris.filter(favId => favId !== movieId);
    await user.save();
    console.log('Film supprimé des favoris:', movieId);

    res.status(200).json('Film supprimé des favoris avec succès.');
  } catch (error) {
    console.error('Erreur lors de la suppression du film des favoris :', error);
    res.status(500).json('Erreur lors de la suppression du film des favoris.');
  }
};

// Affichage des films favoris
export const affFavoris = async (req, res) => {
  console.log('Received request:', req.method, req.originalUrl);  // Log de la méthode et de l'URL

  try {
    // Récupération de l'ID utilisateur depuis les paramètres de la requête
    const userId = parseInt(req.params.id, 10);
    console.log('User ID from params:', userId);

    // Vérification de la validité de l'ID utilisateur
    if (isNaN(userId)) {
      console.warn('ID utilisateur invalide:', userId);
      return res.status(400).json('ID utilisateur invalide.');
    }

    // Recherche de l'utilisateur dans la base de données
    const user = await USER.findOne({ id: userId });
    console.log('User found:', user);

    if (!user) {
      console.warn('Utilisateur non trouvé pour ID:', userId);
      return res.status(404).json('Utilisateur non trouvé.');
    }

    // Récupération des IDs des films dans les favoris de l'utilisateur
    const movieIds = user.favoris;
    console.log('Favoris movie IDs:', movieIds);

    if (movieIds.length === 0) {
      console.log('Aucun film dans la liste des favoris.');
      return res.status(200).json('Aucun film dans la liste des favoris.');
    }

    // Récupération des détails des films
    const movies = await MOVIE.find({ id: { $in: movieIds } });
    console.log('Movies found:', movies);

    // Extraction des titres des films
    const movieTitles = movies.map(movie => movie.title);
    console.log('Movie titles:', movieTitles);

    // Retourner les titres des films
    res.status(200).json({ favoris: movieTitles });
  } catch (error) {
    console.error('Erreur lors de l\'affichage des favoris :', error);
    res.status(500).json('Erreur lors de l\'affichage des favoris.');
  }
};

// Ajout d'un film à l'historique
export const addHistorique = async (req, res) => {
  console.log('Received request:', req.method, req.originalUrl);  // Log de la méthode et de l'URL

  try {
    // Récupération des IDs depuis le corps de la requête
    const { userId, movieId } = req.body;
    console.log('Request body:', req.body);

    // Vérification de la validité des IDs
    if (isNaN(userId) || isNaN(movieId)) {
      console.warn('ID utilisateur ou ID film invalide:', userId, movieId);
      return res.status(400).json('ID utilisateur ou ID film invalide.');
    }

    // Vérification si le film existe avec findOne
    const movie = await MOVIE.findOne({ id: movieId });  // Utilisez `id` si c'est le champ unique
    console.log('Movie found:', movie);

    if (!movie) {
      console.warn('Film non trouvé pour ID:', movieId);
      return res.status(404).json('Film non trouvé.');
    }

    // Vérification si l'utilisateur existe
    const user = await USER.findOne({ id: userId });  // Utilisez `id` si c'est le champ unique
    console.log('User found:', user);

    if (!user) {
      console.warn('Utilisateur non trouvé pour ID:', userId);
      return res.status(404).json('Utilisateur non trouvé.');
    }

    // Vérification si le film est déjà dans l'historique
    if (user.historique.includes(movieId)) {
      console.warn('Le film est déjà dans l\'historique:', movieId);
      return res.status(400).json('Le film est déjà dans l\'historique.');
    }

    // Ajout du film à l'historique de l'utilisateur
    user.historique.push(movieId);
    await user.save();
    console.log('Film ajouté à l\'historique:', movieId);

    res.status(200).json('Film ajouté à l\'historique avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'ajout du film à l\'historique :', error);
    res.status(500).json('Erreur lors de l\'ajout du film à l\'historique.');
  }
};

// Affichage de l'historique des films
export const affHistorique = async (req, res) => {
  console.log('Received request:', req.method, req.originalUrl);  // Log de la méthode et de l'URL

  try {
    // Récupération de l'ID utilisateur depuis les paramètres de la requête
    const userId = parseInt(req.params.id, 10);
    console.log('User ID from params:', userId);

    // Vérification de la validité de l'ID utilisateur
    if (isNaN(userId)) {
      console.warn('ID utilisateur invalide:', userId);
      return res.status(400).json('ID utilisateur invalide.');
    }

    // Recherche de l'utilisateur dans la base de données
    const user = await USER.findOne({ id: userId });
    console.log('User found:', user);

    if (!user) {
      console.warn('Utilisateur non trouvé pour ID:', userId);
      return res.status(404).json('Utilisateur non trouvé.');
    }

    // Récupération des IDs des films dans l'historique de l'utilisateur
    const movieIds = user.historique;
    console.log('Historique movie IDs:', movieIds);

    if (movieIds.length === 0) {
      console.log('Aucun film dans l\'historique.');
      return res.status(200).json('Aucun film dans l\'historique.');
    }

    // Récupération des détails des films
    const movies = await MOVIE.find({ id: { $in: movieIds } });
    console.log('Movies found:', movies);

    // Extraction des titres des films
    const movieTitles = movies.map(movie => movie.title);
    console.log('Movie titles:', movieTitles);

    // Retourner les titres des films
    res.status(200).json({ historique: movieTitles });
  } catch (error) {
    console.error('Erreur lors de l\'affichage de l\'historique :', error);
    res.status(500).json('Erreur lors de l\'affichage de l\'historique.');
  }
};

// Contrôleur de l'utilisateur
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
