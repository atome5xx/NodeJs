const User = require('../models/userModels');
const bcrypt = require('bcryptjs');

// affiche les données d'un user
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
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
    const user = await UserSchema.findOne({ id: userId }, { _id: 0 }).exec();

    if (user) {
      const misesAJour = {};
      if (userFirstName !== undefined) misesAJour.firstName = userFirstName;
      if (userLastName !== undefined) misesAJour.lastName = userLastName;
      if (userEmail !== undefined) misesAJour.email = userEmail;
      if (userPassword !== undefined) misesAJour.password = userPassword;

      const result = await UserSchema.updateOne({ id: userId }, { $set: misesAJour });

      if (result.nModified === 1) {
        res.status(200).json({ message: "Utilisateur mis à jour avec succès", data: result });
      } else {
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
  getProfile,
  updateUser
};

export default userController;