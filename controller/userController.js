import USER from "../models/userModels.js";
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
  console.log(userId);
  try {
    const user = await USER.findOne({ id: userId }, { _id: 0 }).exec();
    console.log('User:', user);
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

const userController = {
  getAll,
  getProfile,
  updateUser
};

export default userController;