const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('new user connected')

  /** emits message to everyone */
  socket.emit('newMessage', generateMessage('Admin', 'Welcome To Chat App'))
  
  /** emits message to everyone except me */
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'))

  socket.on('createMessage', (message, callback) => {
    io.emit('newMessage', generateMessage(message.from, message.text))
    callback('This is from the server.');
  })

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
  })

  socket.on('disconnect', () => {
    console.log('user was disconnected')
  })

})


server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
