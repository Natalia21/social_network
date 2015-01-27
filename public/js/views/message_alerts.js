define([
    'jquery',
    'underscore',
    'backbone',
    'socketio',
    'text!/templates/alerts.html',
    './requests_user'
], function($, _, Backbone, io, AlertsTemplate, RequestsUser){
    var MsgAlertsView = Backbone.View.extend({
        el: $('#content'),
        initialize: function(socket_is_ready_obj){
            this.socket_is_ready_obj = socket_is_ready_obj;
            this.catchEvent();
        },
        catchEvent: function(){
            var that = this;
            this.socket_is_ready_obj.on('socket_is_ready', function(socket, owner){
                that.socket = socket;
                socket.on('message_to_user', function (message) {
                    if(message.to == owner.get('id')){
                        that.createAlert(message);
                    }
                });
            });
        },
        closeAlert: function(e){
            for(var i = 0; i < this.elems.length; i++){
                if(this.elems[i].id == e.target.id){
                    for(var k = i + 1; k < this.elems.length; k++){
                        var current_top = $(this.elems[k]).css('top').split('px')[0];
                        $(this.elems[k]).css('top', parseInt(current_top) - parseInt($('.alert').css('height').split('px')[0]) + 'px');
                    }
                    break;
                }
            }
        },
        createAlert: function(message){
            var that = this;
            var compiledTemplateAlert = _.template(AlertsTemplate);
            this.user_action = new RequestsUser();
            this.user_action.getUser(message.from);
            this.user_action.object.once('user_is_fetched', function (user) {
                var user_name = user.get('first_name') + ' ' + user.get('last_name');
                var top = $('#header').css('height').split('px')[0];
                var shift = $('.alert').css('height') ? $('.alert').length * $('.alert').css('height').split('px')[0] : 0;
                that.$el = $('#content');
                that.$el.append(compiledTemplateAlert({id: message.from, name: user_name, msg: message.text, time: message.time}));
                that.elems = $('.alert');
                $.when(
                    $(that.elems[that.elems.length - 1])
                        .css('top', $('#header').css('height'))
                        .css('display', 'block')
                        .animate({opacity: 1, top: parseInt(top) + parseInt(shift) + 'px'}, 200)).then(function(){
                        if(that.elems.length > 5){
                            that.elems[0].remove();
                            for(var i = 0; i < that.elems.length; i++){
                                var current_top = $(that.elems[i]).css('top').split('px')[0];
                                $(that.elems[i]).css('top', parseInt(current_top) - parseInt($('.alert').css('height').split('px')[0]) + 'px')
                            }
                        }
                    });
                $(that.elems[that.elems.length - 1]).on('closed.bs.alert', function (e) {
                    that.closeAlert(e);
                });
            });
        }
    });
    return MsgAlertsView;
});