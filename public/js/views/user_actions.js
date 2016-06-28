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
        	    url: '/add_friend',
        	    data: {friend_id: id}
        	});
        },

        deleteFriend: function (id) {
        	return $.ajax({
                method: 'POST',
                url: '/remove_friend',
                data: {friend_id: id}
            }); 
        },

        showMsgModal: function (e) {
            var $msg_btn   = $(e.currentTarget),
                $user_row  = $msg_btn.parent(),
                $send_msg  = null,
                $modal     = $('#msg_modal');
            var id   = $user_row.data('id'),
                name = $.trim($user_row.find('h3').text());

            if ( ! this.$el.find('#msg_modal').length ) {
                this.$el.append(this.modal_tmpl());
                $send_msg = $('.send_msg');
            }

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
