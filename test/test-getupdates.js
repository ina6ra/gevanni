var assert = require('chai').assert;
var gas = require('gas-local');
var Sugar = require('sugar');
var request = require('sync-request');
var config = require('config');

// $ yarn add https://github.com/ina6ra/gas-mock
var mock = require('gas-mock');

var mymock = mock.gas_mock();

// ソースフォルダの指定はプロジェクトルートからの相対パス
var glib = gas.require('./src', mymock);

describe('getupdates.js', function() {
});
