const { execSync } = require('child_process');

function getHeadHash() {
  return execSync('git rev-parse --verify HEAD')
    .toString()
    .trim();
}

let privateConfig = {};
try {
  privateConfig = require('./applitools.private.config.js');
  privateConfig = { ...privateConfig, batchId: getHeadHash() };
} catch (e) {}

module.exports = {
  ...privateConfig,
  concurrency: 200,
  dontCloseBatches: true,
  notifyOnCompletion: true,
};
