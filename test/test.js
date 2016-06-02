/*jshint expr: true*/

'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');

chai.should();
chai.use(chaiAsPromised);

const MinifyTransform = require('../');

var transform = new MinifyTransform();

describe('minify', () => {

	describe('compiler', () => {

		var css = 'my {\n' +
							'		width: 100%;' +
							'}\n';

		var js = 'function myFunc() {\n' +
						 '		console.log(\'test\');\n' +
						 '}\n';

		var html = '<!DOCTYPE html>\n' +
							 '<html>\n' +
							 '	<head>\n' +
							 '		<title>HTML</title>\n' +
							 '	</head>\n' +
							 '	<body>\n' +
							 '		<h1>My HTML document</h1>\n' +
							 '	</body>\n' +
							 '</html>\n';

		it ('should come back with minified css', () => {
			return transform.compile('test.css', css).then((result) => {
				expect(result.data).to.equal('my{width:100%}');
				expect(result.files).to.an.array;
				expect(result.files[0]).to.equal('test.css');
			}).should.eventually.be.fulfilled;
		});

		it ('should come back with minified js', () => {
			return transform.compile('test.js', js).then((result) => {
				expect(result.data).to.equal('function myFunc(){console.log("test")}');
				expect(result.files).to.an.array;
				expect(result.files[0]).to.equal('test.js');
			}).should.eventually.be.fulfilled;
		});

		it ('should come back with minified html', () => {
			return transform.compile('test.html', html).then((result) => {
				expect(result.data).to.equal('<!DOCTYPE html><html><head><title>HTML</title><body><h1>My HTML document</h1>');
				expect(result.files).to.an.array;
				expect(result.files[0]).to.equal('test.html');
			}).should.eventually.be.fulfilled;
		});

	});

});
