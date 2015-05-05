# multi-isbn

Find books by ISBN from ISBN DB, Google Book API, Open Library and Worldcat

## Module Installation

This module is installed via npm:

```sh
npm i multi-isbn --save
```

## Example Usage

```js
var multiIsbn = require('multi-isbn')
multiIsbn.init()
isbnSearch.find(isbn, function(err, data) {
  if (err) throw err
  console.log(JSON.stringify(data, null, 2))
})
```

Or initialize with select access keys:

```js
var multiIsbn = require('multi-isbn')
var options    = {
  isbndb_key:      convar('isbndb_key'),
  google_book_key: convar('google_book_key')
}
multiIsbn.init(options)
isbnSearch.find(isbn, function(err, data) {
  if (err) throw err
  console.log(JSON.stringify(data, null, 2))
})
```

## CLI Install

```sh
npm i multi-isbn -g
```

## Example Usage

```sh
multi-isbn --isbn 9781595231123
```

## Support

- [x] ISBN DB
- [x] Google Books
- [x] Open Library
- [x] Worldcat

## CLI Support

- [x] ISBN DB
- [x] Google Books
- [ ] Open Library
- [ ] Worldcat

## Rights

This project is licensed: MIT

```dependencies``` libraries may differ (see each for respective licenses)
