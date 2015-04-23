# iosocket-canvas
A collaborative drawing canvas (with chat)

## Server side

- Node.JS
- Express
- socket.io

### Routes:

- `'/'` : Endpoint for connecting to the socket.io server
- `'/'` : Also returns `index.html` (angular app)
- `'/api/users/list'` : List of connected users
- `'/api/users/logout'` : Expects a socketId parameter. Kills that socket.
- `'/api/messages/list'` : List of messages
- `'/api/messages/submit'` : Expects a `socketId` parameter and a `body` parameter
- `'/api/messages/clear'` : Expects a `socketId`. Clears all messages.
- `'/api/strokes/list'` : List of strokes
- `'/api/strokes/submit'` : Expects a `socketId` and a JSON body (`req.body`), containing the stroke data
- `'/api/strokes/clear'` : Expects a `socketId`. Clears all strokes.
- `'/api/server/info'` : Returns info about the server (eg. port)

## Client side

- Angular
- Angular's Boostrap UI
- HTML 5 (canvas)
- socket.io
- toaster (notifications)
- scrollglue (scroll to bottom of divs)

