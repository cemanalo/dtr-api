'use strict';

const env = process.env.NODE_ENV || 'local';
const config = require(`./${env}`);

console.log(`env: ${env}`);

module.exports = config;
