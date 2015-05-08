/** Find books by ISBN from isbndb, google, open library and worldcat
 *
 *  @copyright  Copyright (C) 2015 by Yieme
 *  @module     multi-isbn
 */
 'use strict';

var ISBNDB_URT = 'https://isbndb.com/api/v2/json/$KEY/book/$ISBN'
var GOOGLE_BOOK_URT = 'https://www.googleapis.com/books/v1/volumes?q=isbn:$ISBN'
var request = require('request')
var ISBNDB_URL
var GOOGLE_BOOK_URL
var http = require('http')
var IsbnDbMap = {
  'publisher_name': 'publisher',
  'isbn10': 'isbn10',
  'isbn13': 'isbn13',
  'lcc_number': 'lcc',
  'edition_info': 'edition',
  'title': 'title',
  'language': 'language',
}
var GoogleBookMap = {
  'title': 'title',
//  'subtitle': 'subtitle',
  'publisher': 'publisher',
  'publishedDate': 'publishedDate',
  'language': 'language',
  'pageCounts': 'pages',
  'authors': 'authors'
}
var pkg = require('./package.json')

/** Multi isbn
 *  @constructor
 *  @param      {object} options - The options
 *  @return     {object}
 */
function init(options) {
  options = options || {}
  if (options.isbndb_key) {
    ISBNDB_URL = ISBNDB_URT.replace('$KEY', options.isbndb_key)
  }
  if (options.google_book_key) {
    GOOGLE_BOOK_URL = GOOGLE_BOOK_URT.replace('$KEY', options.google_book_key)
  } else {
    GOOGLE_BOOK_URL = GOOGLE_BOOK_URT
  }
}


function remapData(data, map) {
  var result = {}
  for (var i in map) {
    if (i) {
      var dataRow = data[i]
      if (dataRow) {
        if (typeof dataRow != 'string' || dataRow.length > 0) {
          result[map[i]] = dataRow
        }
      }
    }
  }
  return result
}



function isbnDbPackage(data) {
  var result = { data: [] }
  for (var i=0, len=data.length; i<len; i++) {
    var row = remapData(data[i], IsbnDbMap)
    row.authors = []
    var authors = data[i].author_data
    for (var a=0, alen=authors.length; a<alen; a++) {
      if (authors[a].name) {
        row.authors.push(authors[a].name)
      }
    }
    result.data.push(row)
  }
  result.via = ['isbndb', pkg.name + '@' + pkg.version]
  return result
}

function googleBookPackage(data) {
  if (!data) {
    return { error: "Not Found" }
  }
  var result = { data: [] }
  for (var r=0, len=data.length; r<len; r++) {
    var rowData  = data[r].volumeInfo
    var row      = remapData(rowData, GoogleBookMap)
    var idents   = rowData.industryIdentifiers
    for (var i=0, ilen=idents; i<ilen; i++) {
      var ident   = idents[a]
      if (ident.type == 'ISBN_10') {
        row.isbn10 = ident.identifier
      } else if (ident.type == 'ISBN_13') {
        row.isbn13 = ident.identifier
      }
    }
    result.data.push(row)
  }
  result.via = ['google', pkg.name + '@' + pkg.version]
  return result
}



function standardizeError(error, statusCode) {
  if (!error && statusCode != 200) {
    var msg = http.STATUS_CODES[statusCode] || 'Unknown'
    error = new Error(msg)
  }
  return error
}


function find(isbn, callback) {
  var search

  function googleSearch() {
    search = GOOGLE_BOOK_URL.replace('$ISBN', isbn)
//    console.log('SEARCH Google:', search)
    request(search, function (error, response, body) {
      error = standardizeError(error, response.statusCode)
      if (error) {
        callback(error)
      } else {
        callback(null, googleBookPackage(JSON.parse(body).items))
      }
    })
  }

  if (ISBNDB_URL) {
    search = ISBNDB_URL.replace('$ISBN', isbn)
//    console.log('SEARCH IsbnDb:', search)
    request(search, function (error, response, body) {
      error = standardizeError(error, response && response.statusCode || 404)
      if (error) {
        googleSearch()
      } else {
        var obj = JSON.parse(body)
        if (obj.error || !obj.data) {
          googleSearch()
        } else {
          callback(null, isbnDbPackage(obj.data))
        }
      }
    })
  } else {
    googleSearch()
  }

}


module.exports = {
  init: init,
  find: find
}
