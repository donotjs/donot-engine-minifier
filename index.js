var path = require('path');
var minify = require('minify');

exports = module.exports = function(opt) {
  return {
    map: {
      '.min.css': '.css',
      '.min.js': '.js',
      '.min.html': '.html',
      '.min.htm': '.htm'
    },
    encoding: (opt || {}).encoding || 'utf8',
    compile: function(file, data, opt, cb) {
      var ext = path.extname(file);
      minify({
        ext: (ext === '.htm' ? '.html' : ext),
        data: data
      }, function(err, data) {
        cb(err, data, [file]);
      });
    }
  };
};
