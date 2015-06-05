'use strict';

angular.module('application').factory('Cache', function () {
  var Cache = function (lifespan) {
    this.store = {};
    this.lifespan = lifespan;
  };

  function add (key, value) {
    this.store[key] = {};
    this.store[key].data = value;
    this.store[key].timestamp = Date.now();
  }

  function get (key) {
    var item = this.store[key];
    if (!item) { return null; }
    if (Date.now() - item.timestamp > this.lifespan) { return null; }

    return item.data;
  }

  Cache.prototype = {
    add: add,
    get: get
  };

  return Cache;
});
