/**
 * vinyl-filter-since <https://github.com/tunnckoCore/vinyl-filter-since>
 *
 * Copyright (c) 2015 Charlike Mike Reagent, contributors.
 * Released under the MIT license.
 */

'use strict';

var is = require('assert-kindof');
var through2 = require('through2');

module.exports = function vinylFilterSince(since, debug) {
  if (!is.kindof(since, 'date') && !is.kindof(since, 'number')) {
    throw new TypeError('vinyl-filter-since:15, expect `since` to be date or number.');
  }

  return through2.obj(function(file, enc, cb) {
    if (since < file.stat.mtime) {
      return cb(null, file);
    }
    if (debug) {
      file.debug = true;
      return cb(null, file);
    }
    cb();
  });
};
