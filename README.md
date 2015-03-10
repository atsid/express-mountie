[![Build Status](https://travis-ci.org/atsid/express-mountie.svg?branch=master)](https://travis-ci.org/atsid/express-mountie)
[![Dependency Status](https://david-dm.org/atsid/express-mountie.svg)](https://david-dm.org/atsid/express-mountie)

[![NPM](https://nodei.co/npm/express-mountie.png)](https://nodei.co/npm/express-mountie/)

# express-mountie
Express Service Auto-Discovery and Mounting

express-mountie is a microlibrary for discovering express apps and mounting them into a master express app. This is useful for organization and strict segregation of RESTful resources. Organizing services in this way will allow you to break apart and independently scale your webapps when it becomes appropriate.

```
project
│   README.md
│   Gulpfile.js
└───server
    ├───apps
    |   └───subresourceA
    |   |   └───index.js (exports express app)
    |   └───subresourceB
    |       └───index.js (exports express app)
    │   main.js
```

```js
// main.js
var express = require('express'),
    mountie = require('express-mountie'),
    path = require('path'),
    app = express();
    
mountie({
    parent: app,
    src: path.join(__dirname, './apps'),
    prefix: '/api'
}).then(() => {
    app.listen(3000);
});
```

## Installation

```bash
$ npm install express-mountie --save
```

## Dependencies
express-mountie requires runtime Promise support. This can be provided by:
* Adding an npm dependency to `bluebird`
* Using nodejs with the --harmony flag to enable promises
* Including a promise-providing polyfill such as babeljs.io or https://github.com/jakearchibald/es6-promise
