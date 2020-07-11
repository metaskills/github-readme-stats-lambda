'use strict';

require('dotenv').config();
const env = require('./env');
env.loadEnv();
const { renderError } = require("./utils");
const api = require('./api');
const pin = require('./pin');

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  try {
    if (/api\/pin/.test(event.rawPath)) {
      body = await pin(event);
    } else {
      body = await api(event);
    }
  } catch (err) {
    statusCode = 500;
    body = renderError(err.message);
  }
  return {
    statusCode: statusCode,
    headers: { 'Content-Type': 'image/svg+xml' },
    body: body
  };
};
