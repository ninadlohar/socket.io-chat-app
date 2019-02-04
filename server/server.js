const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('new user connected')
  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Room Name and Username is required')
    }
    socket.join(params.room)
    /** emits message to everyone */
    users.removeUser(socket.id)
    users.addUser(socket.id, params.name, params.room)
    io.to(params.room).emit('updateUserList', users.getUserList(params.room))
    socket.emit('newMessage', generateMessage('Admin', 'Welcome To Chat App'))
    /** emits message to everyone except me within the room */
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`))
    callback()
  })

  socket.on('createMessage', (message, callback) => {
    io.emit('newMessage', generateMessage(message.from, message.text))
    callback();
  })

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
  })

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id)
    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room))
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`))
    }
    console.log('user was disconnected')
  })

})


server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
