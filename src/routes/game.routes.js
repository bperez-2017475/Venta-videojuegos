'use strit'

const gameController = require('../controllers/game.controller');
const express = require('express');
const mdAuth = require('../services/authenticated');
const api = express.Router();

api.get('/testgame', gameController.testgame);
api.post('/saveGame', [mdAuth.ensureAuth, mdAuth.isAdmin], gameController.saveGame);
api.get('/getGames', mdAuth.ensureAuth, gameController.getGames);
api.get('/getGame/:id', mdAuth.ensureAuth, gameController.getGame);
api.post('/searchGame', mdAuth.ensureAuth, gameController.searchGame);
api.put('/updateGame/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], gameController.updateGame);
api.delete('/deletedGame/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], gameController.deletedGame);

module.exports = api;