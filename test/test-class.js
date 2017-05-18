var assert = require('chai').assert;
var gas = require('gas-local');
var Sugar = require('sugar');
var request = require('sync-request');
var config = require('config');

var mock = require('gas-mock');

var mymock = mock.gas_mock();

// ソースフォルダの指定はプロジェクトルートからの相対パス
var glib = gas.require('./src', mymock);

describe('TelegramAPI.js', function() {

  var uid;
  var token;
  var method;
  var url;
  var json;
  var result;
  var setup = config.get('Setup');
  var fixture = config.get('Fixture');

  // test for getUpdateID()
  describe('#getUpdateID()', function() {
    it('should return Number Class', function() {
      // Properties.getProperty の上書き
      Sugar.Object.set(mymock, 'Properties.getProperty', function(key) {
        return setup['ScriptProperties'][key];
      });
      uid = glib.telegram.getUpdateID();
      assert.typeOf(uid, 'Number');
    });
    it('NaN 対応（文字列を無理矢理 数値変換した場合）');
  });

  // test for getApiToken()
  describe('#getApiToken()', function() {
    it('should return API Token of gevanni_bot', function() {
      token = glib.telegram.getApiToken();
      assert.equal(token, setup['ScriptProperties']['api_token']);
    });
  });

  // test for getApiUrl()
  describe('#getApiUrl()', function() {
    it('should return API Url', function() {
      method = 'getUpdates';
      url = glib.telegram.getApiUrl(token, method);
      assert.equal(url, setup['telegraApi']['url']);
    });
  });

  // test for getUpdates()
  describe('#getUpdates()', function() {
    it('should return false when the webhook is deactive', function() {
      // UrlFetchApp.fetch の上書き
      Sugar.Object.set(mymock, 'UrlFetchApp.fetch', function(url, params) {
        return this.response;
      });
      // HTTPResponse.getContentText の上書き
      Sugar.Object.set(mymock, 'HTTPResponse.getContentText', function(charset) {
        return JSON.stringify(fixture['getUpdates']['webhook']);
      });
      json = glib.telegram.getUpdates(url);
      assert.equal(json, false);
    });

    it('should return Array Class', function() {
      // HTTPResponse.getContentText の上書き
      Sugar.Object.set(mymock, 'HTTPResponse.getContentText', function(charset) {
        return JSON.stringify(fixture['getUpdates']['Array']);
      });
      json = glib.telegram.getUpdates(url);
      assert.typeOf(json.result, 'Array');
    });

    it('with offset');
  });

  // test for createPayloadList()
  describe('#createPayloadList()', function() {
    it('should return Array Class', function() {
      result = glib.telegram.createPayloadList(json, uid);
      assert.typeOf(result, 'Array');
    });

    it('UID以下のとき結果はゼロ', function() {
      // HTTPResponse.getContentText の上書き
      Sugar.Object.set(mymock, 'HTTPResponse.getContentText', function(charset) {
        json.result = [fixture['createPayloadList']['uid']['less']];
        return JSON.stringify(json);
      });
      json = glib.telegram.getUpdates(url);
      result = glib.telegram.createPayloadList(json, uid);
      assert.equal(result.length, 0);
    });

    it('UIDが等しいとき結果はゼロ');

    it('空文字のとき結果はゼロ', function() {
      // HTTPResponse.getContentText の上書き
      Sugar.Object.set(mymock, 'HTTPResponse.getContentText', function(charset) {
        json.result = [fixture['createPayloadList']['empty']];
        return JSON.stringify(json);
      });
      json = glib.telegram.getUpdates(url);
      result = glib.telegram.createPayloadList(json, uid);
      assert.equal(result.length, 0);
    });

    it('プレビューオフ', function() {
      // HTTPResponse.getContentText の上書き
      Sugar.Object.set(mymock, 'HTTPResponse.getContentText', function(charset) {
        json.result = [fixture['createPayloadList']['all']];
        return JSON.stringify(json);
      });
      json = glib.telegram.getUpdates(url);
      result = glib.telegram.createPayloadList(json, uid);
      assert.equal(result[0].disable_web_page_preview, true);
    });

    it('通知オフ', function() {
      assert.equal(result[0].disable_notification, true);
    });
  });
});
