const Transform = require('stream').Transform
const iats = require('intersect-arrays-to-stream')
const util = require('util')

// Make a Transform stream stage to get an intersection stream
const GetIntersectionStream = function (options, ANDKeys) {
  this.ANDKeys = ANDKeys
  this.options = options
  Transform.call(this, { objectMode: true })
}
exports.GetIntersectionStream = GetIntersectionStream
util.inherits(GetIntersectionStream, Transform)
GetIntersectionStream.prototype._transform = function (line, encoding, end) {
  const that = this
  var IDSets = []
  this.ANDKeys.forEach(function (item) {
    var ANDSetIDs = []
    that.options.indexes.createReadStream({gte: item[0], lte: item[1]})
      .on('data', function (data) {
        ANDSetIDs = ANDSetIDs.concat(data.value).sort()
      })
      .on('end', function () {
        IDSets.push(ANDSetIDs)
        if (IDSets.length === that.ANDKeys.length) {
          iats.getIntersectionStream(IDSets).on('data', function (data) {
            that.push(data)
          }).on('end', function () {
            end()
          })
        }
      })
  })
}
