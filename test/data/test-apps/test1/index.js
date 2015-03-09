'use strict';
var subapp = require('express')();
subapp.get('/test-path', (req, res, next) => res.send("collection"));
subapp.get('/test-path/:id', (req, res, next) => res.send("item"));
module.exports = subapp;
