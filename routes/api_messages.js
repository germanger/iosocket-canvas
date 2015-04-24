var express = require('express');
var shared = require('../shared')

var router = express.Router();

router.get('/list', function(req, res) {

    res.json({
        'error': false,
        'messages': shared.messages
    });
});

router.get('/submit', function(req, res) {

    if (!res.user) {
        res.json({
            'error': true,
            'message': 'socketId not found in list of users'
        });
        
        return;
    }
    
    // Create message
    var message = {
        'username': res.user.username,
        'body': req.query.body
    };

    // Save the new message
    shared.messages.push(message);
    
    // Broadcast the new message
    shared.io.sockets.emit('serverBroadcastsUserMessage', message);

    res.json({
        'error': false
    });
});

router.get('/clear', function(req, res) {

    if (!res.user) {
        res.json({
            'error': true,
            'message': 'socketId not found in list of users'
        });
        
        return;
    }

    // Clear messages
    shared.messages.length = 0;

    // Broadcast
    shared.io.sockets.emit('serverBroadcastsClearMessages', {
        'username': res.user.username
    });

    res.json({
        'error': false
    });
});

module.exports = router;