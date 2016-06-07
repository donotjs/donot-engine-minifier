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

		this.options.css = merge(this.options.css || {},  {
			sourceMap: true
		});

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

	_compileCss(filename, data) {
		var result = (new CleanCSS(this.options.css)).minify(data);
		return {
			data: result.styles,
			map: JSON.parse(result.sourceMap.toString()),
			files: [filename]
		};
	}

	_compileJs(filename, data) {
		var result = UglifyJS.minify(data, merge(this.options.js, { outSourceMap: path.basename(filename) }));
		var map = JSON.parse(result.map);
		return {
			data: result.code.replace(/\n\/\/# sourceMappingURL=.*?$/, ''),
			map: map,
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

	compile(filename, data) {
		return new Promise((resolved, rejected) => {
			var compilers = {
				'.css': this._compileCss,
				'.js': this._compileJs,
				'.html': this._compileHtml,
				'.htm': this._compileHtml
			};
			var result = compilers[path.extname(filename).toLowerCase()].call(this, filename, data.toString());
			result.data = new Buffer(result.data);
			resolved(result);
		});
	}

}

exports = module.exports = MinifyTranform;
