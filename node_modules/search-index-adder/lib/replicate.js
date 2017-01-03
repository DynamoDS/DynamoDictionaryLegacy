const Transform = require('stream').Transform
const util = require('util')

const DBWriteMergeStream = function (options) {
  this.options = options
  Transform.call(this, { objectMode: true })
}
exports.DBWriteMergeStream = DBWriteMergeStream
util.inherits(DBWriteMergeStream, Transform)
DBWriteMergeStream.prototype._transform = function (data, encoding, end) {
  if (data.totalKeys) {
    this.push(data)
    return end()
  }
  const sep = this.options.keySeparator
  var that = this
  this.options.indexes.get(data.key, function (err, val) {
    err // do something with this error
    var newVal
    // concat to existing values (only if they exist)
    if (data.key.substring(0, 3) === 'TF' + sep) {
      newVal = data.value.concat(val || []).sort(function (a, b) {
        return b[0] - a[0]
      })
    } else if (data.key.substring(0, 3) === 'DF' + sep) {
      newVal = data.value.concat(val || []).sort()
    } else if (data.key === 'DOCUMENT-COUNT') {
      newVal = (+val) + (+data.value || 0)
    } else {
      newVal = data.value
    }
    that.options.indexes.put(data.key, newVal, function (err) {
      err // do something with this error
      that.push(data)
      end()
    })
  })
}

const DBWriteCleanStream = function (options) {
  this.currentBatch = []
  this.options = options
  Transform.call(this, { objectMode: true })
}
util.inherits(DBWriteCleanStream, Transform)
DBWriteCleanStream.prototype._transform = function (data, encoding, end) {
  var that = this
  this.currentBatch.push(data)
  if (this.currentBatch.length % this.options.batchSize === 0) {
    this.options.indexes.batch(this.currentBatch, function (err) {
      // TODO: some nice error handling if things go wrong
      err
      that.push('indexing batch')
      that.currentBatch = [] // reset batch
      end()
    })
  } else {
    end()
  }
}
DBWriteCleanStream.prototype._flush = function (end) {
  var that = this
  this.options.indexes.batch(this.currentBatch, function (err) {
    // TODO: some nice error handling if things go wrong
    err
    that.push('remaining data indexed')
    end()
  })
}
exports.DBWriteCleanStream = DBWriteCleanStream
