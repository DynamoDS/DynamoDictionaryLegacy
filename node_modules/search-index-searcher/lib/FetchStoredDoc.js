const Transform = require('stream').Transform
const util = require('util')

const FetchStoredDoc = function (options) {
  this.options = options
  Transform.call(this, { objectMode: true })
}
exports.FetchStoredDoc = FetchStoredDoc
util.inherits(FetchStoredDoc, Transform)
FetchStoredDoc.prototype._transform = function (doc, encoding, end) {
  const sep = this.options.keySeparator
  var that = this
  // doc = JSON.parse(doc)
  that.options.indexes.get('DOCUMENT' + sep + doc.id + sep, function (err, stored) {
    if (err) {
      that.options.log.debug(err)
    }
    doc.document = stored
    that.push(doc)
    return end()
  })
}
