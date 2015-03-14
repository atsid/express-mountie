'use strict';

var chai = require('chai'),
    expect = chai.expect,
    express = require('express'),
    path = require('path'),
    mountie = require('../src/mountie');

describe('Application Discovery', () => {
    it('finds one app in test apps folder', () => {
        let apps = mountie({
            src: path.join(__dirname, 'data/test-apps'),
            parent: express()
        });
        expect(apps.length).to.equal(2);
    });

    it('instantiates an express app ready to mount', () => {
        let app = express();
        let apps = mountie({
            src: path.join(__dirname, 'data/test-apps'),
            parent: app
        });
        let subapp = apps[0];
        expect(subapp.mountpath).to.equal('/');
    });

    it('fails if invalid apps folder is provided', () => {
        expect(() => mountie({
            src: 'fake-folder-xyz',
            parent: express()
        })).to.throw();
    });

    it('fails if no express app is provided', () => {
        let config = { src: path.join(__dirname, 'data/test-apps') };
        expect(() => mountie(config)).to.throw();
    });

    it('can select the mount path using a prefix string', () => {
        let app = express();
        let apps = mountie({
            src: path.join(__dirname, 'data/test-apps'),
            parent: app,
            prefix: "/api"
        });
        let subapp = apps[0];
        expect(subapp.mountpath).to.equal('/api');
    });

    it ('can select the mount path using a prefix function', () => {
        let app = express();
        let apps = mountie({
            src: path.join(__dirname, 'data/test-apps'),
            parent: app,
            prefix: appName => "/api/" + appName
        });
        expect(apps[0].mountpath).to.equal('/api/test1');
        expect(apps[1].mountpath).to.equal('/api/test2');
    });

    it ('can select applications in a deep path', () => {
        let app = express();
        let apps = mountie({
            src: path.join(__dirname, 'data/test-deep-path/test-apps'),
            parent: app,
            prefix: appName => "/api/" + appName
        });
        expect(apps[0].mountpath).to.equal('/api/test1');
        expect(apps[1].mountpath).to.equal('/api/test2');
    });

    it ('can mount nested applications', () => {
        let app = express();
        let apps = mountie({
            src: path.join(__dirname, 'data/nested-apps'),
            parent: app,
            prefix: appName => "/api/" + appName
        });
        expect(apps[0].mountpath).to.equal('/api/auth');
        expect(apps[1].mountpath).to.equal('/api/test1');
        expect(apps[2].mountpath).to.equal('/api/test2');
    });
});
