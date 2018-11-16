'use strict';

module.exports = () => {
  const env = process.env.NODE_ENV || 'local';
  const config = require(`./${env}`);

  console.log(`env: ${env}`);
  return config;
};
