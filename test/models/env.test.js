'use strict';

const env = require('../../src/env');

test('isTest', () => {
  expect(env.isTest).toBeTruthy();
});
