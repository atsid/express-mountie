'use strict';

var chai = require('chai'),
    expect = require('chai').expect,
    express = require('express'),
    path = require('path'),
    mountie = require('../lib/mountie');

describe('Application Discovery', () => {
    it('finds one app in test apps folder', () => {
        return mountie({
            src: path.join(__dirname, '../test/data/test-apps'),
            parent: express()
        }).then((apps) => {
            expect(apps.length).to.equal(2);
        });
    });

    it('instantiates an express app ready to mount', (done) => {
        let app = express();
        mountie({
            src: path.join(__dirname, '../test/data/test-apps'),
            parent: app
        }).then((apps) => {
            let subapp = apps[0];
            expect(subapp.mountpath).to.equal('/');
            done();
        }).catch(done);
    });

    it('fails if invalid apps folder is provided', (done) => {
        mountie({
            src: 'fake-folder-xyz',
            parent: express()
        }).then(() => {
            chai.assert.fail();
            done();
        }).catch((err) => {
            expect(err.code).to.equal('ENOENT');
            done();
        });
    });

    it('fails if no express app is provided', () => {
        let config = { src: path.join(__dirname, '../test/data/test-apps') };
        expect(() => mountie(config)).to.throw();
    });

    it('can select the mount path using a prefix string', () => {
        let app = express();
        return mountie({
            src: path.join(__dirname, '../test/data/test-apps'),
            parent: app,
            prefix: "/api"
        }).then((apps) => {
            let subapp = apps[0];
            expect(subapp.mountpath).to.equal('/api');
        });
    });

    it ('can select the mount path using a prefix function', () => {
        let app = express();
        return mountie({
            src: path.join(__dirname, '../test/data/test-apps'),
            parent: app,
            prefix: appName => "/api/" + appName
        }).then((apps) => {
            expect(apps[0].mountpath).to.equal('/api/test1');
            expect(apps[1].mountpath).to.equal('/api/test2');
        });
    });
});
