const Transform = require('stream').Transform
const _union = require('lodash.union')
const util = require('util')

const CalculateEntireResultSet = function (options) {
  this.options = options
  this.setSoFar = []
  Transform.call(this, { objectMode: true })
}
exports.CalculateEntireResultSet = CalculateEntireResultSet
util.inherits(CalculateEntireResultSet, Transform)
CalculateEntireResultSet.prototype._transform = function (queryClause, encoding, end) {
  this.setSoFar = _union(queryClause.set, this.setSoFar)
  return end()
}
CalculateEntireResultSet.prototype._flush = function (end) {
  this.push({
    set: this.setSoFar
  })
  return end()
}
