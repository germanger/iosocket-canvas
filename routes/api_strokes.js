var express = require('express');
var shared = require('../shared')

var router = express.Router();

router.post('/submit', function(req, res) {
   
    if (!res.user) {
        res.json({
            'error': true,
            'message': 'socketId not found in list of users'
        });
        
        return;
    }

    // Save the new stroke
    shared.strokes.push({
        'username': res.user.username,
        'stroke': req.body
    });

    // Broadcast the new stroke
    shared.io.sockets.emit('serverBroadcastsUserStroke', {
        username: res.user.username,
        stroke: req.body
    });

    res.json({
        'error': false,
        'message': ''
    });
});

router.get('/list', function(req, res) {

    res.json({
        'error': false,
        'strokes': shared.strokes
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

    // Clear strokes
    shared.strokes.length = 0;

    // Broadcast
    shared.io.sockets.emit('serverBroadcastsClearStrokes', {
        username: res.user.username
    });

    res.json({
        'error': false
    });
});

module.exports = router;