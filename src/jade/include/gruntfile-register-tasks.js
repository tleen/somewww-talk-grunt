var taskList = [
  'env',
  'clean:pre', // make sure dist directory is clear
  'mkdir',  // make tmp dir for build
  'jade', // build html from template(s)
  'sass', // build css from template(s)
  'imagemin', // optimize images + move to tmp
  'favicons', // generate favicons and insert favicon markup into html
  'jshint', // validate javascript
  'csslint', // validate css
  'concat', // concat groups of files into a single file
  'cssmin', // minify css
  'uglify', // minify js
  'copy',  // copy tmp files to dist
  'test:local', // read index.html file from /dest and verify contents
  'clean:post' // remove tmp dir and misc build files
];

grunt.registerTask('default', taskList);
