const fs = require('fs')
const path = require('path')
const stream = require('stream')
const onFinished = require('on-finished')

exports.file = (name) => {
  return fs.createReadStream(path.join(__dirname, 'files', name))
}

exports.fileSize = (path) => {
  return fs.statSync(path).size
}

exports.submitForm = (multer, form, cb) => {
  form.getLength((err, length) => {
    if (err) return cb(err)

    const req = new stream.PassThrough()

    req.complete = false
    form.once('end', () => {
      req.complete = true
    })

    form.pipe(req)
    req.headers = {
      'content-type': 'multipart/form-data; boundary=' + form.getBoundary(),
      'content-length': length
    }

    const res = null
    const ctx = { req, res }
    multer(ctx, () => {}).then(() => {
      onFinished(req, () => { cb(null, req) })
    }).catch(err => {
      onFinished(req, () => { cb(err, req) })
    })
  })
}
