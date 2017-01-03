/*
search-index-adder

The module that adds documents into search-index' can also be run as a
standalone

*/

const DBEntries = require('./lib/delete.js').DBEntries
const DBWriteCleanStream = require('./lib/replicate.js').DBWriteCleanStream
const DBWriteMergeStream = require('./lib/replicate.js').DBWriteMergeStream
const DocVector = require('./lib/delete.js').DocVector
const IndexBatch = require('./lib/add.js').IndexBatch
const Readable = require('stream').Readable
const RecalibrateDB = require('./lib/delete.js').RecalibrateDB
const bunyan = require('bunyan')
const del = require('./lib/delete.js')
const docProc = require('docproc')
const leveldown = require('leveldown')
const levelup = require('levelup')
const pumpify = require('pumpify')

const async = require('async')

module.exports = function (givenOptions, callback) {
  getOptions(givenOptions, function (err, options) {
    var Indexer = {}
    Indexer.options = options

    var q = async.queue(function (batch, callback) {
      const s = new Readable({ objectMode: true })
      batch.batch.forEach(function (doc) {
        s.push(doc)
      })
      s.push(null)
      s.pipe(Indexer.defaultPipeline(batch.batchOps))
        .pipe(Indexer.add())
        .on('data', function (data) {})
        .on('end', function () {
          return callback()
        })
        .on('error', function (err) {
          return callback(err)
        })
    }, 1)

    Indexer.add = function () {
      return pumpify.obj(
        new IndexBatch(Indexer),
        new DBWriteMergeStream(options))
    }

    Indexer.concurrentAdd = function (batchOps, batch, done) {
      q.push({
        batch: batch,
        batchOps: batchOps
      }, function (err) {
        done(err)
      })
    }

    Indexer.close = function (callback) {
      options.indexes.close(function (err) {
        while (!options.indexes.isClosed()) {
          options.log.debug('closing...')
        }
        if (options.indexes.isClosed()) {
          options.log.debug('closed...')
          callback(err)
        }
      })
    }

    Indexer.dbWriteStream = function (streamOps) {
      streamOps = Object.assign({}, { merge: true }, streamOps)
      if (streamOps.merge) {
        return new DBWriteMergeStream(options)
      } else {
        return new DBWriteCleanStream(options)
      }
    }

    Indexer.defaultPipeline = function (batchOptions) {
      batchOptions = Object.assign({}, options, batchOptions)
      return docProc.pipeline(batchOptions)
    }

    Indexer.deleteStream = function (options) {
      return pumpify.obj(
        new DocVector(options),
        new DBEntries(options),
        new RecalibrateDB(options)
      )
    }

    Indexer.deleter = function (docIds, done) {
      const s = new Readable()
      docIds.forEach(function (docId) {
        s.push(JSON.stringify(docId))
      })
      s.push(null)
      s.pipe(Indexer.deleteStream(options))
        .on('data', function () {
          // nowt
        })
        .on('end', function () {
          done(null)
        })
    }

    Indexer.flush = function (APICallback) {
      del.flush(options, function (err) {
        return APICallback(err)
      })
    }

    //  return Indexer
    return callback(err, Indexer)
  })
}

const getOptions = function (options, done) {
  options = Object.assign({}, {
    deletable: true,
    batchSize: 100000,
    fieldedSearch: true,
    fieldOptions: {},
    preserveCase: false,
    keySeparator: '￮',
    storeable: true,
    searchable: true,
    indexPath: 'si',
    logLevel: 'error',
    nGramLength: 1,
    nGramSeparator: ' ',
    separator: /\\n|[|' ><.,\-|]+|\\u0003/,
    stopwords: [],
    weight: 0
  }, options)
  options.log = bunyan.createLogger({
    name: 'search-index',
    level: options.logLevel
  })
  if (!options.indexes) {
    levelup(options.indexPath || 'si', {
      valueEncoding: 'json',
      db: leveldown
    }, function (err, db) {
      options.indexes = db
      done(err, options)
    })
  } else {
    done(null, options)
  }
}
