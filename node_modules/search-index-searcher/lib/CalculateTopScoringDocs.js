const Transform = require('stream').Transform
const _sortedIndexOf = require('lodash.sortedindexof')
const util = require('util')

const CalculateTopScoringDocs = function (options, seekLimit) {
  this.options = options
  this.seekLimit = seekLimit
  Transform.call(this, { objectMode: true })
}
exports.CalculateTopScoringDocs = CalculateTopScoringDocs
util.inherits(CalculateTopScoringDocs, Transform)
CalculateTopScoringDocs.prototype._transform = function (clauseSet, encoding, end) {
  const sep = this.options.keySeparator
  // clauseSet = JSON.parse(clauseSet)
  const that = this

  const lowestFrequency = clauseSet.termFrequencies.sort(function (a, b) {
    return a.setLength - b.setLength
  })[0]

  const gte = 'TF' + sep + lowestFrequency.gte
  const lte = 'TF' + sep + lowestFrequency.lte + sep

  // walk down the DF array of lowest frequency hit until (offset +
  // pagesize) hits have been found

  var topScoringDocs = []
  that.options.indexes.createReadStream({gte: gte, lte: lte})
    .on('data', function (data) {
      var intersections = []
      // Do intersection and pagination cutoffs here- only push
      // results that are in the resultset
      for (var i = 0
        ; ((i < data.value.length) && (intersections.length < that.seekLimit)); i++) {
        if (_sortedIndexOf(clauseSet.set, data.value[i][1]) !== -1) {
          intersections.push(data.value[i])
        }
      }
      topScoringDocs = topScoringDocs.concat(intersections)
    })
    .on('error', function (err) {
      that.options.log.debug(err)
    })
    .on('end', function () {
      // fetch document vectors for the highest scores and work out
      // complete score for each selected doc.
      clauseSet['topScoringDocs'] = topScoringDocs
      that.push(clauseSet)
      return end()
    })
}
