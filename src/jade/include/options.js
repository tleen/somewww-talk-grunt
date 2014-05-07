grunt.initConfig({
// ..
  imagemin: {
    options: {cache: false},
    assets: { expand: true, cwd: 'assets/images', src: ['**.{png,jpg}'], dest: 'tmp/images/'}
  },
//..
});

