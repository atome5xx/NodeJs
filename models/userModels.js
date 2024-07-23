import mongoose from '../config/database.js';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
<<<<<<< Updated upstream
  id: { type: Number, required: true },
=======
>>>>>>> Stashed changes
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  favoris: [Number],
<<<<<<< Updated upstream
  listeLecture: {
    a_voir: [Number],  // Array of numbers for "to see"
    vue: [Number],     // Array of numbers for "seen"
    en_cours: [Number] // Array of numbers for "in progress"
  },
}, { collection: 'Users' });

/*UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});*/

const USER = mongoose.model('Users', UserSchema);

export default USER;
=======
}, { collection: 'Users' });

const USER = mongoose.model('Users', UserSchema);

export default USER;
>>>>>>> Stashed changes
