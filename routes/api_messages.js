var express = require('express');
var shared = require('../shared');
var _ = require('underscore');

var router = express.Router();

router.get('/list', function(req, res, next) {

    res.json({
        error: false,
        messages: shared.messages
    });
});

router.get('/submit', function(req, res, next) {

    if (!res.user) {
        return next(new Error('socketId not found in list of users'));
    }
    
    // Create message
    var message = {
        messageType: 'userBroadcastsMessage',
        timestamp: new Date(),
        user: {
            userId: res.user.userId,
            username: res.user.username,
        },
        chatMessage: {
            body: req.query.body
        }
    };

    // Save the new message
    shared.messages.push(message);
    
    // Broadcast the new message
    shared.io.sockets.emit('userBroadcastsMessage', message);

    res.json({
        'error': false
    });
});

router.get('/clear', function(req, res, next) {

    if (!res.user) {
        return next(new Error('socketId not found in list of users'));
    }

    // Clear messages
    shared.messages.length = 0;
    
    // Log
    var message = {
        messageType: 'userClearedMessages',
        timestamp: new Date(),
        user: {
            userId: res.user.userId,
            username: res.user.username
        }
    };
    
    shared.messages.push(message);

    // Broadcast
    shared.io.sockets.emit('userClearedMessages', {
        message: message
    });

    res.json({
        error: false
    });
});

module.exports = router;