define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/error.html'
], function($, _, Backbone, ErrorTemplate){
    var ValidationView = Backbone.View.extend({
        el: $('#container'),
        initialize: function () {
            $('input').focus(function(e){
                $('#' + e.target.id).removeClass('error');
                $('#' + e.target.id + '_error').remove();
            });
        },
        handleError: function(model, error){
            var that = this;
            var width = $('form').css('width').split('px')[0];
            var left = $('#' + error[0].attr).offset().left;
            error.forEach(function(index){
                $('#' + index.attr).addClass('error');
                var top = $('#' + index.attr).offset().top;
                var template = _.template(ErrorTemplate);
                $(that.el).append(template({msg: index.msg, id: index.attr + '_error'}));
                var elems = $('.validation_error');
                $(elems[elems.length - 1]).offset({top: top, left: left + parseInt(width) + 10});
            });
        }
    });
    return ValidationView;
});