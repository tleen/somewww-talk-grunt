grunt.initConfig({
//...
  s3Credentials: grunt.file.readJSON('.s3-auth.json'),
  generatedTime : (new Date()).toISOString(), 

  aws_s3: {
    options: {
      accessKeyId: '<%= s3Credentials.key %>',
      secretAccessKey: '<%= s3Credentials.secret %>',
      bucket: '<%= s3Credentials.bucket %>'
    },
    upload: {action: 'upload', expand: true, cwd: 'dist/', src: ['**/**.*','!README.md'], dest: ''}      
  },
  //...
  env : {
    vars : {
      DATETIME : '<%= generatedTime %>'
    }
  }
  //...
});
