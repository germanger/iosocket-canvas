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
    
    // Create stroke
    var stroke = {
        'username': res.user.username,
        'cursorData': req.body.cursorData,
        'lineWidth': req.body.lineWidth,
        'lineColor': req.body.lineColor
    };
    
    // Save the new stroke
    shared.strokes.push(stroke);

    // Broadcast the new stroke
    shared.io.sockets.emit('serverBroadcastsUserStroke', stroke);

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