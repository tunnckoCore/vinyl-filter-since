/**
 * vinyl-filter-since <https://github.com/tunnckoCore/vinyl-filter-since>
 *
 * Copyright (c) 2015 Charlike Mike Reagent, contributors.
 * Released under the MIT license.
 */

'use strict';

var is = require('assert-kindof');
var through2 = require('through2');

var label = 'vinyl-filter-since';

module.exports = function vinylFilterSince(since) {
  if (!is.kindof(since, 'date') && !is.kindof(since, 'number')) {
    throw new TypeError(label + ':15, expect `since` to be date or number.');
  }

  return through2.obj(function(file, enc, next) {
    if (since < file.stat.mtime) {
      next(null, file);
      return;
    }
    next();
  });
};
