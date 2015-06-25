var expect = require('chai').expect;
var engine = require('../');

describe('stylus', function() {

  describe('compiler', function() {

    var css = 'my {\n' +
              '    width: 100%;' +
              '}\n';

    var js = 'function myFunc() {\n' +
             '    console.log(\'test\');\n' +
             '}\n';

    var html = '<!DOCTYPE html>\n' +
               '<html>\n' +
               '  <head>\n' +
               '    <title>HTML</title>\n' +
               '  </head>\n' +
               '  <body>\n' +
               '    <h1>My HTML document</h1>\n' +
               '  </body>\n' +
               '</html>\n'

    it ('should come back with minified css', function(done) {
      engine().compile('test.css', css, {}, function(err, data, files) {
        expect(err).to.be.null;
        expect(data).to.equal('my{width:100%}');
        expect(files).to.an.array;
        expect(files[0]).to.equal('test.css');
        done();
      });
    });

    it ('should come back with minified js', function(done) {
      engine().compile('test.js', js, {}, function(err, data, files) {
        expect(err).to.be.null;
        expect(data).to.equal('function myFunc(){console.log("test")}');
        expect(files).to.an.array;
        expect(files[0]).to.equal('test.js');
        done();
      });
    });

    it ('should come back with minified html', function(done) {
      engine().compile('test.html', html, {}, function(err, data, files) {
        expect(err).to.be.null;
        expect(data).to.equal('<!DOCTYPE html><html><head><title>HTML</title><body><h1>My HTML document</h1>');
        expect(files).to.an.array;
        expect(files[0]).to.equal('test.html');
        done();
      });
    });

  });

});
