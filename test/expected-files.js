/* eslint-env mocha */

const assert = require('assert')

const util = require('./_util')
const multer = require('../')
const FormData = require('form-data')

describe('Expected files', () => {
  var upload

  before(function (done) {
    upload = multer()
    done()
  })

  it('should reject single unexpected file', (done) => {
    var form = new FormData()
    var parser = upload.single('butme')

    form.append('notme', util.file('small0.dat'))

    util.submitForm(parser, form, (err, req) => {
      assert.equal(err.code, 'LIMIT_UNEXPECTED_FILE')
      assert.equal(err.field, 'notme')
      done()
    })
  })

  it('should reject array of multiple files', (done) => {
    var form = new FormData()
    var parser = upload.array('butme', 4)

    form.append('notme', util.file('small0.dat'))
    form.append('notme', util.file('small1.dat'))

    util.submitForm(parser, form, (err, req) => {
      assert.equal(err.code, 'LIMIT_UNEXPECTED_FILE')
      assert.equal(err.field, 'notme')
      done()
    })
  })

  it('should reject overflowing arrays', (done) => {
    var form = new FormData()
    var parser = upload.array('butme', 1)

    form.append('butme', util.file('small0.dat'))
    form.append('butme', util.file('small1.dat'))

    util.submitForm(parser, form, (err, req) => {
      assert.equal(err.code, 'LIMIT_UNEXPECTED_FILE')
      assert.equal(err.field, 'butme')
      done()
    })
  })

  it('should accept files with expected fieldname', (done) => {
    var form = new FormData()
    var parser = upload.fields([
      { name: 'butme', maxCount: 2 },
      { name: 'andme', maxCount: 2 }
    ])

    form.append('butme', util.file('small0.dat'))
    form.append('butme', util.file('small1.dat'))
    form.append('andme', util.file('empty.dat'))

    util.submitForm(parser, form, (err, req) => {
      assert.ifError(err)

      assert.equal(req.files['butme'].length, 2)
      assert.equal(req.files['andme'].length, 1)

      done()
    })
  })

  it('should reject files with unexpected fieldname', (done) => {
    var form = new FormData()
    var parser = upload.fields([
      { name: 'butme', maxCount: 2 },
      { name: 'andme', maxCount: 2 }
    ])

    form.append('butme', util.file('small0.dat'))
    form.append('butme', util.file('small1.dat'))
    form.append('andme', util.file('empty.dat'))
    form.append('notme', util.file('empty.dat'))

    util.submitForm(parser, form, (err, req) => {
      assert.equal(err.code, 'LIMIT_UNEXPECTED_FILE')
      assert.equal(err.field, 'notme')
      done()
    })
  })

  it('should allow any file to come thru', (done) => {
    var form = new FormData()
    var parser = upload.any()

    form.append('butme', util.file('small0.dat'))
    form.append('butme', util.file('small1.dat'))
    form.append('andme', util.file('empty.dat'))

    util.submitForm(parser, form, (err, req) => {
      assert.ifError(err)
      assert.equal(req.files.length, 3)
      assert.equal(req.files[0].fieldname, 'butme')
      assert.equal(req.files[1].fieldname, 'butme')
      assert.equal(req.files[2].fieldname, 'andme')
      done()
    })
  })
})
