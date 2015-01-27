var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/test', function (err) {
    if (err) {
        console.log('error in conecting with database')
    } else {
        console.log('successfully connected to the database');
    }
});