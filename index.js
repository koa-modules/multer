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
  m._makeMiddleware = makeHandler(_makeMiddleware)

  const any = m.any.bind(m)
  m.any = makeHandler(any)

  return m
}

function makeHandler(fn) {
  return (fields, fileStrategy) => {
    return (ctx, next) => {
      const handler = fn(fields, fileStrategy)
      return new Promise((resolve, reject) => {
        handler(ctx.req, ctx.res, (err) => {
          return err ? reject(err) : resolve()
        })
      }).then(() => next())
    }
  }
}

multer.diskStorage = originalMulter.diskStorage
multer.memoryStorage = originalMulter.memoryStorage

module.exports = multer
