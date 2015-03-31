/**
 * vinyl-filter-since <https://github.com/tunnckoCore/vinyl-filter-since>
 *
 * Copyright (c) 2015 Charlike Mike Reagent, contributors.
 * Released under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var assert = require('assert');
var vinylFilterSince = require('./index');
var through2 = require('through2');

var fixture = path.join(__dirname, './package.json');

// testing framework
var lab = exports.lab = require('lab').script();
var describe = lab.describe;
var it = lab.it;

// DRY
function testit(lastUpdateDate, len, done) {
  var stream = gulp.src('*.json');
  var files = [];

  stream
    .pipe(through2.obj(function(file, enc, next) {
      next(null, file);
    }))
    .pipe(vinylFilterSince(lastUpdateDate))
    .pipe(through2.obj(function(file, enc, next) {
      files.push(file);
      next();
    }));

  stream.once('end', function _end() {
    assert.strictEqual(files.length, len);
    done();
  });
}

describe('vinyl-filter-since:', function() {
  it('should throw TypeError if no Date or Number given', function(done) {
    assert.throws(function _fixture() {
      testit('foo bar', 0, function() {});
    }, /to be date or number/);

    assert.throws(function _fixture() {
      testit([1, 2, 3], 0, function() {});
    }, TypeError);

    done();
  });
  it('should glob a file changed after since', function(done) {
    testit(new Date((+fs.statSync(fixture).mtime) - 2200), 1, done);
  });
  it('should not glob a file changed before since', function(done) {
    testit(new Date((+fs.statSync(fixture).mtime) + 1300), 0, done);
  });
});
