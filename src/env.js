'use strict';

const FS = require('fs');
const PATH = require('path');
const dotenv = require('dotenv');
const ENV = process.env.NODE_ENV || 'prod';

class Env {
  constructor() {
    this.name = ENV;
  }

  get ghUser() {
    const user = process.env.GH_USER;
    if (!user) throw Error('No GH_USER environment variable.');
    return user;
  }

  get ghToken() {
    const token = process.env.GH_TOKEN;
    if (!token) throw Error('No GH_TOKEN environment variable.');
    return token;
  }

  loadEnv() {
    this.loadEnvFile('.env');
    this.loadEnvFile(`.env.${this.name}`);
  }

  get isTest() {
    return this.name === 'test';
  }

  get isDevelopment() {
    return this.name === 'development';
  }

  get isProduction() {
    return this.name === 'prod';
  }

  // private

  loadEnvFile(fileName) {
    const path = PATH.resolve(fileName);
    if (FS.existsSync(path)) {
      const data = FS.readFileSync(path);
      const envs = dotenv.parse(data);
      Object.entries(envs).forEach(kv => {
        const [k, v] = kv;
        process.env[k] = v;
      });
    }
  }
}

const env = new Env();

module.exports = env;
