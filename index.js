/*!
 * multer
 * Copyright(c) 2014 Hage Yaapa
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var thenify = require('thenify');
var originalMulter = require('multer');

/**
 * @param {Object} options
 * @return {GeneratorFunction}
 * @api public
 */

module.exports = function multerWrapper(options) {
  var middleware = thenify(originalMulter(options));

  return multer;

  function* multer(next) {
    yield middleware(this.req, this.res);
    this.request.body = this.req.body;
    yield next;
  }
}
