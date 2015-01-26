define([
    'jquery',
    'underscore',
    'backbone',
    './requests_owner'
], function($, _, Backbone, RequestsOwner){
    var KillFriendView = Backbone.View.extend({
        el: $("#content"),
        initialize: function(){
        },
        events: {
            "click .kill_friend": 'killFriend'
        },
        render: function(param, e){
            var response = param[1];
            alert(response.text);
            $("#" + e.target.id.split('kill')[0]).remove();
            if($("#my_friends_list")[0] &&  $("#my_friends_list")[0].children.length == 0 && document.URL.indexOf('reference_requests') != -1){
                var compiledTemplate = _.template('<h2>У вас нет неподтверждённых заявок</h2>');
            }
            if($("#my_friends_list")[0] && $("#my_friends_list")[0].children.length == 0 && document.URL.indexOf('my_friends') != -1){
                var compiledTemplate = _.template('<h2>У вас пока нет друзей</h2>');
            }
            this.$el = $("#content");
            this.$el.html(compiledTemplate);
            $("#" + e.target.id).hide();
            $("#" + e.target.id.split('kill_')[0] + e.target.id.split('kill_')[1]).show();
        },
        killFriend: function(e){
            var that = this;
            this.owner_action = new RequestsOwner();
            this.owner_action.getOwner();
            this.owner_action.object.once('owner_is_fetched', function(owner){
                that.owner_action.killFriend(owner, {friends: {id: e.target.id.split('kill')[0]}});
                that.owner_action.object.once('owner_is_saved', function(param){
                    that.render(param, e);
                });
            });
        }
    });
    return KillFriendView;
});