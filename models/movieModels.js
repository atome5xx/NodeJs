
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const movieSchema = new Schema({
    id: Number,
    title: String,
    year: Number,
    rating: Number,
    actors: [String]
}, { collection: 'Movies' });

const MOVIE = mongoose.model('Movies', movieSchema);

export default MOVIE;
