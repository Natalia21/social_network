define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/users_list.html',
    '../models/user_model',
    '../collections/users_collection',
    './requests_owner',
    'text!/templates/search_line.html',
    'text!/templates/container_for_users.html'
], function($, _, Backbone, userListTemplate, UserModel, UsersCollection, RequestsOwner, searchLineTemplate, containerForUsers){
    var GetUsersView = Backbone.View.extend({
        initialize: function(){
            var that = this;
            this.$el = $('#content');
            this.$el.html(_.template(searchLineTemplate));
            App.Collections.users = new UsersCollection();
            this.owner_action = new RequestsOwner();
            this.owner_action.getOwner();
            this.owner_action.object.once('owner_is_fetched', function(owner){
                that.getUsers(owner);
            });
        },
        events: {
            'click .write_msg': 'writeMsg'
        },
        getUsers: function(owner){
            var that = this;
            App.Collections.users.fetch({
                success: function(model, response){
                    var id_to_remove;
                    response.forEach(function(el, index){
                            if (el._id != owner.id) {
                                model.models[index].set({
                                    id: el._id,
                                    email: el.email,
                                    first_name: el.first_name,
                                    last_name: el.last_name
                                });
                            }
                            else {
                                id_to_remove = model.models[index].cid;
                            }
                    });
                    if(id_to_remove){
                        model.remove(id_to_remove);
                    }
                    that.render(owner);
                }
            });
        },
        render: function(owner){
            this.$el = $('#forUL');
            this.$el.html(_.template(containerForUsers));
            this.$el = $('#list');
            var that = this;
            var user_is_friend;
            App.Collections.users.models.forEach(function(el){
                var compiledTemplate = _.template(userListTemplate);
                that.$el.append(compiledTemplate(el.attributes));
                el.attributes.friends.forEach(function(element){
                    if(element.id == owner.get('id') && element.confirm != false){
                        user_is_friend = true;
                    }
                });
                if(!user_is_friend){
                    $('#' + el.attributes.id + 'kill_friend').hide();
                }
                else{
                    $('#' + el.attributes.id + 'friend').hide();
                }
                user_is_friend = false;
            });
            return this;
        }
    });
    return GetUsersView;
});