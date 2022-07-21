'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const helmet= require('helmet');
const cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

module.exports = app;