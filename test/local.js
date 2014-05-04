/* jshint expr: true */
'use strict';

var fs = require('fs'),
pkg = require('../package.json');



var indexFilename = __dirname + '/../dist/index.html';
var datetime = process.env.DATETIME;

describe('dist/index.html', function(){  
  it('should exist', function(done){
    fs.exists(indexFilename, function(exists){
      exists.should.be.true;
      return done();
    });
  });

  it('should be this generated version', function(done){
    fs.readFile(indexFilename, 'utf8', function(err, data){
      (err === null).should.be.true;
      data.should.be.a.String;
      data.should.containEql('Generated @ ' + datetime);
      data.should.containEql('version ' + pkg.version);
      return done();
    });
  });
});
