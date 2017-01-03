const Transform = require('stream').Transform
const _sortedIndexOf = require('lodash.sortedindexof')
const util = require('util')

const ScoreDocsOnField = function (options, seekLimit, sort) {
  this.options = options
  this.seekLimit = seekLimit
  this.sort = sort
  Transform.call(this, { objectMode: true })
}
exports.ScoreDocsOnField = ScoreDocsOnField
util.inherits(ScoreDocsOnField, Transform)
ScoreDocsOnField.prototype._transform = function (clauseSet, encoding, end) {
  const sep = this.options.keySeparator
  // clauseSet = JSON.parse(clauseSet)
  const that = this

  const gte = 'TF' + sep + this.sort.field + sep
  const lte = 'TF' + sep + this.sort.field + sep + sep

  // walk down the DF array of lowest frequency hit until (offset +
  // pagesize) hits have been found
  that.options.indexes.createReadStream({gte: gte, lte: lte})
    .on('data', function (data) {
      for (var i = 0; ((i < data.value.length) && (i < that.seekLimit)); i++) {
        if (_sortedIndexOf(clauseSet.set, data.value[i][1]) !== -1) {
          that.push({
            id: data.value[i][1],
            score: data.value[i][0]
          })
        }
      }
    })
    .on('end', function () {
      return end()
    })
}
