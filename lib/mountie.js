"use strict";

/**
 * Provides functionality to load and start sub-apps.
 *
 */
var fs = require("fs"),
    path = require("path"),
    debug = require("debug")("mountie");

module.exports = {
    /**
     * Finds subapp folders and boots them as express apps.
     * Returns them in an array to be used by the master app.
     *
     * This is accomplished by finding and loading the default module (index.js) from each subfolder, which should contain
     * route config. The wire util is used to create Express apps from these configs.
     *
     * @param root - root folder to read subapp folders from.
     * @returns {Promise} - arg is a list of express apps ready for mounting.
     */
    find: function find(root) {
        var _this = this;

        debug("discovering apps in " + root);
        var startApps = function (files) {
            debug("discovered: " + files);
            var routes = files.map(function (file) {
                return require(path.join(root, file));
            });
            return routes.map(function (route) {
                return _this.startApp(route);
            });
        };
        var scanDir = function (dir) {
            return new Promise(function (resolve, reject) {
                fs.readdir(dir, function (err, result) {
                    return err ? reject(err) : resolve(result);
                });
            });
        };
        return scanDir(root).then(function (files) {
            return startApps(files);
        });
    },

    /**
     * Performs discovery for sub-apps and then mounts them into the given parent app.
     * @param root
     * @param app
     * @param mountPoint
     */
    findAndMount: function findAndMount(root, parent, mountPoint) {
        var _this = this;

        return this.find(root).then(function (apps) {
            return apps.map(function (app) {
                return _this.mount(parent, app, mountPoint);
            });
        });
    },

    /**
     * Mounts a sub-app into a parent app
     * @param parent The parent app
     * @param app The child app to mount
     * @param mountPoint The path at which to mount the sub-app
     */
    mount: function mount(parent, app, mountPoint) {
        if (mountPoint) {
            parent.use(mountPoint, app);
        } else {
            parent.use(app);
        }
    },

    /**
     * Simple wiring function to create Express app instances given a route config.
     * Config looks like:
     * {
         *   <business method name>: {
         *      method: <method>,
         *      path: <path>,
         *      middleware: <array of middleware>
         *   }
         * }
     */
    startApp: function startApp(routeConfig) {
        var app = require("express")();
        Object.keys(routeConfig).forEach(function (name) {
            var route = routeConfig[name];
            app[route.method.toLowerCase()](route.path, route.middleware);
        });
        return app;
    }
};