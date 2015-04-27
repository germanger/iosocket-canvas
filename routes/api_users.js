var express = require('express');
var shared = require('../shared');

var router = express.Router();

router.get('/login', function(req, res) {

    res.json({
        error: false,
        message: ''
    });
});

router.get('/logout', function(req, res) {

    if (!res.user) {
        res.json({
            error: true,
            message: 'socketId not found in list of users'
        });
        
        return;
    }
    
    shared.io.sockets.connected[req.query.socketId].disconnect();

    res.json({
        error: false,
        message: ''
    });
});

router.get('/list', function(req, res) {

    var users = [];
    
    for (i = 0; i < shared.users.length; i++) {
        users.push({
            username: shared.users[i].username
        });
    }
    
    res.json({
        error: false,
        users: users
    });
});

router.get('/rename', function(req, res) {

    if (!res.user) {
        res.json({
            error: true,
            message: 'socketId not found in list of users'
        });
        
        return;
    }
    
    if (req.query.username == '') {
        res.json({
            error: true,
            message: 'Blank name is not allowed'
        });
        
        return;
    }
    
    res.user.username = req.query.username
    
    // Log
    /*var log = {
        timestamp: new Date(),
        user: {
            userId: res.user.userId,
            username: res.user.username
        },
        message: 'Changed his name'
    };
    
    shared.logs.push(log);*/
    
    // Broadcast
    shared.io.sockets.emit('userChangedName', {
        users: shared.users,
        //log: log
    });

    res.json({
        error: false,
        message: ''
    });
});

router.get('/updateIsTyping', function(req, res) {

    if (!res.user) {
        res.json({
            error: true,
            message: 'socketId not found in list of users'
        });
        
        return;
    }
    
    res.user.isTyping = JSON.parse(req.query.isTyping);
       
    // Broadcast
    shared.io.sockets.emit('userUpdatedIsTyping', {
        users: shared.users,
    });

    res.json({
        error: false,
        message: ''
    });
});

module.exports = router;