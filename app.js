// Modules used in this file
var http = require('http');
var express = require('express'), app = module.exports.app = express();
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var shortid = require('shortid');
var server = http.createServer(app);
var shared = require('./shared');

// A default engine is required, even though we render plain html
app.set('views', './public');
app.set('view engine', 'ejs');

// Socket.io
shared.io = require('socket.io').listen(server);

shared.io.sockets.on('connection', function (socket) {
    var userId = shortid.generate();
    
    var user = {
        userId: userId,
        socketId: socket.id,
        username: userId,
    };
    
    shared.users.push(user);
    
    // Respond to him
    socket.emit('welcome', user);

    // Broadcast
    shared.io.sockets.emit('userConnected', {
        user: user,
        users: shared.users
    });
    
    socket.on('disconnect', function() {
        for (var i = 0; i < shared.users.length; i++) {
            if (shared.users[i].socketId == socket.id) {               
                
                var user = shared.users[i];
                
                shared.users.splice(i, 1);
                
                // Broadcast
                shared.io.sockets.emit('userDisconnected', {
                    user: user,
                    users: shared.users
                });
            }
        }
    });
});

// Start server
server.listen(process.env.PORT || 3000);

// Middleware: app.use([path], f),
//    [path] is optional, default is '/'
//    f acts as a middleware function to be called when the path matches
// The order of which middleware are defined is important (eg. move logger down)
app.use('/', bodyParser.json());
app.use('/', bodyParser.urlencoded());
app.use('/', cookieParser('cookieSecret'));
app.use('/', express.static('./public')); // Serve any file under /public
app.use('/', logger('dev'));

// My middleware (It is a sort of "base controller")
// Executed in every "/api/.*" request, after all the previous app.use(),
// unless those app.use() finish the cycle (for example getting /img/logo.png will finish there)
app.use('/api/', function(req, res, next) {

    res.user = undefined;
    
    if (req.query.socketId != null) {
        for (var i = 0; i < shared.users.length; i++) {
            if (shared.users[i].socketId == req.query.socketId) {
                res.user = shared.users[i];
            }
        }
    }

    next();
});

// Router
app.use('/', require('./routes/viewsRoutes'));
app.use('/api/users', require('./routes/api_users'));
app.use('/api/messages', require('./routes/api_messages'));
app.use('/api/strokes', require('./routes/api_strokes'));
app.use('/api/server', require('./routes/api_server'));

// development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        
        res.json({
            error: true,
            message: err.message
        });
    });
}

// production error handler (no stacktraces leaked to user)
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    
    res.json({
        error: true,
        message: err.message
    });
});

module.exports = app;

console.log("Running...");