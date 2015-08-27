# koa-multer

> Multer is a node.js middleware for handling `multipart/form-data` for koa.  
> [multer] wrapper for koa's middleware.

[![NPM version][npm-img]][npm-url]
[![Build status][travis-img]][travis-url]
[![Test coverage][coveralls-img]][coveralls-url]
[![License][license-img]][license-url]
[![Dependency status][david-img]][david-url]

## Install

```sh
$ npm install --save koa-multer
```

## Usage

Adding this into your koa server file:

```js
var koa = require('koa');
var multer = require('koa-multer');

var app = koa();

app.use(multer({ dest: './uploads/'}))

app.listen(3000);
```

## API

* **multer**

> Just **multer** wrapper, returns a GeneratorFunction.

## License

  [MIT](LICENSE)

[npm-img]: https://img.shields.io/npm/v/koa-multer.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-multer
[travis-img]: https://travis-ci.org/koa-modules/multer.svg?style=flat-square
[travis-url]: https://travis-ci.org/koa-modules/multer
[coveralls-img]: https://img.shields.io/coveralls/koa-modules/multer.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/koa-modules/multer?branch=master
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE
[david-img]: https://img.shields.io/david/koa-modules/multer.svg?style=flat-square
[david-url]: https://david-dm.org/koa-modules/multer
[multer]: https://github.com/expressjs/multer
