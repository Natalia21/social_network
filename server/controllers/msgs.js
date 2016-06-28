var Server   = require('../../server'),
    io       = Server.io,
    moment   = require('moment'),
    config   = require('../../config'),
    client   = require('redis').createClient(config.redis),
    Msg      = require('../models/msg'),
    Dialogue = require('../models/dialogue'),
    User     = require('../models/user');

io.on('connection', function (socket) {
    socket.on('add_user', function (data) {
        if ( data.id ) {
            socket.user_id = data.id;
            client.set(socket.user_id, socket.id);
        }
    });

    socket.on('send_msg', function (data) {
        var user_from = socket.user_id,
            user_to   = data.to;

        client.get(data.to, function (err, to_socket_id) {
            if ( err ) throw err;

            if ( io.sockets.connected[to_socket_id] ) {
                var find_data  = {'_id': user_from},
                    conditions = {'last_name': 1, 'first_name': 1};

                User.findOne(find_data, conditions, function (err, user) {
                    if ( err ) throw err;
                    var msg = {
                        'from': user,
                        'text': data.text,
                        'time': moment()
                    };
                    io.sockets.connected[to_socket_id].emit('message_to_user', msg);
                });
            }
        });
        var msg = new Msg({
            'from': user_from,
            'to':   user_to,
            'text': data.text,
            'time': moment()
        });

        msg.save(function (err) {
            if ( err ) throw err;

            var msg_id = msg._id;

            var find_data   = {'participants': {'$all': [user_from, user_to]}},
                update_data = {'$push': {'msgs': msg_id}};

            Dialogue.findOne(find_data, function (err, data) {
                if ( err ) throw err;
                if ( data ) {
                    find_data = {'_id': data._id};
                    Dialogue.update(find_data, update_data, function (err) {
                        if ( err ) throw err;
                    });
                } else {
                    var dialogue = new Dialogue({
                        'participants': [user_from, user_to],
                        'msgs': [msg_id]
                    });
                    dialogue.save(function (err) {
                        if ( err ) throw err;
                    });
                }
            });
        });
    });

    socket.on('disconnect_user', function () {
        socket.disconnect();
    });

    socket.on('disconnect', function() {
        if ( socket.user_id ) {
            client.del(socket.user_id, function (err) {
                if ( err ) throw err;
            });
        }
    });

});

var populate_data  = 'msgs',
    populate_fields = {
                        'path': 'msgs.from msgs.to',
                        'select': 'first_name last_name',
                        'model': 'User'
                    };

module.exports = {
    getDialogues: function (req, res) {
        var user_id         = req.session.user_id,
            find_data       = {'participants': {'$in': [user_id]}},
            conditions      = {'msgs': {'$slice': -1}, 'participants': 0};

        Dialogue.find(find_data, conditions)
                .populate(populate_data)
                .lean()
                .exec(function (err, data) {
                    if ( err ) throw err;
                    Dialogue.populate(data, populate_fields, function (err, data) {
                        if ( err ) throw err;
                        res.send(data);
                    });
                 });

    },

    getDialogue: function (req, res) {
        var find_data  = {'_id': req.params.id};

        Dialogue.findOne(find_data)
                .populate(populate_data)
                .lean()
                .exec(function (err, data) {
                    if ( err ) throw err;
                    Dialogue.populate(data, populate_fields, function (err, data) {
                        if ( err ) throw err;
                        res.send(data);
                    });
                 });
    }
};
