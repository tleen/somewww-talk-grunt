var taskList = [
// ..
  'clean:pre',
// ..
  'test:local',
  'clean:post'
];

grunt.registerTask('default', taskList);
