'use strict';

/**
 * Provides functionality to load and start sub-apps.
 *
 */
var fs = require('fs'),
    path = require('path'),
    debug = require('debug')('mountie');

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
    find (root) {
        debug('discovering apps in ' + root);
        let startApps = (files) => {
            debug('discovered: ' + files);
            return files.map((file) => require(path.join(root, file)));
        };
        let scanDir = (dir) => {
            return new Promise((resolve, reject) => {
                fs.readdir(dir, (err, result) => (err ? reject(err) : resolve(result)));
            });
        };
        return scanDir(root).then((files) => startApps(files));
    },

    /**
     * Performs discovery for sub-apps and then mounts them into the given parent app.
     * @param root
     * @param app
     * @param mountPoint
     */
    findAndMount (root, parent, mountPoint) {
        return this.find(root).then(apps => apps.map(app => this.mount(parent, app, mountPoint)));
    },

    /**
     * Mounts a sub-app into a parent app
     * @param parent The parent app
     * @param app The child app to mount
     * @param mountPoint The path at which to mount the sub-app
     */
    mount (parent, app, mountPoint) {
        debug("Mounting app");
        if (mountPoint) {
            parent.use(mountPoint, app);
        } else {
            parent.use(app);
        }
    }
};
