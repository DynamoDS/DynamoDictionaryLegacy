const Readable = require('stream').Readable
const Transform = require('stream').Transform
const util = require('util')

const MatcherStream = function (q, options) {
  this.options = options
  Transform.call(this, { objectMode: true })
}
util.inherits(MatcherStream, Transform)
MatcherStream.prototype._transform = function (q, encoding, end) {
  const sep = this.options.keySeparator
  const that = this
  var results = []

  const formatMatches = function (item) {
    if (q.type === 'ID') {
      that.push([item.key.split(sep)[2], item.value])
    } else if (q.type === 'count') {
      that.push([item.key.split(sep)[2], item.value.length])
    } else {
      that.push(item.key.split(sep)[2])
    }
  }

  const sortResults = function (err) {
    err // TODO: what to do with this?
    results.sort(function (a, b) {
      return b.value.length - a.value.length
    })
      .slice(0, q.limit)
      .forEach(formatMatches)
    end()
  }

  this.options.indexes.createReadStream({
    start: 'DF' + sep + q.field + sep + q.beginsWith,
    end: 'DF' + sep + q.field + sep + q.beginsWith + sep
  })
  .on('data', function (data) {
    results.push(data)
  })
  .on('error', function (err) {
    that.options.log.error('Oh my!', err)
  })
  .on('end', sortResults)
}

exports.match = function (q, options) {
  var s = new Readable({ objectMode: true })
  q = Object.assign({}, {
    beginsWith: '',
    field: '*',
    threshold: 3,
    limit: 10,
    type: 'simple'
  }, q)
  if (q.beginsWith.length < q.threshold) {
    s.push(null)
    return s
  }
  s.push(q)
  s.push(null)

  return s.pipe(new MatcherStream(q, options))
}
