donot-transform-minify
=====================

[![Build Status](https://travis-ci.org/donotjs/donot-transform-minify.svg?branch=master)](https://travis-ci.org/donotjs/donot-transform-minify)

Minifier transform for [donot](http://github.com/donotjs/donot).

# Usage

Using the minifier donot transform plug-in is pretty easy.

	var http = require('http'),
	    donot = require('donot'),
	    MinifyTransform = require('donot-transform-minify');

    var server = http.createServer(donot(__dirname + '/public', {
        transforms: [ new MinifyTransform() ]
    }));

    server.listen(8000);

Now `.css`, `.js` and `.html` files are served as their minified counterpart (`.min.css`, `.min.js` and `.min.html`).

> Example: File `/public/css/my.css` will be served as `/public/css/my.min.css`.
