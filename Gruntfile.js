'use strict';
var SERVER_PORT = 9001;

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-serve');

  grunt.initConfig({

    serve: {
      options: {
        port: SERVER_PORT
      },
      path: './app'
    }

  });

  grunt.registerTask('default', [
    'serve'
  ]);


};


