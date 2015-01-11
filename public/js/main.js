
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
        }
    },
    paths: {
        jquery: 'libs/jquery/jquery',
        underscore: 'libs/underscore/underscore',
        backbone: 'libs/backbone/backbone',
        "text" : "libs/requirejs-text/text",
        socketio: 'libs/socketio/socket.io'
    }

});

require([
    'app'
], function(App){
    App.initialize();
});