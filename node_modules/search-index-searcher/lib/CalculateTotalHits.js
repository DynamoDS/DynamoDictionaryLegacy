const Transform = require('stream').Transform
const util = require('util')

const CalculateTotalHits = function (options, filter, requestedBuckets) {
  this.buckets = requestedBuckets || []
  this.filter = filter
  this.options = options
  Transform.call(this, { objectMode: true })
}
exports.CalculateTotalHits = CalculateTotalHits
util.inherits(CalculateTotalHits, Transform)
CalculateTotalHits.prototype._transform = function (mergedQueryClauses, encoding, end) {
  this.push(mergedQueryClauses.set.length)
  end()
}
