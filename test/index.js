var should       = require('chai').should()
var  multiIsbn   = require('..')
var pkg          = require('../package.json')
var expectedData = {
  "data": [
    {
      "title": "One Nation",
      "publisher": "Sentinel",
      "publishedDate": "2014-05-20",
      "language": "en",
      "authors": [
        "Ben Carson",
        "Candy Carson"
      ]
    }
  ],
  "via": ["google", pkg.name + '@' + pkg.version]
}
var expectedJson = JSON.stringify(expectedData)


describe('multi-isbn', function() {
  it('should match json', function(done) {
    multiIsbn.init()
    multiIsbn.find('9781595231123', function(err, data) {
      if (err) throw err
      data = JSON.stringify(data)
      data.should.equal(expectedJson);
      done()
    })
  })
})
