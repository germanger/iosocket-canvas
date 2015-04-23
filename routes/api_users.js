var express = require('express');
var shared = require('../shared')

var router = express.Router();

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
    
    shared.io.sockets.connected[req.query.socketId].disconnect();

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