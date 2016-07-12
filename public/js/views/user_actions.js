define([
    'jquery',
    'underscore',
    'backbone',
    'socketio',
    'toaster',
    'bootstrap',
    'text!/templates/new_msg_modal.html'
], function ( $, _, Backbone, io, toaster, bootstrap, ModalTmpl) {
    App.Views.UserActions = App.Views.Main.extend({
    	modal_tmpl: _.template(ModalTmpl),

        initialize: function () {
            self = this;
        },

        postFriend: function (id) {
        	return $.ajax({
        	    method: 'POST',
        	    url: '/friends/' + id
        	});
        },

        deleteFriend: function (id) {
        	return $.ajax({
                method: 'DELETE',
                url: '/friends/' + id
            }); 
        },

        sendMsg: function (e) {
            var $input = $('.recipient_name');
            var $modal = e.data.$modal;
            var user = e.data.user || {
                name: $input.val(),
                id: $input.attr('data-id')
            };

            var text = $modal.find('textarea').val();
            var msg = {
                to: user.id,
                text: text
            };

            App.socket.emit('send_msg', msg);
            setTimeout(function () {
                $modal.modal('hide');
                $modal.find('textarea').val('');
                alert('Your message send to ' + user.name);
                App.object.trigger('msg_is_send');
            }, 1000);
        },

        showMsgModal: function (e) {
            e.stopPropagation();
            var $msg_btn = $(e.currentTarget);
            var $user_row = $msg_btn.closest('li');
            var id = $user_row.data('id');
            var name = $.trim($user_row.find('.user_name').text());

            if ( ! App.session.isAuthenticated() ) {
                alert('Log in to write a message to ' + name);
                return;
            }

            if ( ! this.$el.find('#msg_modal').length ) {
                this.$el.append(this.modal_tmpl());
            }

            $modal = $('#msg_modal');
            $send_msg = $('.send_msg');
            $close = $('.close');

            var data = {
                $modal: $modal,
                user: {
                    id: id,
                    name: name
                }
            };

            $send_msg.unbind('click');
            $send_msg.bind('click', data, self.sendMsg);

            $close.unbind('click');
            $close.bind('click', function () {
                $modal.modal('hide');
            });

            if ( name ) {
                $modal.find('.reciever').html(name);
                $('input.recipient_name').hide();
                $('ul#search_for_recipient').hide();
            } else {
                this.showFriendsInSearchBox();
            }

            $modal.modal('show');
        }
    });

    return App.Views.UserActions;
});
