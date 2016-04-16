'use strict';

/*!
 * multer
 * Copyright(c) 2014 Hage Yaapa
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
const multerFields = ['file', 'files', 'body'];
const originalMulter = require('multer');

function multer(options) {
	const m = originalMulter(options);

	const _makeMiddleware = m._makeMiddleware.bind(m);
	m._makeMiddleware = makePromise(_makeMiddleware);

	const any = m.any.bind(m);
	m.any = makePromise(any);

	return m
}

function makePromise(fn) {
	return (fields, fileStrategy) => {
		return function *(next) {
			yield promise(this);
			yield next;
		};
		function promise(ctx) {
			return new Promise((resolve, reject) => {
				fn(fields, fileStrategy)(ctx.req, ctx.res, (err) => {
					if (err) {
						reject(err)
					} else {
						copyFields(ctx);
						resolve(ctx)
					}
				})
			});
		}
	}
}

function copyFields(ctx) {
	let req = ctx.req;
	let len = multerFields.length;
	let field;
	for (let i = 0; i < len; i ++) {
		field = multerFields[i];
		if (req.hasOwnProperty(field)) {
			ctx[field] = req[field];
		}
	}
}

multer.diskStorage = originalMulter.diskStorage;
multer.memoryStorage = originalMulter.memoryStorage;

exports = module.exports = multer;
