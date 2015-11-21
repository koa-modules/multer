/* eslint-env mocha */

const assert = require('assert')

const path = require('path')
const util = require('./_util')
const multer = require('../')
const temp = require('fs-temp')
const rimraf = require('rimraf')
const FormData = require('form-data')

describe('Unicode', () => {
  var uploadDir, upload

  beforeEach((done) => {
    temp.mkdir((err, path) => {
      if (err) return done(err)

      var storage = multer.diskStorage({
        destination: path,
        filename: (req, file, cb) => {
          cb(null, file.originalname)
        }
      })

      uploadDir = path
      upload = multer({ storage: storage })
      done()
    })
  })

  afterEach((done) => {
    rimraf(uploadDir, done)
  })

  it('should handle unicode filenames', (done) => {
    var form = new FormData()
    var parser = upload.single('small0')
    var filename = '\ud83d\udca9.dat'

    form.append('small0', util.file('small0.dat'), { filename: filename })

    util.submitForm(parser, form, (err, req) => {
      assert.ifError(err)

      assert.equal(path.basename(req.file.path), filename)
      assert.equal(req.file.originalname, filename)

      assert.equal(req.file.fieldname, 'small0')
      assert.equal(req.file.size, 1778)
      assert.equal(util.fileSize(req.file.path), 1778)

      done()
    })
  })
})
