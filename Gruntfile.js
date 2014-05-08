module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    s3Credentials: grunt.file.readJSON('.s3-auth.json'),
    generatedTime : (new Date()).toISOString(), 

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
	'dist/*', // remove everythig in dist except the readme
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
      {src: 'tmp/*.css'}
    ],
    
    cssmin : [
      {src: 'tmp/index.css', dest: 'tmp/index.css'}
    ],

    env : {
      vars : {
	DATETIME : '<%= generatedTime %>'
      }
    },

    favicons : {
      options : {
	html : 'tmp/index.html',
	HTMLPrefix : 'images/favicons/',
	apple : false,
	windowsTile : false
      },
      generate : {
	src: 'src/favicon/favicon.png',
	dest: 'tmp/images/favicons/'
      }
    },
    
    imagemin: {
      options: {cache: false},
      assets: { expand: true, cwd: 'assets/images', src: ['**.{png,jpg}'], dest: 'tmp/images/'}
    },

    jade: {
      options: {
	pretty: false,
	data : {
	  datetime : '<%= generatedTime %>',
	  version : '<%= pkg.version %>'
	}
      },
      templates: {expand: true , cwd: 'src/jade', src: ['*.jade'], dest: 'tmp/', ext: '.html'}
    },

    jshint: {
      options: {
	node : true,
	smarttabs: true,
	predef : [ // required because of mocha, allowed 'predefined' terms
          'after',
          'before',
          'beforeEach',
          'describe',
	  'it']
      },
      files: {
	src : ['Gruntfile.js', 'src/js/*.js', 'test/*.js']
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

    test: {
      options : {
        ui : 'bdd',
        require : [
          'should'
        ]
      },
      local : {
	src: 'test/local.js'
      },
      remote : {
	src: 'test/remote.js'
      }
    },

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
  grunt.loadNpmTasks('grunt-cafe-mocha');
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
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-favicons');
  grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-mkdir');

  // I like it better when test task is named 'test'
  grunt.renameTask('cafemocha', 'test');


  var taskList = [
    'env',
    'clean:pre', // make sure dist directory is clear
    'mkdir',  // make tmp dir for build

    'jade', // build html from template(s)
    'sass', // build css from template(s)


    'imagemin', // optimize images + move to tmp

    'favicons', // generate favicons and insert favicon markup into html

    // xx - running validation before imagemin causes imagemin to fail (and aws_s3, and mocha)
//    'validation', // validate html

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
    'test:local', // read index.html file from /dest and verify contents
    'clean:post' // remove tmp dir and misc build files
  ];

  grunt.registerTask('default', taskList);

  // for the deploy task I am going to rebuild everything then add an upload to s3
  // grunt-contrib-compress? 

  var publishTasks = taskList.concat(['aws_s3', 'test:remote']);
//  publishTasks.splice(6,1);   // html validation (somehow messes with s3 upload, so splice it out)
  grunt.registerTask('publish', publishTasks);

};
