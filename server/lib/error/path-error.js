var util = require('util')
var BaseError = require('./base-error')

var PathError = function (msg) {
  PathError.super_.call(this, msg, this.constructor)
}
util.inherits(PathError, BaseError)
PathError.prototype.message = 'PathError Error'

module.exports = PathError;