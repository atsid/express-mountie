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
            chai.assert.equal(apps.length, 1);
        });
    });

    it('instantiates an express app ready to mount', (done) => {
        let app = express();
        mountie({
            src: path.join(__dirname, '../test/data/test-apps'),
            parent: app
        }).then((apps) => {
            let subapp = apps[0];
            subapp.on('mount', (parent) => {
                chai.assert.equal(subapp.mountpath, '/test-root');
                done();
            });
            done();
        });
    });

    it('fails if invalid apps folder is provided', (done) => {
        mountie({
            src: 'fake-folder-xyz',
            parent: express()
        }).then(() => {
            chai.assert.fail();
            done();
        }).catch((err) => {
            chai.assert.equal(err.code, 'ENOENT');
            done();
        });
    });

    it('fails if no express app is provided', () => {
        let config = { src: path.join(__dirname, '../test/data/test-apps') };
        expect(() => mountie(config)).to.throw();
    });
});
