// client side

var socket = io();

socket.on('connect', function() {
  console.log('client connected to server')
})

socket.on('disconnect', function() {
  console.log('client disconnect')
})

socket.on('newMessage', function(message) {
  var li = jQuery('<li></li>');
  var formattedTime = moment(message.createdAt).format('h:mm a')
  li.text(`${message.from}: ${formattedTime} ${message.text}`)
  jQuery('#messages').append(li)
})

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault()
  var messageTextBox = jQuery('[name=message]').val()
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function() {
    messageTextBox.val('')
  })
})

socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a')
  var li = jQuery(`<li></li>`)
  var a = jQuery('<a target="_blank">My current location</a>')
  li.text(`${message.from}: ${formattedTime}`);
  a.attr('href', message.url)
  li.append(a)
  jQuery('#messages').append(li)
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