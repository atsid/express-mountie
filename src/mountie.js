"use strict";

/**
 * Provides functionality to load and start sub-apps.
 *
 */
var fs = require("fs");
var path = require("path");
var debug = require("debug")("mountie");

module.exports = (mountConfig) => {
    let parent = mountConfig.parent,
        appHome = mountConfig.src,
        prefix = mountConfig.prefix;

    if (!parent) {
        throw new Error("mountConfig.parent must contain an express app");
    }
    if (!appHome) {
        throw new Error("mountConfig.appHome must be defined");
    }

    function appPath(appName) {
        return path.join(appHome, appName);
    }

    function mountPoint(appName) {
        return (typeof prefix === "function") ? prefix(appName) : prefix;
    }

    function mountApp(file, app) {
        let mp = mountPoint(file);
        debug(`mounting app "${file}" at ${mp || "/"}`);
        if (mp) {
            parent.use(mp, app);
        } else {
            parent.use(app);
        }
        return app;
    }

    function scanDir(dir) {
        debug("scanning for apps in " + dir);
        let stripExtension = (file) => path.basename(file, path.extname(file));
        let result = fs.readdirSync(dir).map(stripExtension);
        debug("discovered ", result);
        return result;
    }

    function loadApp(file) {
        debug(`loading app "${file}"`);
        return require(appPath(file));
    }

    function startApps(files) {
        function loadAndMount(file) {
            let app = loadApp(file);
            return mountApp(file, app);
        }
        return files.map(loadAndMount);
    }

    let found = scanDir(appHome);
    return startApps(found);
};
