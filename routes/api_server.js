var express = require('express');
var shared = require('../shared');

var router = express.Router();

router.get('/info', function(req, res) {

    res.json({
        error: false,
        serverInfo: {
            port: process.env.PORT || 3000
        }
    });
});

module.exports = router;