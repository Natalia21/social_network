define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/header.html',
    '../models/user_model'
], function($, _, Backbone){
    var AddFriendView = Backbone.View.extend({
        el: $("#container"),
        initialize: function () {

        },
        handleError: function(model, error){
            console.log(error);

            $('form').css('height');
            console.log($('form').css('height'));
            this.$el.append(_.template('<div class="validation_error" id = "list"></div>'));
            $('.validation_error').css('height', $('form').css('height'));
            $('.validation_error').css('width', $('form').css('width'));

            error.forEach(function(index){
                console.log(index.attr);
                console.log($("#" + index.attr));
                console.log($("#" + index.attr).css('border'));
                $("#" + index.attr).css('border', 1 + 'px solid red');
                console.log($("#" + index.attr).css('border'));
                console.log($("#" + index.attr).css('top'));
                console.log($("#" + index.attr).css('left'));
                $('.validation_error').css('margin-bottom', $('form').css('width'));
            });


            this.$el = $('.validation_error');


        }
    });
    return AddFriendView;
});