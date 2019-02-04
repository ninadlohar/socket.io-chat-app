// client side

var socket = io();

socket.on('connect', function() {
  console.log('client connected to server')
})

socket.on('disconnect', function() {
  console.log('client disconnect')
})

socket.on('newMessage', function(message) {
  var template = jQuery('#message-template').html()
  var formattedTime = moment(message.createdAt).format('h:mm a')
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  })
  jQuery('#messages').append(html)
})

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault()
  var messageTextBox = jQuery('[name=message]')
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function() {
    messageTextBox.val('')
  })
})

socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a')
  var template = jQuery('#location-message-template').html()
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  })
  jQuery('#messages').append(html)
})

var locationButton = jQuery('#send-location')
locationButton.on('click', function() {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser')
  }
  locationButton.attr('disabled', 'disabled').text('Sending Location...')
  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.removeAttr('disabled').text('Sending Location')
    socket.emit('createLocationMessage', {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude
    })
  }, function() {
    locationButton.removeAttr('disabled').text('Sending Location')
    alert('Unable to fetch location')
  })
})