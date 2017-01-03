const Transform = require('stream').Transform
const util = require('util')

const FetchDocsFromDB = function (options) {
  this.options = options
  Transform.call(this, { objectMode: true })
}
exports.FetchDocsFromDB = FetchDocsFromDB
util.inherits(FetchDocsFromDB, Transform)
FetchDocsFromDB.prototype._transform = function (line, encoding, end) {
  const sep = this.options.keySeparator
  const that = this
  this.options.indexes.get('DOCUMENT' + sep + line.toString() + sep, function (err, doc) {
    if (!err) {
      that.push(doc)
    }
    end()
  })
}
