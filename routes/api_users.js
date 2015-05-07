var express = require('express');
var shared = require('../shared');
var _ = require('underscore');

var router = express.Router();

router.get('/list', function(req, res, next) {
   
    res.json({
        error: false,
        users: _.chain(shared.users)
        .map(function (user) {
            return {
                userId: user.userId,
                username: user.username,
                isTyping: user.isTyping
            }
        }),
    });
});

router.get('/rename', function(req, res, next) {

    if (!res.user) {
        return next(new Error('socketId not found in list of users'));
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
        users: _.chain(shared.users)
        .map(function (user) {
            return {
                userId: user.userId,
                username: user.username,
                isTyping: user.isTyping
            }
        }),
        message: message
    });

    res.json({
        error: false,
        message: ''
    });
});

router.get('/updateIsTyping', function(req, res, next) {

    if (!res.user) {
        return next(new Error('socketId not found in list of users'));
    }
    
    res.user.isTyping = JSON.parse(req.query.isTyping);
       
    // Broadcast
    shared.io.sockets.emit('userUpdatedIsTyping', {
        users: _.chain(shared.users)
        .map(function (user) {
            return {
                userId: user.userId,
                username: user.username,
                isTyping: user.isTyping
            }
        }),
    });

    res.json({
        error: false,
        message: ''
    });
});

module.exports = router;