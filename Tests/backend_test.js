//https://www.davidbaumgold.com/tutorials/automated-tests-node/
var assert = require('assert');
const Event = require("../Backend/RestAPI/models/event_model");

describe('increment function', function() {

  it('increments a positive number', function() {
    var result = increment(1);
    assert.equal(result, 2);
  });

  it('increments a negative number', function() {
    var result = increment(-10);
    assert.equal(result, -9);
  });

  it('fails on strings', function() {
    assert.throws(function() {
      increment("purple");
    });
  });

});
