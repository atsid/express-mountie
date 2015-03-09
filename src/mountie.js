'use strict';

/**
 * Provides functionality to load and start sub-apps.
 *
 */
var fs = require('fs'),
    path = require('path'),
    debug = require('debug')('mountie');

module.exports = (mountConfig) => {
    let parent = mountConfig.parent,
        appPath = mountConfig.src,
        mountPoint = mountConfig.prefix,
        scanDir = (dir) => {
            debug("scanning for apps in ", dir);
            let MountiePromise = Promise || require('bluebird');
            return new MountiePromise((resolve, reject) => {
                fs.readdir(dir, (err, result) => {
                    debug('discovered ', result);
                    return err ? reject(err) : resolve(result);
                });
            });
        },
        startApp = (file) => {
            debug("starting app ", file);
            return require(path.join(appPath, file));
        },
        startApps = (files) => {
            debug("starting apps in ", files);
            return files.map((file) => startApp(file));
        },
        mountApp = (app) => {
            debug("mounting app");
            (mountPoint ? parent.use(mountPoint, app) : parent.use(app));
            return app;
        },
        mountApps = (apps) => {
            debug("mounting apps");
            return apps.map((app) => mountApp(app));
        };

    if (!parent) {
        throw new Error("mountConfig.parent must contain an express app");
    }
    return scanDir(appPath)
    .then(startApps)
    .then(mountApps);
};
