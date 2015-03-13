'use strict';
var subapp = require('express')(),
    debug = require('debug')('mountie:test');

subapp.get('/do-some-oauth', (req, res, next) => res.send("rsponse"));
subapp.on('mount', (parent) => {
    debug("Mounted oauth provider at " + subapp.mountpath);
});
module.exports = subapp;
