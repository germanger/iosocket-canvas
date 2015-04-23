var express = require('express');
var shared = require('../shared')

var router = express.Router();

router.get('/info', function(req, res) {

    res.json({
        'error': false,
        'info': {
            'port': process.env.PORT || 3000
        }
    });
});

router.get('/login', function(req, res) {

    res.json({
        'error': false,
        'message': ''
    });
});

router.get('/logout', function(req, res) {

    if (!res.user) {
        res.json({
            'error': true,
            'message': 'socketId not found in list of users'
        });
        
        return;
    }
    
    for (var i = 0; i < shared.users.length; i++) {
        if (shared.users[i].socketId == req.query.socketId) {
            shared.users.splice(i, 1);
        }
    }
    
    // Broadcast
    shared.io.sockets.emit('serverUpdatedUsersList', {
        users: shared.users
    });

    res.json({
        'error': false,
        'message': ''
    });
});

router.get('/list', function(req, res) {

    var users = [];
    
    for (i = 0; i < shared.users.length; i++) {
        users.push({
            'username': shared.users[i].username
        });
    }
    
    res.json({
        'error': false,
        'users': users
    });
});

module.exports = router;