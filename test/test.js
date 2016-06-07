/*jshint expr: true*/

'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');

chai.should();
chai.use(chaiAsPromised);

const MinifyTransform = require('../');

var transform = new MinifyTransform();

describe('minify', () => {

	describe('compiler', () => {

		var css = new Buffer('my {\n' +
							'		width: 100%;' +
							'}\n');

		var js = new Buffer('function myFunc() {\n' +
						 '		console.log(\'test\');\n' +
						 '}\n');

		var html = new Buffer('<!DOCTYPE html>\n' +
							 '<html>\n' +
							 '	<head>\n' +
							 '		<title>HTML</title>\n' +
							 '	</head>\n' +
							 '	<body>\n' +
							 '		<h1>My HTML document</h1>\n' +
							 '	</body>\n' +
							 '</html>\n');

		it ('should come back with minified css', () => {
			return transform.compile(__dirname + '/data/test.css', css).then((result) => {
				expect(result.data.toString()).to.equal('my{width:100%}');
				expect(result).to.have.property('map')
				              .to.be.an('object')
				              .to.have.property('mappings')
				              .to.be.a('string');
				expect(result.files).to.an('array')
				                    .to.have.length.of.at.least(1);
				expect(result.files[0]).to.equal(__dirname + '/data/test.css');
			}).should.eventually.be.fulfilled;
		});

		it ('should come back with minified js', () => {
			return transform.compile(__dirname + '/data/test.js', js).then((result) => {
				expect(result.data.toString()).to.equal('function myFunc(){console.log("test")}');
				expect(result).to.have.property('map')
				              .to.be.an('object')
				              .to.have.property('mappings')
				              .to.be.a('string');
				expect(result.files).to.an('array')
				                    .to.have.length.of.at.least(1);
				expect(result.files[0]).to.equal(__dirname + '/data/test.js');
			}).should.eventually.be.fulfilled;
		});

		it ('should come back with minified html', () => {
			return transform.compile(__dirname + '/data/test.html', html).then((result) => {
				expect(result.data.toString()).to.equal('<!DOCTYPE html><html><head><title>HTML</title><body><h1>My HTML document</h1>');
				expect(result.files).to.an('array')
				                    .to.have.length.of.at.least(1);
				expect(result.files[0]).to.equal(__dirname + '/data/test.html');
			}).should.eventually.be.fulfilled;
		});

	});

});
