define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/my_friends.html',
    '../models/user_model'
], function($, _, Backbone, MyFriendsTemplate, UserModel){
    var RefRequestsView = Backbone.View.extend({
        el:  $('#content'),
        id: '',
        new_friends: [],
        initialize: function(id){
            this.new_friends = [];
            this.id = id;
            this.render();
        },
        events:{
            'click .addFriend': 'addFriend'
        },
        render: function(){
            var that = this;
            var getFriends = new UserModel({id: this.id});
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
                var num_of_new_friends = 0;
                var count = 0;
                friends.forEach(function(index){
                    if(index._new == true){
                        num_of_new_friends++;
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
                            that.new_friends.push(myFriend);
                        }).then(function(){
                            if(count ==  num_of_new_friends){
                                that.showList();
                            }
                        });
                    }
                });
                if(num_of_new_friends == 0){
                    var compiledTemplate = _.template('<h2>У вас нет новых заявок</h2>');
                    that.$el.html(compiledTemplate);
                }
            });
            return this;
        },
        showList: function(){
            var compiledTemplate = _.template('<ul class = "nav users_list" id = "my_friends_list"></ul>');
            this.$el.html(compiledTemplate);
            this.$el = $('#my_friends_list');
            var that = this;
            this.new_friends.forEach(function(index){
                var compiledTemplate = _.template(MyFriendsTemplate);
                that.$el.append(compiledTemplate(index.attributes));
            });
            $(".kill_friend").hide();
        },
        addFriend: function(e){
            console.log('in new_req_view');
            var that = this;
            var addUserModel = new UserModel({id: this.id});
            addUserModel.save({friends: {id: e.target.id.split('friend')[0], confirm: true, _new: false}},{
                success: function(){
                    var addedUser = new UserModel({id: e.target.id.split('friend')[0]});
                    addedUser.save({friends: {id: that.id, confirm: true, _new: false}});
                    $("#" + e.target.id.split('friend')[0]).remove();
                    console.log('$("#my_friends_list")');
                    console.log($("#my_friends_list"));
                /*    if(!$("#my_friends_list").lastChild){
                        var compiledTemplate = _.template('<h2>У вас нет новых заявок</h2>');
                        this.$el = $("#content");
                        this.$el.html(compiledTemplate);
                    }*/
                }
            })
        }
    });
    return RefRequestsView;
});

































