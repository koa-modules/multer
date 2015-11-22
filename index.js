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

const originalMulter = require('multer')

function multer(options) {
  const m = originalMulter(options)

  const _makeMiddleware = m._makeMiddleware.bind(m)
  m._makeMiddleware = makePromise(_makeMiddleware)

  const any = m.any.bind(m)
  m.any = makePromise(any)

  return m
}

function makePromise(fn) {
  return (fields, fileStrategy) => {
    return (ctx, next) => {
      return new Promise((resolve, reject) => {
        fn(fields, fileStrategy)(ctx.req, ctx.res, (err) => {
          err ? reject(err) : resolve(ctx)
        })
      }).then(next)
    }
  }
}

multer.diskStorage = originalMulter.diskStorage
multer.memoryStorage = originalMulter.memoryStorage

module.exports = multer
