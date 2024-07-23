import mongoose from '../config/database.js';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: { type: Number, required: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  favoris: [Number],
  listeLecture: {
    a_voir: [Number],  // Array of numbers for "to see"
    vue: [Number],     // Array of numbers for "seen"
    en_cours: [Number] // Array of numbers for "in progress"
  },
}, { collection: 'Users' });

const USER = mongoose.model('Users', UserSchema);

export default USER;
