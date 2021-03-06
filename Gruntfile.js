module.exports = function(grunt) {
    grunt.initConfig({
      //  pkg: grunt.file.readJSON("package.json"),
        copy: {
            jquery: {
                expand: true,
                cwd: 'bower_components/jquery/dist',
                src: ['jquery.js'],
                dest: 'public/js/libs/jquery'
            },
            backbone: {
                expand: true,
                cwd: 'bower_components/backbone',
                src: ['backbone.js'],
                dest: 'public/js/libs/backbone'
            },
            underscore: {
                expand: true,
                cwd: 'bower_components/underscore',
                src: ['underscore.js'],
                dest: 'public/js/libs/underscore'
            },
            require: {
                expand: true,
                cwd: 'bower_components/requirejs',
                src: ['require.js'],
                dest: 'public/js/libs/require'
            },
            require_text: {
                expand: true,
                cwd: 'bower_components/requirejs-text',
                src: ['text.js'],
                dest: 'public/js/libs/requirejs-text'
            },
            bootstrapjs: {
                expand: true,
                cwd: 'bower_components/bootstrap/dist/js',
                src: ['bootstrap.js'],
                dest: 'public/js/libs/bootstrap'
            },
            bootstrapcss: {
                expand: true,
                cwd: 'bower_components/bootstrap/dist/css',
                src: ['bootstrap.css', 'bootstrap.css.map'],
                dest: 'public/css/libs/bootstrap'
            },
            jscookie: {
                expand: true,
                cwd: 'bower_components/js-cookie/src',
                src: ['js.cookie.js'],
                dest: 'public/js/libs/js.cookie'
            },
            socketio: {
                expand: true,
                cwd: 'node_modules/socket.io/node_modules/socket.io-client',
                src: ['socket.io.js'],
                dest: 'public/js/libs/socketio'
            },
            fontawesome: {
                expand: true,
                cwd: 'bower_components/fontawesome',
                src: ['css/font-awesome.css', 'fonts/*'],
                dest: 'public/css/libs/fontawesome'
            }
        },
        jshint: {
            all: [
                'public/**/*.js',
                'server/**/*.js',
                'server.js',
                'Gruntfile.js',
                'config.js',
                '!public/js/libs/**/*',
                '!server/tests/**/*'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        mochaTest: {
            test: {
                src: ['server/tests/**/*.js'],
                options: {
                    reporter: 'spec'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-env');

    grunt.registerTask('default', ['copy', 'jshint']);
    grunt.registerTask('unit', ['env:test', 'mochaTest']);
};
