/**
 * vinyl-filter-since <https://github.com/tunnckoCore/vinyl-filter-since>
 *
 * Copyright (c) 2015 Charlike Mike Reagent, contributors.
 * Released under the MIT license.
 */

'use strict';

var gulp = require('gulp');
var assert = require('assert');
var vinylFilterSince = require('./index');
var through2 = require('through2');

describe('vinyl-filter-since:', function() {
  it('should work properly', function(done) {
    gulp.src('test.js')
      .pipe(vinylFilterSince(new Date('2000-03-24 10:30:00')))
      .pipe(through2.obj(function(file, enc, next) {
        done();
      }))
  });
  it('should not work properly when time is in future (with debug `true`)', function(done) {
    gulp.src('test.js')
      .pipe(vinylFilterSince(new Date('2020-03-24 10:30:00'), true))
      .pipe(through2.obj(function(file, enc, next) {
        // file.debug is set internally when second argument
        // is given and it is `true`
        // it is only for testing purposes
        if (file.debug) {
          next(null, true);
          return;
        }
        next(null, file);
      }))
      .pipe(through2.obj(function(isOkey, enc, next) {
        assert.strictEqual(isOkey, true);
        done();
      }));
  });
  it('should work properly when time is in past (with debug `true`)', function(done) {
    gulp.src('test.js')
      .pipe(through2.obj(function(file, enc, next) {
        file.work = true;
        next(null, file);
      }))
      .pipe(vinylFilterSince(new Date('2000-03-24 16:12:00'), true))
      .pipe(through2.obj(function(file, enc, next) {
        assert.strictEqual(file.work, true);
        assert.strictEqual(file.debug, undefined);
        // file.debug is undefined, because it is defined
        // after the check for `filterSince` so not reached.
        done();
      }));
  });
});
