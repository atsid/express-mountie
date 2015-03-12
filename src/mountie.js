'use strict';

/**
 * Provides functionality to load and start sub-apps.
 *
 */
var fs = require('fs'),
    path = require('path'),
    debug = require('debug')('mountie'),
    MountiePromise = Promise || require('bluebird');

module.exports = (mountConfig) => {
    let parent = mountConfig.parent,
        appHome = mountConfig.src,
        mountPoint = mountConfig.prefix;

    if (!parent) {
        throw new Error("mountConfig.parent must contain an express app");
    }
    if (!appHome) {
        throw new Error('mountConfig.appHome must be defined');
    }

    function appPath(appName) {
        return path.join(appHome, appName);
    }

    function mountApp(file, app) {
        if (typeof mountPoint === "function") {
            mountPoint = mountPoint(file);
        }
        debug("mounting app '" + file + "' at " + (mountPoint || '/'));
        (mountPoint ? parent.use(mountPoint, app) : parent.use(app));
        return app;
    }

    function scanDir(dir) {
        debug("scanning for apps in ", dir);
        return new MountiePromise((resolve, reject) => {
            fs.readdir(dir, (err, result) => {
                debug('discovered ', result);
                return err ? reject(err) : resolve(result);
            });
        });
    }

    function loadApp(file) {
        debug("loading app '" + file + "'");
        return require(appPath(file));
    }

    function startApps(files) {
        function loadAndMount(file) {
            let app = loadApp(file);
            return mountApp(file, app);
        }
        return files.map(loadAndMount);
    }

    return scanDir(appHome).then(startApps);
};
