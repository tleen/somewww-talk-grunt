grunt.initConfig({
//...
  concat : {
    css : {
      src: 'tmp/*.css', 
      dest: 'tmp/index.css'
    },
    js : {
      src: 'src/js/*.js',
      dest: 'tmp/index.js'
    }
  }
//...
});
