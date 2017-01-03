const _intersection = require('lodash.intersection')
const _uniq = require('lodash.uniq')
const Transform = require('stream').Transform
const util = require('util')

const CalculateBuckets = function (options, filter, requestedBuckets) {
  this.buckets = requestedBuckets || []
  this.filter = filter
  this.options = options
  Transform.call(this, { objectMode: true })
}
exports.CalculateBuckets = CalculateBuckets
util.inherits(CalculateBuckets, Transform)
CalculateBuckets.prototype._transform = function (mergedQueryClauses, encoding, end) {
  const that = this
  const sep = this.options.keySeparator
  var bucketsProcessed = 0
  that.buckets.forEach(function (bucket) {
    const gte = 'DF' + sep + bucket.field + sep + bucket.gte
    const lte = 'DF' + sep + bucket.field + sep + bucket.lte + sep
    that.options.indexes.createReadStream({gte: gte, lte: lte})
      .on('data', function (data) {
        var IDSet = _intersection(data.value, mergedQueryClauses.set)
        if (IDSet.length > 0) {
          bucket.value = bucket.value || []
          bucket.value = _uniq(bucket.value.concat(IDSet).sort())
        }
      })
      .on('close', function () {
        if (!bucket.set) {
          bucket.value = bucket.value.length
        }
        that.push(bucket)
        if (++bucketsProcessed === that.buckets.length) {
          return end()
        }
      })
  })
}
