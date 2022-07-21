'use strict'

const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    name: String,
    description: String,
    type: String,
    user: {type: mongoose.Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Juego', gameSchema);