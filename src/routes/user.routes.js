'use strict'

const userController = require('../controllers/user.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');
const { default: mongoose } = require('mongoose');

api.get('/test', mdAuth.ensureAuth, mdAuth.isAdmin, userController.test);
api.post('/register', userController.register);
api.post('/login', userController.login);
api.put('/updated/:id', mdAuth.ensureAuth, userController.update);
api.delete('/delete/:id', mdAuth.ensureAuth, userController.deleted);

module.exports = api;