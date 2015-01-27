define([
    'jquery',
    'underscore',
    'backbone',
    'socketio',
    'text!/templates/profile.html',
    './requests_owner'
], function($, _, Backbone, io, ProfileTemplate, RequestsOwner){
    var InitView = Backbone.View.extend({
        el:  $('#content'),
        initialize: function(){
            this.socket_is_ready_obj = {};
            this.sign_out_object = {};
            this.friends_are_ready_obj = {};
            _.extend(this.sign_out_object, Backbone.Events);
            _.extend(this.socket_is_ready_obj, Backbone.Events);
            _.extend(this.friends_are_ready_obj, Backbone.Events);
            var that = this;
            var socket = null;
            this.owner_action = new RequestsOwner();
            this.owner_action.getOwner();

            this.owner_action.object.once('owner_is_fetched', function(owner){
                that.socket_is_ready_obj.trigger('get_socket', owner);
            });
            this.owner_action.object.once('owner_is_absent', function(){
                that.owner_action.object.off('owner_is_fetched');
                $('#header').hide();
                $('#navbar').hide();
                $('#content').hide();
                $('#row').removeClass('full');
                var url = document.URL.split('#');
                url[1] == 'registering' ? Backbone.history.navigate('registering', true) :  Backbone.history.navigate('login', true);
            });
            this.socket_is_ready_obj.on('get_socket', function(owner){
                socket = io.connect('http://localhost:8888', {query: 'ID=' + owner.get('id'), 'forceNew':true});
                that.socket_is_ready_obj.trigger('socket_is_ready', socket, owner);
                var url = document.URL.split('#');
                $('#registeringForm').remove();
                $('#loginForm').remove();
                url[1] && url[1] != 'login' && url[1] != 'registering'? Backbone.history.navigate(url[1], true) : Backbone.history.navigate('profile/' + owner.get('id'), true);
            });

            this.sign_out_object.on('sign_out', function(){
                socket.disconnect();
            });

            window.onresize = function(){
                $('.friends_action').css('margin-left', $('#navbar').css('width'));
            }
        }

    });
    return InitView;
});


























