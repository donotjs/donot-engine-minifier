donot-engine-minifier
=====================

[![Build Status](https://travis-ci.org/donotjs/donot-engine-minifier.svg?branch=master)](https://travis-ci.org/donotjs/donot-engine-minifier)

Minifier engine for [donot](http://github.com/donotjs/donot).

# Usage

Using the minifier donot engine plug-in is pretty easy.

	var http = require('http'),
	    donot = require('donot'),
	    minifier = require('donot-engine-minifier');
    
    var server = http.createServer(donot(__dirname + '/public', {
        engines: [
        	minifier()
        ]
    }));
    
    server.listen(8000);

Now `.css`, `.js` and `.html` files are served as their minified counterpart (`.min.css`, `.min.js` and `.min.html`).

> Example: File `/public/css/my.css` will be served as `/public/css/my.min.css`.
