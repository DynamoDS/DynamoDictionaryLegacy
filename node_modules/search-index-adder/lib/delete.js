// deletes all references to a document from the search index

const util = require('util')
const Transform = require('stream').Transform

// Remove all keys in DB
exports.flush = function (options, callback) {
  const sep = options.keySeparator
  var deleteOps = []
  options.indexes.createKeyStream({gte: '0', lte: sep})
    .on('data', function (data) {
      deleteOps.push({type: 'del', key: data})
    })
    .on('error', function (err) {
      options.log.error(err, ' failed to empty index')
      return callback(err)
    })
    .on('end', function () {
      options.indexes.batch(deleteOps, callback)
    })
}

const DocVector = function (options) {
  this.options = options
  Transform.call(this, { objectMode: true })
}
exports.DocVector = DocVector
util.inherits(DocVector, Transform)
DocVector.prototype._transform = function (docId, encoding, end) {
  docId = JSON.parse(docId)
  const sep = this.options.keySeparator
  var that = this
  this.options.indexes.createReadStream({
    gte: 'DOCUMENT-VECTOR' + sep + docId + sep,
    lte: 'DOCUMENT-VECTOR' + sep + docId + sep + sep
  }).on('data', function (data) {
    that.push(data)
  }).on('close', function () {
    return end()
  })
}

const DBEntries = function (options) {
  this.options = options
  Transform.call(this, { objectMode: true })
}
exports.DBEntries = DBEntries
util.inherits(DBEntries, Transform)
DBEntries.prototype._transform = function (vector, encoding, end) {
  const sep = this.options.keySeparator
  var docId
  for (var k in vector.value) {
    docId = vector.key.split(sep)[1]
    var field = vector.key.split(sep)[2]
    this.push({
      key: 'TF' + sep + field + sep + k,
      value: docId
    })
    this.push({
      key: 'DF' + sep + field + sep + k,
      value: docId
    })
  }
  this.push({key: vector.key})
  this.push({key: 'DOCUMENT' + sep + docId + sep})

  // TODO: fix this!
  // this.push({key: 'DOCUMENT-COUNT'})
  return end()
}

const RecalibrateDB = function (options) {
  this.options = options
  Transform.call(this, { objectMode: true })
}
exports.RecalibrateDB = RecalibrateDB
util.inherits(RecalibrateDB, Transform)
RecalibrateDB.prototype._transform = function (dbEntry, encoding, end) {
  const sep = this.options.keySeparator
  var that = this
  this.options.indexes.get(dbEntry.key, function (err, value) {
    if (err) that.options.log.info(err)
    // handle errors better
    var docId = dbEntry.value
    var dbInstruction = {}
    dbInstruction.key = dbEntry.key
    if (dbEntry.key.substring(0, 3) === 'TF' + sep) {
      dbInstruction.value = value.filter(function (item) {
        return (item[1] !== docId)
      })
      if (dbInstruction.value.length === 0) {
        dbInstruction.type = 'del'
      } else {
        dbInstruction.type = 'put'
      }
    } else if (dbEntry.key.substring(0, 3) === 'DF' + sep) {
      value.splice(value.indexOf(docId), 1)
      dbInstruction.value = value
      if (dbInstruction.value.length === 0) {
        dbInstruction.type = 'del'
      } else {
        dbInstruction.type = 'put'
      }
    } else if (dbEntry.key.substring(0, 9) === 'DOCUMENT' + sep) {
      dbInstruction.type = 'del'
    } else if (dbEntry.key.substring(0, 16) === 'DOCUMENT-VECTOR' + sep) {
      dbInstruction.type = 'del'
    }
    that.options.indexes.batch([dbInstruction], function (err) {
      if (err) {
        // then what?
      }
      return end()
    })
  })
}
