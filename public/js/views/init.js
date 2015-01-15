define([
    'jquery',
    'underscore',
    'backbone',
    'socketio',
    'text!/templates/profile.html',
    './actions_with_user',
    './actions_with_owner'
], function($, _, Backbone, io, ProfileTemplate, DoSmthWithUserView, DoSmthWithOwnerView){
    var ProfileView = Backbone.View.extend({
        el:  $('#content'),
        initialize: function(){
            this.socket_is_ready_obj = {};
            this.sign_out_object = {};
            _.extend(this.sign_out_object, Backbone.Events);
            _.extend(this.socket_is_ready_obj, Backbone.Events);
            var that = this;
            var socket = null;
            this.owner_action = new DoSmthWithOwnerView();
            this.owner_action.getOwner();
            this.owner_action.object.once('owner_is_absent', function(){
                Backbone.history.navigate('login', true);
            });
            this.owner_action.object.once('owner_is_fetched', function(owner){
                that.socket_is_ready_obj.trigger('get_socket', [owner, 'init']);
            });

            this.socket_is_ready_obj.on('get_socket', function(owner){
                console.log('HERE ' + owner[1]);
                socket = io.connect('http://localhost:8888', {query: 'ID=' + owner[0].get("id"), 'forceNew':true});
                that.socket_is_ready_obj.trigger('socket_is_ready', socket, owner[0]);
                var url = document.URL.split('#');
                console.log('url ' + url);
                url[1] && url[1] != 'login' ? Backbone.history.navigate(url[1], true) : Backbone.history.navigate('profile/' + owner[0].get("id"), true);
            });

            this.sign_out_object.on("sign_out", function(){
                console.log('emit disconnect');
                console.log(socket);
                socket.disconnect();
            });
        }
    });
    return ProfileView;
});




























