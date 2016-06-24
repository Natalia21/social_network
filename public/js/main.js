
require.config({
    shim: {
        'socketio': {
            exports: 'io'
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        'bootstrap': {
            exports: 'bootstrap'
        },
        'jscookie': {
            exports: 'jscookie'
        },
        'toaster': {
            exports: 'toaster'
        }
    },
    paths: {
        jquery: 'libs/jquery/jquery',
        underscore: 'libs/underscore/underscore',
        backbone: 'libs/backbone/backbone',
        "text" : "libs/requirejs-text/text",
        socketio: 'libs/socketio/socket.io',
        jscookie: 'libs/js.cookie/js.cookie',
        bootstrap: 'libs/bootstrap/bootstrap',
        toaster:   'libs/jquery.toaster/jquery.toaster'
    }

});

require([
    'app'
], function(App){
    App.initialize();
});