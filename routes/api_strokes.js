var express = require('express');
var shortid = require('shortid');
var shared = require('../shared');
var _ = require('underscore');

var router = express.Router();

router.post('/submit', function(req, res, next) {
   
    if (!res.user) {
        return next(new Error('socketId not found in list of users'));
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
    shared.strokes[stroke.strokeId] = stroke;

    // Broadcast the new stroke
    shared.io.sockets.emit('userBroadcastsStroke', stroke);

    res.json({
        error: false,
        message: ''
    });
});

router.get('/list', function(req, res, next) {

    res.json({
        error: false,
        strokes: _.chain(shared.strokes)
        .map(function (stroke) {
            return stroke;
        }),
    });
});

router.get('/clear', function(req, res, next) {

    if (!res.user) {
        return next(new Error('socketId not found in list of users'));
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

router.get('/delete', function(req, res, next) {

    if (!res.user) {
        return next(new Error('socketId not found in list of users'));
    }

    if (!(req.query.strokeId in shared.strokes)) {
        res.json({
            error: true,
            message: 'strokeId not found in list of strokes'
        });
        
        return;
    }
    
    // Delete stroke  
    delete shared.strokes[req.query.strokeId];
    
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
        strokes: _.chain(shared.strokes)
        .map(function (stroke) {
            return stroke;
        }),
    });

    res.json({
        error: false
    });
});

module.exports = router;