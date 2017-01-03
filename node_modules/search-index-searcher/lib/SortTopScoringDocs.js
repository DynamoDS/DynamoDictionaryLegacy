const Transform = require('stream').Transform
const util = require('util')

const SortTopScoringDocs = function (q) {
  this.resultSet = []
  this.q = q
  if (q.sort) {
    if (q.sort.direction) {
      this.sortDirection = q.sort.direction
    }
  }
  Transform.call(this, { objectMode: true })
}
exports.SortTopScoringDocs = SortTopScoringDocs
util.inherits(SortTopScoringDocs, Transform)
SortTopScoringDocs.prototype._transform = function (doc, encoding, end) {
  this.resultSet.push(doc)
  return end()
}
SortTopScoringDocs.prototype._flush = function (end) {
  const that = this
  if (this.sortDirection === 'desc') {
    this.resultSet = this.resultSet.sort(function (a, b) {
      if (a.score < b.score) return 2
      if (a.score > b.score) return -2
      if (a.id < b.id) return 1
      if (a.id > b.id) return -1
      return 0
    })
  } else {
    this.resultSet = this.resultSet.sort(function (a, b) {
      if (a.score > b.score) return 2
      if (a.score < b.score) return -2
      if (a.id < b.id) return 1
      if (a.id > b.id) return -1
      return 0
    })
  }
  this.resultSet = this.resultSet.slice(this.q.offset, this.q.offset + this.q.pageSize)
  this.resultSet.forEach(function (hit) {
    that.push(hit)
  })
  return end()
}
