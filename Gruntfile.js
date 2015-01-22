module.exports = function(grunt) {
    grunt.initConfig({
        jasmine_node: {
            options: {
                forceExit: true,
                match: '.',
                matchall: false,
                extensions: 'js',
                specNameMatcher: 'spec'//
                /*jUnit: {
                    report: true,
                   // savePath : "./build/reports/jasmine/",
                    useDotNotation: true,
                    consolidate: true
                }*/
            },
            all: ['./public/js/server/tests/']
        },
        copy: {
            jquery: {
                expand: true,
                cwd: "bower_components/jquery/dist",
                src: ["jquery.js"],
                dest: 'public/js/libs/jquery'
            },
            backbone: {
                expand: true,
                cwd: "bower_components/backbone",
                src: ["backbone.js"],
                dest: 'public/js/libs/backbone'
            },
            underscore: {
                expand: true,
                cwd: "bower_components/underscore",
                src: ["underscore.js"],
                dest: 'public/js/libs/underscore'
            },
            require: {
                expand: true,
                cwd: "bower_components/requirejs",
                src: ["require.js"],
                dest: 'public/js/libs/require'
            },
            require_text: {
                expand: true,
                cwd: "bower_components/requirejs-text",
                src: ["text.js"],
                dest: 'public/js/libs/requirejs-text'
            },
            bootstrapjs: {
                expand: true,
                cwd: "bower_components/bootstrap/dist/js",
                src: ["bootstrap.js"],
                dest: 'public/js/libs/bootstrap'
            },
            bootstrapcss: {
                expand: true,
                cwd: "bower_components/bootstrap/dist/css",
                src: ["bootstrap.css", "bootstrap.css.map"],
                dest: 'public/css/libs/bootstrap'
            },
            socketio: {
                expand: true,
                cwd: "node_modules/socket.io/node_modules/socket.io-client",
                src: ["socket.io.js"],
                dest: 'public/js/libs/socketio'
            }
        }
});
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-jasmine-node');

    grunt.registerTask('test', ['jasmine_node']);

    grunt.registerTask("build", ["copy"]);
    grunt.registerTask("default", "build");

};



























