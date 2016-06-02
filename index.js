'use strict';

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
			}
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

	_compileCss(filename, data) {
		return new Promise((resolved, rejected) => {
			var css = (new CleanCSS(this.options.css)).minify(data).styles;
			resolved({
				data: css,
				files: [filename]
			});
		});
	}

	_compileJs(filename, data) {
		return new Promise((resolved, rejected) => {
			var js = UglifyJS.minify(data, merge(this.options.js, { fromString: true })).code;
			resolved({
				data: js,
				files: [filename]
			});
		});
	}

	_compileHtml(filename, data) {
		return new Promise((resolved, rejected) => {
			var html = htmlMinify(data, this.options.html);
			resolved({
				data: html,
				files: [filename]
			});
		});
	}

	compile(filename, data) {
		var compilers = {
			'.css': this._compileCss,
			'.js': this._compileJs,
			'.html': this._compileHtml,
			'.htm': this._compileHtml
		};
		return compilers[path.extname(filename).toLowerCase()].call(this, filename, data);
	}

}

exports = module.exports = MinifyTranform;
