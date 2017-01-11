const Transform = require('stream').Transform
const util = require('util')

const ScoreTopScoringDocsTFIDF = function (options) {
  this.options = options
  Transform.call(this, { objectMode: true })
}
exports.ScoreTopScoringDocsTFIDF = ScoreTopScoringDocsTFIDF
util.inherits(ScoreTopScoringDocsTFIDF, Transform)
ScoreTopScoringDocsTFIDF.prototype._transform = function (clause, encoding, end) {
  const sep = this.options.keySeparator
  const that = this
  clause.queryClause.BOOST = clause.queryClause.BOOST || 0 // put this somewhere better
  const fields = Object.keys(clause.queryClause.AND)
  var i = 0
  // async.each(clause.topScoringDocs, function (docID, nextDocCallback) {

  // if there are no docs, just return
  if (clause.topScoringDocs.length === 0) return end()

  clause.topScoringDocs.forEach(function (docID) {
    docID = docID[1]
    var vectors = []
    fields.forEach(function (field) {
      that.options.indexes.get(
        'DOCUMENT-VECTOR' + sep + docID + sep + field + sep, function (err, docVector) {
          err // TODO something clever with err
          const vector = {}
          clause.queryClause.AND[field].forEach(function (token) {
            vector[field + sep + token] = docVector[token]
          })
          vectors.push(vector)
          if (vectors.length === fields.length) {
            const tfidf = {}
            for (var j = 0; ((j < clause.termFrequencies.length) && (j < vectors.length)); j++) {
              const item = clause.termFrequencies[j]
              const tf = +item.tf
              const df = +vectors[j][item.gte] // should this be gte?
              const idf = Math.log10(1 + (1 / df))
              tfidf[item.gte] = (tf * idf)
            }
            var score = (Object.keys(tfidf).reduce(function (prev, cur) {
              return (tfidf[prev] || 0) + tfidf[cur]
            }, 0) / Object.keys(tfidf).length)
            that.push({
              id: docID,
              scoringCriteria: [{
                tf: clause.termFrequencies,
                df: vectors[0],
                tfidf: tfidf,
                boost: +clause.queryClause.BOOST,
                score: score - +clause.queryClause.BOOST
              }],
              score: score - +clause.queryClause.BOOST
            })
            if (++i === clause.topScoringDocs.length) {
              return end()
            }
          }
        })
    })
  })
}
