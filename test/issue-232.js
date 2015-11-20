/* eslint-env mocha */

const assert = require('assert')

const util = require('./_util')
const multer = require('../')
const temp = require('fs-temp')
const rimraf = require('rimraf')
const FormData = require('form-data')

describe('Issue #232', () => {
  var uploadDir, upload

  before((done) => {
    temp.mkdir((err, path) => {
      if (err) return done(err)

      uploadDir = path
      upload = multer({ dest: path, limits: { fileSize: 100 } })
      done()
    })
  })

  after((done) => {
    rimraf(uploadDir, done)
  })

  it('should report limit errors', (done) => {
    var form = new FormData()
    var parser = upload.single('file')

    form.append('file', util.file('large.jpg'))

    util.submitForm(parser, form, (err, req) => {
      assert.ok(err, 'an error was given')

      assert.equal(err.code, 'LIMIT_FILE_SIZE')
      assert.equal(err.field, 'file')

      done()
    })
  })
})
