const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('new user connected')

  socket.emit('newMessage', generateMessage('Admin', 'Welcome To Chat App'))
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'))

  socket.on('createMessage', (message) => {
    console.log(`createdMessage received from client`, message)
    io.emit('newMessage', generateMessage(message.from, message.text))
    // socket.broadcast.emit('newMessage', { // i am not going to receive msg
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()   
    // })
  })

  socket.on('disconnect', () => {
    console.log('user was disconnected')
  })

})


server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
