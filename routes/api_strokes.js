var express = require('express');
var shortid = require('shortid');
var shared = require('../shared');

var router = express.Router();

router.post('/submit', function(req, res) {
   
    if (!res.user) {
        res.json({
            error: true,
            message: 'socketId not found in list of users'
        });
        
        return;
    }
    
    // Create stroke
    var stroke = {
        strokeId: shortid.generate(),
        username: res.user.username,
        cursorData: req.body.cursorData,
        lineWidth: req.body.lineWidth,
        lineColor: req.body.lineColor
    };
    
    // Save the new stroke
    shared.strokes.push(stroke);

    // Broadcast the new stroke
    shared.io.sockets.emit('userBroadcastsStroke', stroke);

    res.json({
        error: false,
        message: ''
    });
});

router.get('/list', function(req, res) {

    res.json({
        error: false,
        strokes: shared.strokes
    });
});

router.get('/clear', function(req, res) {

    if (!res.user) {
        res.json({
            error: true,
            message: 'socketId not found in list of users'
        });
        
        return;
    }
    
    var message = {
        messageType: 'userClearedStrokes',
        timestamp: new Date(),
        user: {
            userId: res.user.userId,
            username: res.user.username,
        }
    };

    // Clear strokes
    shared.strokes.length = 0;

    // Broadcast
    shared.io.sockets.emit('userClearedStrokes', {
        message: message
    });

    res.json({
        error: false
    });
});

router.get('/delete', function(req, res) {

    if (!res.user) {
        res.json({
            error: true,
            message: 'socketId not found in list of users'
        });
        
        return;
    }

    // Delete stroke
    for (var i = 0; i < shared.strokes.length; i++) {
        if (shared.strokes[i].strokeId == req.query.strokeId) {
            shared.strokes.splice(i, 1);
        }
    }
    
    var message = {
        messageType: 'userDeletedStroke',
        timestamp: new Date(),
        user: {
            userId: res.user.userId,
            username: res.user.username,
        }
    };

    // Broadcast
    shared.io.sockets.emit('userDeletedStroke', {
        message: message,
        strokes: shared.strokes
    });

    res.json({
        error: false
    });
});

module.exports = router;