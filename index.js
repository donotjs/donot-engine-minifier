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
		var css = (new CleanCSS(this.options.css)).minify(data).styles;
		return {
			data: css,
			files: [filename]
		};
	}

	_compileJs(filename, data) {
		var js = UglifyJS.minify(data, merge(this.options.js, { fromString: true })).code;
		return {
			data: js,
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

	compile(srcFilename, destFilename) {
		return new Promise((resolved, rejected) => {
			var compilers = {
				'.css': this._compileCss,
				'.js': this._compileJs,
				'.html': this._compileHtml,
				'.htm': this._compileHtml
			};
			fs.readFile(srcFilename, 'utf8', (err, data) => {
				if (err) return rejected(err);
				var result = compilers[path.extname(srcFilename).toLowerCase()].call(this, srcFilename, data);
				fs.writeFile(destFilename, result.data, 'utf8', (err) => {
					if (err) return rejected(err);
					delete result.data;
					resolved(result);
				});
			});
		});
	}

}

exports = module.exports = MinifyTranform;
