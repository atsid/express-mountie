'use strict';
var subapp = require('express')(),
    debug = require('debug')('mountie:test');

subapp.post('/login', (req, res, next) => res.send("login response"));
subapp.on('mount', (parent) => {
    debug("Mounted local auth provider at " + subapp.mountpath);
});
module.exports = subapp;
