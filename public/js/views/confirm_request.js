define([
    'jquery',
    'underscore',
    'backbone',
    './requests_user',
    './requests_owner',
    'text!/templates/it_is_empty.html'
], function($, _, Backbone, RequestsUser, RequestsOwner, itIsEmptyTemplate){
    var ConfirmRequestView = Backbone.View.extend({
        el: $('#content'),
        initialize: function(){
        },
        events:{
            'click .confirm_friend': 'confirmFriend'
        },
        render: function(e){
            $('#' + e.target.id.split('friend')[0]).remove();
            if($('#my_friends_list')[0].children.length == 0){
                var compiledTemplate = _.template(itIsEmptyTemplate);
                this.$el = $('#content');
                this.$el.html(compiledTemplate({msg: 'У вас нет новых заявок'}));
            }
        },
        confirmFriend: function(e){
            var that = this;
            this.owner_action = new RequestsOwner();
            this.owner_action.getOwner();
            this.owner_action.object.once('owner_is_fetched', function(owner){
                that.owner_action.confirmFriend(owner, {friends: {id: e.target.id.split('friend')[0], confirm: true, _new: false}});
                that.owner_action.object.once('owner_is_saved', function(owner){
                    that.user_action = new RequestsUser();
                    that.user_action.confirmFriend(e.target.id.split('friend')[0], {friends: {id: owner.id, confirm: true, _new: false}});
                    that.user_action.object.once('user_is_saved', function(){
                        that.render(e);
                    });
                });
            });
        }
    });
    return ConfirmRequestView;
});