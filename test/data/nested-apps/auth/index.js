'use strict';
var subapp = require('express')(),
    debug = require('debug')('mountie:test'),
    path = require('path'),
    mountie = require('../../../../src/mountie');

/**
 * Mount the auth providers into this auth app
 */
mountie({
    src: path.join(__dirname, 'providers'),
    parent: subapp,
    prefix: appName => "/provider/" + appName
});
subapp.on('mount', (parent) => {
    debug("Mounted auth app at " + subapp.mountpath);
});
module.exports = subapp;
