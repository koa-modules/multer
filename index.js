'use strict'

/*!
 * multer
 * Copyright(c) 2014 Hage Yaapa
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

const originalMulter = require('multer');

function multer(options) {
  const m = originalMulter(options);

  makePromise(m, 'any');
  makePromise(m, 'array');
  makePromise(m, 'fields');
  makePromise(m, 'none');
  makePromise(m, 'single');

  return m;
}

function makePromise(multer, name) {
  if (!multer[name]) return;

  const fn = multer[name];

  multer[name] = function () {
    const middleware = fn.apply(this, arguments);

    return (ctx, next) => {
      return new Promise((resolve, reject) => {
        middleware(ctx.req, ctx.res, (err) => {
          if ('request' in ctx){
            if (ctx.req.body) ctx.request.body = ctx.req.body;
            if (ctx.req.file) ctx.request.file = ctx.req.file;
            if (ctx.req.files) {
              ctx.request.files = ctx.req.files;
              ctx.files = ctx.req.files;
            }
          }
          err ? reject(err) : resolve(ctx);
        });
      }).then(next);
    };
  };
}

multer.diskStorage = originalMulter.diskStorage;
multer.memoryStorage = originalMulter.memoryStorage;

module.exports = multer;
