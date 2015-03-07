[![Build Status](https://travis-ci.org/atsid/express-mountie.svg?branch=master)](https://travis-ci.org/atsid/express-mountie)
[![Dependency Status](https://david-dm.org/atsid/express-mountie.svg)](https://david-dm.org/atsid/express-mountie)

# express-marco
Express Service Auto-Discovery and Mounting

```
project
│   README.md
│   Gulpfile.js
└───server
    ├───apps
    |   └───subresourceA
    |   |   └───index.js
    |   └───subresourceB
    |       └───index.js
    │   main.js
```

```js
// main.js
var express = require('express'),
    mountie = require('express-mountie'),
    path = require('path'),
    app = express();
mountie.findAndMount(path.join(__dirname, 'apps'), app, '/api').then(() => {
    http.createServer(app).listen(app.get('port'), () => {
      console.log('server listening on port ' + app.get('port'));
  });
});
```
```js
// subresource index.js
module.exports = {
    getBeerList: {
        method: 'GET',
        path: '/beers',
        middleware: [
            // Chain of Middleware functions
            beerlist.get
            send.json
        ]
    },
    getBeer: {
        method: 'GET',
        path: '/beers/:id',
        middleware: [
            beerlist.getById
            send.json
        ]
    }
};
```

## Installation

```bash
$ npm install express-mountie --save
```
