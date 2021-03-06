[![Build Status](https://travis-ci.org/atsid/express-mountie.svg?branch=master)](https://travis-ci.org/atsid/express-mountie)
[![Test Coverage](https://codeclimate.com/github/atsid/express-mountie/badges/coverage.svg)](https://codeclimate.com/github/atsid/express-mountie)
[![Dependency Status](https://david-dm.org/atsid/express-mountie.svg)](https://david-dm.org/atsid/express-mountie)
[![Dev Dependency Status](https://david-dm.org/atsid/express-mountie/dev-status.svg)](https://david-dm.org/atsid/express-mountie)
[![Code Climate](https://codeclimate.com/github/atsid/express-mountie/badges/gpa.svg)](https://codeclimate.com/github/atsid/express-mountie)

[![NPM](https://nodei.co/npm/express-mountie.png)](https://nodei.co/npm/express-mountie/)

# express-mountie
Express Service Auto-Discovery and Mounting

express-mountie is a microlibrary for discovering express routers and apps and then mounting them into a master express app. This is useful for organization and strict segregation of RESTful resources. Organizing services in this way will allow you to break apart and independently scale your webapps when it becomes appropriate.

```
project
│   README.md
│   Gulpfile.js
└───server
    ├───apps
    |   └───subresourceA
    |   |   └───index.js (exports express app)
    |   └───subresourceB
    |       └───index.js (exports express router)
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
});
app.listen(3000);
```

## Installation

```bash
$ npm install express-mountie --save
```
