define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/my_friends.html',
    '../models/user_model',
    './requests_user',
    './requests_friends'
], function($, _, Backbone, myFriendsTemplate, UserModel, DoSmthWithUserView, FriendsRequest){
    var MyFriendsView = Backbone.View.extend({
        el:  $('#content'),
        my_friends: [],
        initialize: function(){
        },
        init: function(id){
            this.$el = $('#content');
            this.my_friends = [];
            if(document.URL.indexOf('my_friends') != -1){
                this.char_to_check = {confirm: true, from: id, to: id};
                this.text = 'У вас пока нет друзей';
                this.var_to_hide = '.confirm_friend';
            }
            if(document.URL.indexOf('reference_requests') != -1){
                this.char_to_check = {confirm: false, from: id, to: null};
                this.text = 'У вас нет неподтвержденных заявок';
                this.var_to_hide = '.confirm_friend';
            }
            if(document.URL.indexOf('new_requests') != -1){
                this.char_to_check = {confirm: false, to: id, from: null};
                this.text = 'У вас нет новых заявок';
                this.var_to_hide = '.kill_friend';
            }
            this.getMyFriends(id);

        },
        getMyFriends: function(id){
            var that = this;
            this.friend_request = new FriendsRequest();
            this.friend_request.getFriends(this.char_to_check);
            this.friend_request.object.on('friends_are_got', function(friends_collection){
                that.render(friends_collection, id);
            });
            this.friend_request.object.on('friends_are_absent', function(){
                var compiledTemplate = _.template('<h2>' + that.text + '</h2>');
                that.$el.html(compiledTemplate);
            });
        },
        render: function(friends_collection, id){
            var that = this;
            var compiledTemplate = _.template('<ul class = "nav users_list" id = "my_friends_list"></ul>');
            this.$el.html(compiledTemplate());
            this.$el = $('#my_friends_list');
            friends_collection.models.forEach(function(index){
                that.user_action = new DoSmthWithUserView();
                var user_id;
                index.get("from") == id ? user_id = index.get("to") : user_id = index.get("from");
                that.user_action.getUser(user_id);
                that.user_action.object.once('user_is_fetched', function(user) {
                    var compiledTemplate = _.template(myFriendsTemplate);
                    that.$el.append(compiledTemplate(user.attributes));
                });
            });
            $(this.var_to_hide).hide();
        }
    });
    return MyFriendsView;
});




























