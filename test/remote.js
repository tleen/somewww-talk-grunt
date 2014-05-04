/* jshint expr: true */
'use strict';

var pkg = require('../package.json'),
request = require('request');



var indexURL = 'http://grunt.thomasleen.com/index.html';
var datetime = process.env.DATETIME;

describe('dist/index.html', function(){  
  it('should be this generated version', function(done){
    request(indexURL, function (error, response, body) {
      (error === null).should.be.true;
      body.should.be.a.String;
      body.should.containEql('Generated @ ' + datetime);
      body.should.containEql('version ' + pkg.version);
      return done();
    });
  });
});
