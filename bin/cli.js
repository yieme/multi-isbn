#!/usr/local/bin/node

var isbnSearch = require('../index.js')
var convar     = require('convar')
var options    = {
  isbndb_key:      convar('isbndb_key'),
  google_book_key: convar('google_book_key')
}
isbnSearch.init(options)


function help(msg) {
  var pkg = require('../package.json')
  if (msg) {
    console.error(msg)
    console.log('')
  }
  console.error(pkg.name, '- v' + pkg.version)
  console.error(pkg.description)
  console.log('')
  console.error('Usage:', pkg.name, '--isbn ISBN10 || ISBN13')
  console.log('')
  console.error('Example: ', pkg.name, '--isbn 9781595231123')
  process.exit(1)
}

var isbn = convar('isbn')
if (!isbn || isbn.length < 1) help()

isbnSearch.find(isbn, function(err, data) {
  if (err) help(err.message)
  console.log(JSON.stringify(data, null, 2))
})
