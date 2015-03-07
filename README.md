[![Build Status](https://travis-ci.org/atsid/express-mountie.svg?branch=master)](https://travis-ci.org/atsid/express-mountie)
[![Dependency Status](https://david-dm.org/atsid/express-mountie.svg)](https://david-dm.org/atsid/express-mountie)

# express-marco
Express Service Discovery

```js
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

## Installation

```bash
$ npm install express-mountie --save
```
