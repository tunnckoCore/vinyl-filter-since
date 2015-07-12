/**
 * vinyl-filter-since <https://github.com/tunnckoCore/vinyl-filter-since>
 *
 * Copyright (c) 2015 Charlike Mike Reagent, contributors.
 * Released under the MIT license.
 */

'use strict';

var Transform = require('readable-stream/transform');

var label = 'vinyl-filter-since';

module.exports = function vinylFilterSince(since) {
  if (!(since instanceof Date) && typeof since !== 'number') {
    throw new TypeError(label + ':15, expect `since` to be date or number.');
  }

  return new Transform({
    objectMode: true,
    transform: function(file, enc, next) {
      if (since < file.stat.mtime) {
        this.push(file);
        return;
      }
      next();
    }
  });
};
