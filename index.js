'use strict';

var path = require('path');
var merge = require('merge');
var CleanCSS = require('clean-css');
var UglifyJS = require('uglify-js');
var htmlMinify = require('html-minifier').minify;

exports = module.exports = function(opt) {

  var options = {};

  var compileCss = function(file, data, opt, cb) {
    var css;
    try {
      css = (new CleanCSS(options.css)).minify(data).styles;
    } catch(err) {
      return cb(err);
    }
    cb(null, css, [file]);
  };

  var compileJs = function(file, data, opt, cb) {
    var js;
    try {
      js = UglifyJS.minify(data, merge(options.js, { fromString: true })).code;
    } catch(err) {
      return cb(err);
    }
    cb(null, js, [file]);
  };

  var compileHtml = function(file, data, opt, cb) {
    var html;
    try {
      html = htmlMinify(data, options.html);
    } catch(err) {
      return cb(err);
    }
    cb(null, html, [file]);
  };

  var compilers = {
    '.css': compileCss,
    '.js': compileJs,
    '.html': compileHtml,
    '.htm': compileHtml
  };

  options = merge(opt);

  options.css = options.css || {};

  options.js = options.js || {
    mangle: false,
    compress: {
      sequences: false
    }
  };

  options.html = options.html || {
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
  };

  return {
    map: {
      '.min.css': '.css',
      '.min.js': '.js',
      '.min.html': '.html',
      '.min.htm': '.htm'
    },
    encoding: (opt || {}).encoding || 'utf8',
    compile: function(file, data, opt, cb) {
      return compilers[path.extname(file)](file, data, opt, cb);
    }
  };
};
