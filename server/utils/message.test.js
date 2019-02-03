var expect = require('expect')
var { generateLocationMessage } = require('./message');

describe('generateLocationMessage', () => {
  it('should generate correct location', () => {
    var from = 'Deb';
    var lat = 15;
    var long = 19
    var url = 'https://www.google.com/maps?q=15,19';
    var message = generateLocationMessage(from, lat, long);
    expect(message.createdAt).toBeA('number')
    expect(message).toInclude({from, url})
  })
})