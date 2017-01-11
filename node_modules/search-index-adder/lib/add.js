const Transform = require('stream').Transform
const util = require('util')

const emitIndexKeys = function (s) {
  for (var key in s.deltaIndex) {
    s.push({
      key: key,
      value: s.deltaIndex[key]
    })
  }
  s.deltaIndex = {}
}

const IndexBatch = function (indexer) {
  this.indexer = indexer
  this.deltaIndex = {}
  Transform.call(this, { objectMode: true })
}
exports.IndexBatch = IndexBatch
util.inherits(IndexBatch, Transform)
IndexBatch.prototype._transform = function (ingestedDoc, encoding, end) {
  const sep = this.indexer.options.keySeparator
  var that = this
  this.indexer.deleter([ingestedDoc.id], function (err) {
    if (err) that.indexer.log.info(err)
    that.indexer.options.log.info('processing doc ' + ingestedDoc.id)
    that.deltaIndex['DOCUMENT' + sep + ingestedDoc.id + sep] = ingestedDoc.stored
    for (var fieldName in ingestedDoc.vector) {
      that.deltaIndex['FIELD' + sep + fieldName] = fieldName
      for (var token in ingestedDoc.vector[fieldName]) {
        var vMagnitude = ingestedDoc.vector[fieldName][token]
        var tfKeyName = 'TF' + sep + fieldName + sep + token
        var dfKeyName = 'DF' + sep + fieldName + sep + token
        that.deltaIndex[tfKeyName] = that.deltaIndex[tfKeyName] || []
        that.deltaIndex[tfKeyName].push([vMagnitude, ingestedDoc.id])
        that.deltaIndex[dfKeyName] = that.deltaIndex[dfKeyName] || []
        that.deltaIndex[dfKeyName].push(ingestedDoc.id)
      }
      that.deltaIndex['DOCUMENT-VECTOR' + sep + ingestedDoc.id + sep + fieldName + sep] =
        ingestedDoc.vector[fieldName]
    }
    // console.log(Object.keys(that.deltaIndex).length)
    // console.log(that.batchOptions.batchSize)
    var totalKeys = Object.keys(that.deltaIndex).length
    if (totalKeys > that.indexer.options.batchSize) {
      that.push({totalKeys: totalKeys})
      that.indexer.options.log.info(
        'deltaIndex is ' + totalKeys + ' long, emitting')
      emitIndexKeys(that)
    }
    return end()
  })
}
IndexBatch.prototype._flush = function (end) {
  // merge this index into main index
  emitIndexKeys(this)
  return end()
}
