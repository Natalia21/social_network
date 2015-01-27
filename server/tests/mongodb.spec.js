describe('MongoDB', function() {
    it('is there a server running', function(next) {
        var mongoose = require('mongoose');
        mongoose.connect('mongodb://localhost/test', function(err) {
            expect(err).toBeFalsy();
            next();
        });
    });
});