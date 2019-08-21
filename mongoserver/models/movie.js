var mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    MOVIE_ID: String,
    TITLE: String,
    RATING: Number,
    TOTAL_VOTES: Number,
    GENRE1: String,
    GENRE2: String,
    GENRE3 : String,
    META_CRITIC : Number,
    BUDGET : String,
    RUNTIME : String
});

module.exports = mongoose.model('Movie',movieSchema);