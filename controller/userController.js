import USER from "../models/userModels.js";
import MOVIE from "../models/movieModels.js";
//const bcrypt = require('bcryptjs');


export const getAll = async (req, res) => {
  try {
    const users = await USER.find({}, { _id: 0 }).exec();
    res.json(users);
  } catch (error) {
    res.status(500).json('Erreur lors de la récupération des utilisateurs.');
  }
}

// affiche les données d'un user
export const getProfile = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    const user = await USER.findOne({ id: userId }, { _id: 0 }).exec();
    if (user) {
      res.json(user);
    } else {
      res.status(404).json('Utilisateur non trouvé.');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// update le profil d'un user
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
      }
    } else {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur : ', error);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour de l\'utilisateur", error });
  }
}

//supprimé un utilisateur
export const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    const result = await USER.deleteOne({ id: userId }).exec();
    // Vérifier si des films ont été supprimés
    if (result.deletedCount === 0) {
      return res.status(404).json('Aucun utilisateur trouvé.');
    }

    // Répondre avec succès
    res.status(200).json('Utilisateur supprimés avec succès.');
  } catch (error) {
    res.status(500).json('Erreur lors de la supression de l\'utilisateur.');
  }
}

export const creerListeLecture = async (req, res) => {
  const userId = req.body.id;
  try {
    const user = await USER.findOne({ id: userId }).exec();
    if (user) {
      user.listeLecture = user.listeLecture || { a_voir: [], vue: [], en_cours: [] };

      // Save the updated user document
      await user.save();
      res.status(200).json('Liste créer');
    } else {
      res.status(404).json('Utilisateur non trouvé.');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

export const ajouterFilmListeLecture = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const movieId = req.body.movieId;
  // type 1 = à voire, 2 = vue, 3 = en cours
  const typeListe = req.body.type;

  try {
    const user = await USER.findOne({ id: userId }).exec();
    if (user) {
      user.listeLecture = user.listeLecture || { a_voir: [], vue: [], en_cours: [] };

      if (typeListe == 1) {
        if (!user.listeLecture.a_voir.includes(movieId)) {
          user.listeLecture.a_voir.push(movieId);
          res.status(200).json('Film ajouté!');
          await user.save();
        }
        else {
          res.status(201).json('Film déjà présent');
        }
      } else if (typeListe == 2) {
        if (!user.listeLecture.vue.includes(movieId)) {
          user.listeLecture.vue.push(movieId);
          res.status(200).json('Film ajouté!');
          await user.save();
        }
        else {
          res.status(201).json('Film déjà présent');
        }
      } else if (typeListe == 3) {
        if (!user.listeLecture.en_cours.includes(movieId)) {
          user.listeLecture.en_cours.push(movieId);
          res.status(200).json('Film ajouté!');
          await user.save();
        }
        else {
          res.status(201).json('Film déjà présent');
        }
      } else {
        res.status(405).json('Mauvaise requete');
      }
    } else {
      res.status(404).json('Utilisateur non trouvé.');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

export const afficherListeLecture = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    const user = await USER.findOne({ id: userId }).exec();
    if (user) {
      // Récupérer les titres des films pour chaque liste
      const films = await MOVIE.find({ id: { $in: [...user.listeLecture.a_voir, ...user.listeLecture.vue, ...user.listeLecture.en_cours] } }).exec();

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

      // Retourner la liste de lecture avec les titres
      res.status(200).json(listeAvecTitres);
    } else {
      res.status(404).json('Utilisateur non trouvé.');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}

export const modifierListeLecture = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  //ou j'arrive
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
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur : ', error);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour de l\'utilisateur", error });
  }
}

const userController = {
  getAll,
  getProfile,
  updateUser,
  deleteUser,
  creerListeLecture,
  ajouterFilmListeLecture,
  afficherListeLecture,
  modifierListeLecture
};

export default userController;