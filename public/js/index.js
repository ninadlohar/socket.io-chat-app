// client side

var socket = io();

socket.on('connect', function() {
  console.log('client connected to server')
})

socket.on('disconnect', function() {
  console.log('client disconnect')
})

socket.on('newMessage', function(message) {
  console.log('newMessage', message)
})
