'use strict';
var subapp = require('express')(),
    debug = require('debug')('mountie:test');

subapp.get('/test-path', (req, res, next) => res.send("collection"));
subapp.get('/test-path/:id', (req, res, next) => res.send("item"));

subapp.on('mount', (parent) => {
    debug("Mounted subapp at " + subapp.mountpath);
});
module.exports = subapp;
