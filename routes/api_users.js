var express = require('express');
var shared = require('../shared');

var router = express.Router();

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
    
    var oldUsername = res.user.username;
    res.user.username = req.query.username;
    
    var message = {
        messageType: 'userChangedName',
        timestamp: new Date(),
        user: {
            userId: res.user.userId,
            username: res.user.username
        },
        data: {
            oldUsername: oldUsername,
            newUsername: res.user.username
        }
    };
    
    shared.messages.push(message);
    
    // Broadcast
    shared.io.sockets.emit('userChangedName', {
        users: shared.users,
        message: message
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