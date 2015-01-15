define([
    'jquery',
    'underscore',
    'backbone',
    'socketio',
    'text!/templates/profile.html',
    './requests_user',
    './requests_owner'
], function($, _, Backbone, io, ProfileTemplate, DoSmthWithUserView, DoSmthWithOwnerView){
    var InitView = Backbone.View.extend({
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

            this.owner_action.object.once('owner_is_fetched', function(owner){
                that.socket_is_ready_obj.trigger('get_socket', [owner, 'init']);
            });
            this.owner_action.object.once('owner_is_absent', function(){
                that.owner_action.object.off('owner_is_fetched');
                $('#header').hide();
                $('#navbar').hide();
                $('#content').hide();
                $('#row').removeClass('full');
                Backbone.history.navigate('login', true);
            });
            this.socket_is_ready_obj.on('get_socket', function(owner){
                socket = io.connect('http://localhost:8888', {query: 'ID=' + owner[0].get("id"), 'forceNew':true});
                that.socket_is_ready_obj.trigger('socket_is_ready', socket, owner[0]);
                var url = document.URL.split('#');
                url[1] && url[1] != 'login' ? Backbone.history.navigate(url[1], true) : Backbone.history.navigate('profile/' + owner[0].get("id"), true);
            });

            this.sign_out_object.on("sign_out", function(){
                socket.disconnect();
            });
        }
    });
    return InitView;
});


























