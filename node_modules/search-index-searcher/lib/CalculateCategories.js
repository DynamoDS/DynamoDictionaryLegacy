const _intersection = require('lodash.intersection')
const Transform = require('stream').Transform
const util = require('util')

const CalculateCategories = function (options, category) {
  category = category || []
  category.values = []  // breaky line
  this.category = category
  this.options = options
  Transform.call(this, { objectMode: true })
}
exports.CalculateCategories = CalculateCategories
util.inherits(CalculateCategories, Transform)
CalculateCategories.prototype._transform = function (mergedQueryClauses, encoding, end) {
  if (!this.category.field) {
    return end(new Error('you need to specify a category'))
  }
  const sep = this.options.keySeparator
  const that = this
  const gte = 'DF' + sep + this.category.field + sep
  const lte = 'DF' + sep + this.category.field + sep + sep
  this.category.values = this.category.values || []
  that.options.indexes.createReadStream({gte: gte, lte: lte})
    .on('data', function (data) {
      var IDSet = _intersection(data.value, mergedQueryClauses.set)
      if (IDSet.length > 0) { // make this optional
        var key = data.key.split(sep)[2]
        var value = IDSet.length
        if (that.category.set) {
          value = IDSet
        }
        that.push({
          key: key,
          value: value
        })
      }
    // TODO: make loop aware of last iteration so that stream can
    // be pushed before _flush
    })
    .on('close', function () {
      return end()
    })
}
