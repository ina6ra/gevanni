var assert = require('chai').assert;
var Sugar = require('sugar');
var config = require('config');

// $ yarn add https://github.com/ina6ra/gas-mock
var gas = require('gas-mock');

var mymock = gas.globalMockDefault;

// ソースフォルダの指定はプロジェクトルートからの相対パス
var glib = gas.require('./src', mymock);

describe('common.js', function() {

  var uid;
  var token;
  var method;
  var url;
  var json;
  var result;
  var setup = config.get('Setup');
  var fixture = config.get('Fixture');

  before(function() {
    // UrlFetchApp.fetch の上書き
    Sugar.Object.set(mymock, 'UrlFetchApp.fetch', function(url, params) {
      return this.response;
    });
    // Properties.getProperty の上書き
    Sugar.Object.set(mymock, 'Properties.getProperty', function(key) {
      return setup['ScriptProperties'][key];
    });
    uid = glib.telegram.getUpdateID();
    token = glib.telegram.getApiToken();
    method = 'getUpdates';
    url = glib.telegram.getApiUrl(token, method);
    // HTTPResponse.getContentText の上書き
    Sugar.Object.set(mymock, 'HTTPResponse.getContentText', function(charset) {
      return JSON.stringify(fixture['getUpdates']['Array']);
    });
    json = glib.telegram.getUpdates(url);
  });

  // test for createPayloadList()
  describe('#createPayloadList()', function() {

    it('should return Array Class', function() {
      result = glib.common.createPayloadList(json, uid);
      assert.typeOf(result, 'Array');
    });

    it('UIDが等しいとき結果はゼロ', function() {
      // HTTPResponse.getContentText の上書き
      Sugar.Object.set(mymock, 'HTTPResponse.getContentText', function(charset) {
        json.result = [fixture['createPayloadList']['uid']['equal']];
        return JSON.stringify(json);
      });
      json = glib.telegram.getUpdates(url);
      result = glib.common.createPayloadList(json, uid);
      assert.equal(result.length, 0);
    });

    it('UID以下のとき結果はゼロ', function() {
      // HTTPResponse.getContentText の上書き
      Sugar.Object.set(mymock, 'HTTPResponse.getContentText', function(charset) {
        json.result = [fixture['createPayloadList']['uid']['less']];
        return JSON.stringify(json);
      });
      json = glib.telegram.getUpdates(url);
      result = glib.common.createPayloadList(json, uid);
      assert.equal(result.length, 0);
    });

    it('UIDのチェックをしない');

    it('空文字のとき結果はゼロ', function() {
      // HTTPResponse.getContentText の上書き
      Sugar.Object.set(mymock, 'HTTPResponse.getContentText', function(charset) {
        json.result = [fixture['createPayloadList']['empty']];
        return JSON.stringify(json);
      });
      json = glib.telegram.getUpdates(url);
      result = glib.common.createPayloadList(json, uid);
      assert.equal(result.length, 0);
    });

    it('プレビューオフ', function() {
      // HTTPResponse.getContentText の上書き
      Sugar.Object.set(mymock, 'HTTPResponse.getContentText', function(charset) {
        json.result = [fixture['createPayloadList']['all']];
        return JSON.stringify(json);
      });
      json = glib.telegram.getUpdates(url);
      result = glib.common.createPayloadList(json, uid);
      assert.equal(result[0].disable_web_page_preview, true);
    });

    it('通知オフ', function() {
      assert.equal(result[0].disable_notification, true);
    });
  });
});
