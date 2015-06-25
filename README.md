smart-static-minify
===================

[![Build Status](https://travis-ci.org/trenskow/smart-static-minify.svg?branch=master)](https://travis-ci.org/trenskow/smart-static-minify)

Minifier engine for [smart-static](http://github.com/trenskow/smart-static.js).

# Usage

Using the minifier smart-static engine plug-in is pretty easy.

	var http = require('http');
	
	var smartStatic = require('smart-static');
    var minify = require('smart-static-minify');
    
    var server = http.createServer(smartStatic(__dirname + '/public', {
        engines: [
        	minify()
        ]
    }));
    
    server.listen(8000);

Now `.css`, `.js` and `.html` files are served as their minified counterpart (`.min.css`, `.min.js` and `.min.html`).

> Example: File `/public/css/my.css` will be served as `/public/css/my.min.css`.
