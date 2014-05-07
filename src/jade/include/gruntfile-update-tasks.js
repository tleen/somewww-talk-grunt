grunt.registerTask('default', taskList);

var publishTasks = taskList.concat(['aws_s3', 'test:remote']);
grunt.registerTask('publish', publishTasks);
