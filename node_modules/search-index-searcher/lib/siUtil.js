exports.getKeySet = function (clause, sep) {
  var keySet = []
  for (var fieldName in clause) {
    clause[fieldName].forEach(function (token) {
      var gte = token.gte || token
      var lte = token.lte || token
      keySet.push([
        'DF' + sep + fieldName + sep + gte,
        'DF' + sep + fieldName + sep + lte
      ])
    })
  }
  return keySet
}

exports.getQueryDefaults = function (q) {
  // if a string is given- turn it into a query
  if (typeof q === 'string') {
    q = {
      query: [{
        AND: {'*': q.split(' ')}
      }]
    }
  }
  // Make sure that user query is arrayified
  if (q) {
    if (q.query) {
      if (Object.prototype.toString.call(q.query) !== '[object Array]') {
        q.query = [q.query]
      }
    }
  }
  // cast strings to int, where possible ("2" = 2)
  try {
    if (q.offset) q.offset = parseInt(q.offset)
  } catch (e) {}
  try {
    if (q.pageSize) q.pageSize = parseInt(q.pageSize)
  } catch (e) {}
  return Object.assign({}, {
    query: [{
      AND: {'*': ['*']}
    }],
    offset: 0,
    pageSize: 20
  }, q)
}
