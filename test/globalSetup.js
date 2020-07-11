'use strict';

process.env.NODE_ENV = 'test';

module.exports = function() {
  require('../src/env').loadEnv();
};
