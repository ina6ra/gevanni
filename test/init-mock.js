var gas = require('gas-mock');

var telegram = require('telegram-gs');

var mymock = gas.globalMockDefault;
mymock = telegram.set_mock(mymock);

// ソースフォルダの指定はプロジェクトルートからの相対パス
var glib = gas.require('./src', mymock);

module.exports = {
  assert: require('chai').assert,
  Sugar: require('sugar'),
  config: require('config'),
  fx: require('node-fixtures'),
  gas: gas,
  mymock: mymock,
  glib: glib
};
