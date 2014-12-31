define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/my_friends.html',
    '../models/user_model'
], function($, _, Backbone, myFriendsTemplate, UserModel){
    var MyFriendsView = Backbone.View.extend({
        el:  $('#content'),
        confirm_friends: [],
        initialize: function(id){
            this.confirm_friends = [];
            console.log('id = ' + id);
            this.render(id);
        },
        render: function(id){
            var that = this;
            var getFriends = new UserModel({id: id});
            getFriends.fetch({
                success: function(model, response){
                    if(response[0]){
                        model.set({
                            id: response[0]._id,
                            email: response[0].email,
                            password: response[0].password,
                            first_name: response[0].first_name,
                            last_name: response[0].last_name,
                            friends: response[0].friends
                        });
                    }
                },
                error: function(model,response){
                    console.log(response);
                }
            }).then(function(){
                var friends = getFriends.get("friends");
                console.log(friends);
                var num_of_confirm_friends = 0;
                var count = 0;
                friends.forEach(function(index){
                    if(index.confirm == true){
                        num_of_confirm_friends++;
                        var myFriend = new UserModel({id: index.id});
                        myFriend.fetch({
                            success: function(model, response){
                                if(response[0]){
                                    model.set({
                                        id: response[0]._id,
                                        email: response[0].email,
                                        password: response[0].password,
                                        first_name: response[0].first_name,
                                        last_name: response[0].last_name,
                                        friends: response[0].friends
                                    });
                                }
                            },
                            error: function(model,response){
                                console.log(response);
                            }
                        }).then(function(){
                            count++;
                            that.confirm_friends.push(myFriend);
                        }).then(function(){
                            if(count ==  num_of_confirm_friends){
                                that.showList();
                            }
                        })
                    }
                });
                if(num_of_confirm_friends == 0){
                    var compiledTemplate = _.template('<h2>У вас пока нет друзей</h2>');
                    that.$el.html(compiledTemplate);
                }
            });
            return this;
        },
        showList: function(){
            var compiledTemplate = _.template('<ul class = "nav users_list" id = "my_friends_list"></ul>');
            this.$el.html(compiledTemplate());
            this.$el = $('#my_friends_list');
            var that = this;
            this.confirm_friends.forEach(function(index){
                var compiledTemplate = _.template(myFriendsTemplate);
                that.$el.append(compiledTemplate(index.attributes));
            });
            $(".addFriend").hide();

        }
    });
    return MyFriendsView;
});




























