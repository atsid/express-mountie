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
        appHome = mountConfig.src,
        prefix = mountConfig.prefix;

    if (!parent) {
        throw new Error("mountConfig.parent must contain an express app");
    }
    if (!appHome) {
        throw new Error('mountConfig.appHome must be defined');
    }

    function appPath(appName) {
        return path.join(appHome, appName);
    }

    function mountPoint(appName) {
        return (typeof prefix === "function") ? prefix(appName) : prefix;
    }

    function mountApp(file, app) {
        let mp = mountPoint(file);
        //jscs:disable
        debug(`mounting app '${file}' at ${mp || '/'}`);
        //jscs:enable
        (mp ? parent.use(mp, app) : parent.use(app));
        return app;
    }

    function scanDir(dir) {
        debug("scanning for apps in " + dir);
        let result = fs.readdirSync(dir);
        debug('discovered ', result);
        return result;
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

    let files = scanDir(appHome);
    return startApps(files);
};
