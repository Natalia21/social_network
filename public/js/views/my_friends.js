define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/my_friends.html',
    './requests_user',
    'text!/templates/it_is_empty.html',
    'text!/templates/container_for_friends.html'
], function($, _, Backbone, myFriendsTemplate, RequestsUser, itIsEmptyTemplate, containerForFriends){
    var MyFriendsView = Backbone.View.extend({
        el:  $('#content'),
        my_friends: [],
        initialize: function(){

        },
        init: function(id){
            this.my_friends = [];
            if(document.URL.indexOf('my_friends') != -1){
                this.char_to_check = ['confirm', true];
                this.text = 'У вас пока нет друзей';
                this.var_to_hide = '.confirm_friend';
            }
            if(document.URL.indexOf('reference_requests') != -1){
                this.char_to_check = ['confirm', false];
                this.text = 'У вас нет неподтвержденных заявок';
                this.var_to_hide = '.confirm_friend';
            }
            if(document.URL.indexOf('new_requests') != -1){
                this.char_to_check = ['_new', true];
                this.text = 'У вас нет новых заявок';
                this.var_to_hide = '.kill_friend';
            }
            this.getMyFriends(id);
        },
        pushUser: function(){
            var that = this;
            this.user_action.object.once('user_is_fetched', function(myFriend) {
                if(that.my_friends[that.my_friends.length - 1] != myFriend){
                    that.count++;
                    that.my_friends.push(myFriend);
                    if(that.count ==  that.num_of_friends){
                        that.render();
                    }
                }
                else{
                    that.pushUser();
                }
            });
        },
        getMyFriends: function(id){
            var that = this;
            this.user_action = new RequestsUser();
            this.user_action.getUser(id);
            this.user_action.object.once('user_is_fetched', function(user){
                var friends = user.get('friends');
                that.num_of_friends = 0;
                that.count = 0;
                friends.forEach(function(index){
                    if(index[that.char_to_check[0]] == that.char_to_check[1]){
                        that.num_of_friends++;
                        that.user_action.getUser(index.id);
                        that.pushUser();
                    }
                });
                if(that.num_of_friends == 0){
                    that.$el = $('#content');
                    var compiledTemplate = _.template(itIsEmptyTemplate);
                    that.$el.html(compiledTemplate({msg: that.text}));
                }
            });
            return this;
        },
        render: function(){
            this.$el = $('#content');
            var compiledTemplate = _.template(containerForFriends);
            this.$el.html(compiledTemplate);
            this.$el = $('#my_friends_list');
            var that = this;
            this.my_friends.forEach(function(index){
                var compiledTemplate = _.template(myFriendsTemplate);
                that.$el.append(compiledTemplate(index.attributes));
            });
            $(this.var_to_hide).hide();
        }
    });
    return MyFriendsView;
});




























