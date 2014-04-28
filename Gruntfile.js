module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    s3Credentials: grunt.file.readJSON('.s3-auth.json'),

    // the ordering of these tasks does not matter, I did it alphabetically

    aws_s3: {
      options: {
	accessKeyId: '<%= s3Credentials.key %>',
	secretAccessKey: '<%= s3Credentials.secret %>',
	bucket: '<%= s3Credentials.bucket %>'
      },
      upload: {action: 'upload', expand: true, cwd: 'dist/', src: ['**/**.*','!README.md'], dest: ''}      
    },

    clean: {
      pre: {
	options : {
	  force: true // dist is a symlink to a www directory so force alows me to clean contents out of current directory
	},
	src: [ 
	'dist/*', // remove everythig in dist except the readme (this keeps dist as an active dir in source control)
	'!dist/README.md'], // ignore the README file
      },
      post: [
	'.sass-cache', // leftover from sass complile
	'tmp', // holding temporary build files
	'validation-*.json' // left by html validation
      ]
    },

    concat : {
      css : {
	src: 'tmp/*.css', 
	dest: 'tmp/index.css'
      },
      js : {
	src: 'src/js/*.js',
	dest: 'tmp/index.js'
      }
    },

    copy : {
      assets : {expand: true, cwd: 'assets/', src: ['humans.txt'], dest: 'tmp/'},
      tmp : {expand: true, cwd: 'tmp/', src: ['**/*.*'], dest: 'dist/'}
    },

    csslint : [
      {expand: true, src: 'tmp/*.css'}
    ],
    
    cssmin : [
      {src: 'tmp/index.css', dest: 'tmp/index.css'}
    ],
    
    imagemin: {
      options: {cache: false},
      assets: { expand: true, cwd: 'assets/images', src: ['**.{png,jpg}'], dest: 'tmp/images/'}
    },

    jade: {
      options: {
	pretty: true
      },
      templates: {expand: true , cwd: 'src/jade', src: ['*.jade'], dest: 'tmp/', ext: '.html'}
    },

    jshint: {
      options: {
	smarttabs: true
      },
      files: {
	src : ['Gruntfile.js', 'src/js/*.js']
      }
    },

    mkdir: {
      tmp : {
	options : {
	  create : ['tmp']
	}
      }
    },

    sass: [
      {src: 'src/scss/index.scss', dest: 'tmp/index.css'}
    ],

    uglify: [
      {src: 'tmp/index.js', dest: 'tmp/index.js'}
    ],

    validation: {
      options : {
	failHard : true,
	reportpath : false,
	reset : true
      },
      html: {expand: true, cwd: 'tmp/', src: ['*.html']}
    }
  });

  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-mkdir');


  var taskList = [
    'clean:pre', // make sure dist directory is clear
    'mkdir',  // make tmp dir for build

    'jade', // build html from template(s)
    'sass', // build css from template(s)


    'imagemin', // optimize images + move to tmp

    // xx - running validation before imagemin causes imagemin to fail
    'validation', // validate html

    'jshint', // validate javascript

    'csslint', // validate css

    'concat', // concat groups of files into a single file

    'cssmin', // minify css
    'uglify', // minify js

    'copy',  // copy tmp files to dist
/*
    // do a mocha test? add a token into the build and view it?

    // force this to run even if other tasks fail
*/
    'clean:post' // remove tmp dir and misc build files
  ];

  grunt.registerTask('default', taskList);

  // for the deploy task I am going to rebuild everything then add an upload to s3
  // grunt-contrib-compress? 

  var publishTasks = taskList.concat(['aws_s3']);
  publishTasks.splice(5,1);   // html validation (somehow messes with s3 upload, so splice it out)
  grunt.registerTask('publish', publishTasks);

};
