const _intersection = require('lodash.intersection')
const Transform = require('stream').Transform
const util = require('util')

const CalculateCategories = function (options, q) {
  var category = q.category || []
  category.values = []  // breaky line
  this.offset = +q.offset
  this.pageSize = +q.pageSize
  this.category = category
  this.options = options
  this.query = q.query
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
  var i = this.offset + this.pageSize
  var j = 0
  const rs = that.options.indexes.createReadStream({gte: gte, lte: lte})
  rs.on('data', function (data) {
    // page not yet reached
    if (that.offset > j++) return
    var IDSet = _intersection(data.value, mergedQueryClauses.set)
    if (IDSet.length > 0) { // make this optional
      var key = data.key.split(sep)[2]
      var value = IDSet.length
      if (that.category.set) {
        value = IDSet
      }
      var result = {
        key: key,
        value: value
      }
      // set filter: true on queries with a single OR clause
      if (that.query.length === 1) {
        try {
          if (that.query[0].AND[that.category.field].indexOf(key) > -1) {
            result.filter = true
          }
        } catch (e) {}
      }
      // page size exceeded
      if (i-- > that.offset) {
        that.push(result)
      } else {
        rs.destroy()
      }
    }
  }).on('close', function () {
    return end()
  })
}
