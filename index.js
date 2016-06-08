'use strict';

const fs = require('fs');
const path = require('path');
const merge = require('merge');
const CleanCSS = require('clean-css');
const UglifyJS = require('uglify-js');
const htmlMinify = require('html-minifier').minify;
const Transform = require('@donotjs/donot-transform');

class MinifyTranform extends Transform {

	constructor(options) {
		super();

		this.options = merge(true, options || {});

		this.options.css = this.options.css || {};

		this.options.js = merge(this.options.js || {}, {
			mangle: false,
			compress: {
				sequences: false
			},
			fromString: true
		});

		this.options.html = merge(this.options.html || {}, {
			removeComments: true,
			removeCommentsFromCDATA: true,
			removeCDATASectionsFromCDATA: true,
			collapseWhitespace: true,
			collapseBooleanAttributes: true,
			removeAttributeQuotes: true,
			removeRedundantAttributes: true,
			useShortDoctype: true,
			removeEmptyAttributes: true,
			removeOptionalTags: true,
			removeScriptTypeAttributes: true,
			removeStyleLinkTypeAttributes: true,
		});

	}

	canTransform(filename) {
		return /\.min\.(css|js|htm|html)$/i.test(filename);
	}

	map(filename) {
		return filename.replace(/\.min\.(css|js|htm|html)$/i, '.$1');
	}

	_compileCss(filename, data, map) {
		var result = (new CleanCSS(merge(this.options.css, { sourceMap: map ? JSON.stringify(map) : true }))).minify(data);
		return {
			data: result.styles,
			map: JSON.parse(result.sourceMap.toString()),
			files: [filename]
		};
	}

	_compileJs(filename, data, map) {
		var result = UglifyJS.minify(data, merge(this.options.js, {
			inSourceMap: map,
			outSourceMap: path.basename(filename)
		}));
		return {
			data: result.code,
			map: JSON.parse(result.map),
			files: [filename]
		};
	}

	_compileHtml(filename, data) {
		var html = htmlMinify(data, this.options.html);
		return {
			data: html,
			files: [filename]
		};
	}

	compile(filename, data, map) {
		return new Promise((resolved, rejected) => {
			var compilers = {
				'.css': this._compileCss,
				'.js': this._compileJs,
				'.html': this._compileHtml,
				'.htm': this._compileHtml
			};
			var result = compilers[path.extname(filename).toLowerCase()].call(this, filename, data.toString(), map);
			result.data = new Buffer(result.data);
			resolved(result);
		});
	}

}

exports = module.exports = MinifyTranform;
