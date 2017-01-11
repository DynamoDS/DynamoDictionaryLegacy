const Transform = require('stream').Transform
const util = require('util')

const AvailableFields = function (options) {
  this.options = options
  Transform.call(this, { objectMode: true })
}
exports.AvailableFields = AvailableFields
util.inherits(AvailableFields, Transform)
AvailableFields.prototype._transform = function (field, encoding, end) {
  this.push(field.key.split(this.options.keySeparator)[1])
  return end()
}
