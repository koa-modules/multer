/* eslint-env mocha */

const assert = require('assert')

const multer = require('../')
const util = require('./_util')

const Koa = require('koa')
const Router = require('koa-router')
const FormData = require('form-data')
const concat = require('concat-stream')
const onFinished = require('on-finished')

var port = 34279

describe('Koa Integration', () => {
  var app

  before((done) => {
    app = new Koa()
    app.silent = true
    app.listen(port, done)
  })

  function submitForm (form, path, cb) {
    var req = form.submit('http://localhost:' + port + path)

    req.on('error', cb)
    req.on('response', (res) => {
      res.on('error', cb)
      res.pipe(concat({ encoding: 'buffer' }, (body) => {
        onFinished(req, () => { cb(null, res, body) })
      }))
    })
  }

  it('should work with koa error handling', (done) => {
    var limits = { fileSize: 200 }
    var upload = multer({ limits: limits })
    var router = new Router()
    var form = new FormData()

    var routeCalled = 0
    var errorCalled = 0

    form.append('avatar', util.file('large.jpg'))

    router.post('/profile', upload.single('avatar'), (ctx, next) => {
      routeCalled++
      ctx.status = 200
      ctx.body = 'SUCCESS'
    })

    router.prefix('/t1')

    app.once('error', (err, ctx) => {
      assert.equal(err.code, 'LIMIT_FILE_SIZE')

      errorCalled++
    })

    app.use(router.routes())
    app.use(router.allowedMethods())

    submitForm(form, '/t1/profile', (err, res, body) => {
      assert.ifError(err)

      assert.equal(routeCalled, 0)
      assert.equal(errorCalled, 1)
      assert.equal(body.toString(), 'Internal Server Error')
      assert.equal(res.statusCode, 500)

      done()
    })
  })

  it('should work when receiving error from fileFilter', (done) => {
    function fileFilter (req, file, cb) {
      cb(new Error('TEST'))
    }

    var upload = multer({ fileFilter: fileFilter })
    var router = new Router()
    var form = new FormData()

    var routeCalled = 0
    var errorCalled = 0

    form.append('avatar', util.file('large.jpg'))

    router.post('/profile', upload.single('avatar'), (ctx, next) => {
      routeCalled++
        ctx.status = 200
        ctx.body = 'SUCCESS'
    })

    router.prefix('/t2')

    app.once('error', (err, ctx) => {
      assert.equal(err.message, 'TEST')

      errorCalled++
    })

    app.use(router.routes())
    app.use(router.allowedMethods())

    submitForm(form, '/t2/profile', (err, res, body) => {
      assert.ifError(err)

      assert.equal(routeCalled, 0)
      assert.equal(errorCalled, 1)
      assert.equal(body.toString(), 'Internal Server Error')
      assert.equal(res.statusCode, 500)

      done()
    })
  })
})
