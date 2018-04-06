var util = require('util')

var BaseError = function (msg, constr) {
  Error.captureStackTrace(this, constr || this)
  this.message = msg || 'Error'
}
util.inherits(BaseError, Error)
BaseError.prototype.name = 'Base Error';

module.exports = BaseError;
