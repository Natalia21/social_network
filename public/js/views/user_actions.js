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

        showMsgModal: function (e) {
            var $msg_btn = $(e.currentTarget);
            var $user_row = $msg_btn.parent();
            var $send_msg = null;
            var $modal = null;
            var id = $user_row.data('id');
            var name = $.trim($user_row.find('h3').text());

            if ( ! this.$el.find('#msg_modal').length ) {
                this.$el.append(this.modal_tmpl());
                $modal = $('#msg_modal');
                $send_msg = $('.send_msg');
            }

            $modal.modal('show');
            $send_msg.unbind('click');
            $send_msg.click(function () {
                var text = $modal.find('textarea').val();
                var msg = {'to': id, 'text': text};

                App.socket.emit('send_msg', msg);

                setTimeout(function () {
                    $modal.modal('hide');
                    $modal.find('textarea').val('');
                    alert('Ваше сообщение отправлено ' + name);
                }, 1500);
            });

            $modal.find('.reciever').html(name);
            $modal.modal('show');
        }
    });

    return App.Views.UserActions;
});
