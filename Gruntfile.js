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
	'validation-status.json' // left by html validation
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

    copy : [
      {expand: true, cwd: 'tmp/', src: ['index.{css,html,js}'], dest: 'dist/'}
    ],

    csslint : [
      {expand: true, src: 'tmp/*.css'}
    ],
    
    cssmin : [
      {src: 'tmp/*.css', dest: 'tmp/*.css'}
    ],

    mkdir: {
      all : {
	options : {
	  create : ['tmp']
	}
      }
    },

    jade: {
      options: {
	pretty: true
      },
      files: {expand: true , cwd: 'src/jade', src: ['*.jade'], dest: 'tmp/', ext: '.html'}
    },

    jshint: {
      options: {
	smarttabs: true
      },
      files: {
	src : ['Gruntfile.js', 'src/js/*.js']
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
      files: {expand: true, cwd: 'tmp/', src: ['*.html']}
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
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-mkdir');


  var taskList = [
    'clean:pre', // make sure dist directory is clear
    'mkdir',  // make tmp dir for build

    'jade', // build html from template(s)
    'sass', // build css from template(s)

    'validation', // validate html
    'jshint', // validate javascript
    'csslint', // validate css

    'concat', // concat groups of files into a single file

    'cssmin', // minify css
    'uglify', // minify js

    // optimize images, move to tmp

    'copy',  // copy files to dist

    // do a mocha test? add a token into the build and view it?

    // force this to run even if other tasks fail
    'clean:post' // remove tmp dir and misc build files
  ];

  grunt.registerTask('default', taskList);

  // for the deploy task I am going to rebuild everything then add an upload to s3
  // grunt-contrib-compress? 

  // aws task fails silently when part of a tasklist :(
  grunt.registerTask('publish', taskList.concat(['aws_s3']));

};
