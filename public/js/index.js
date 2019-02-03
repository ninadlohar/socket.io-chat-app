// client side

var socket = io();

socket.on('connect', function() {
  console.log('client connected to server')
})

socket.on('disconnect', function() {
  console.log('client disconnect')
})

socket.on('newMessage', function(message) {
  console.log('newMessage', message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`)
  jQuery('#messages').append(li)
})

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault()
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function() {

  })
})

var locationButton = jQuery('#send-location')
locationButton.on('click', function() {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser')
  }
  navigator.geolocation.getCurrentPosition(function(position) {
    socket.emit('createLocationMessage', {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude
    })
  }, function() {
    alert('Unable to fetch location')
  })
})