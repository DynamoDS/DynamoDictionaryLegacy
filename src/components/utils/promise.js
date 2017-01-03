var promise = {};

promise.promisify = function(fn, arg) {
    return new Promise(function(resolve, reject) {
        fn(arg, function(err, data) {
            if (err) reject(err);
            else resolve(data);
        })
    });
};

module.exports = promise;
