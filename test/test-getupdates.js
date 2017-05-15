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

  var uid;
  var token;
  var method;
  var url;
  var json;
  var result;
  var fixture = config.get('Fixture');

  // test for getUpdateID()
  describe('#getUpdateID()', function() {
    it('should return Number Class', function() {
      // Properties.getProperty の上書き
      Sugar.Object.set(mymock, 'Properties.getProperty', function(key) {
        return fixture['ScriptProperties'][key];
      });
      uid = glib.gu_getUpdateID_();
      assert.typeOf(uid, 'Number');
    });
    it('NaN 対応（文字列を無理矢理 数値変換した場合）');
  });

  // test for getApiToken()
  describe('#getApiToken()', function() {
    it('should return API Token of gevanni_bot', function() {
      token = glib.gu_getApiToken_();
      assert.equal(token, fixture['ScriptProperties']['api_token']);
    });
  });

  // test for telegraApiUrl()
  describe('#telegraApiUrl()', function() {
    it('should return API Url', function() {
      method = 'getUpdates';
      url = glib.gu_telegraApiUrl_(token, method);
      assert.equal(url, fixture['telegraApiUrl']['url']);
    });
  });

  // test for telegraGetUpdates()
  describe('#telegraGetUpdates()', function() {
    it('should return false when the webhook is deactive', function() {
      // UrlFetchApp.fetch の上書き
      Sugar.Object.set(mymock, 'UrlFetchApp.fetch', function(url, params) {
        return this.response;
      });
      // HTTPResponse.getContentText の上書き
      Sugar.Object.set(mymock, 'HTTPResponse.getContentText', function(charset) {
        return JSON.stringify({
          ok: false, error_code: 409,
          description: "Conflict: can't use getUpdates method while webhook is active"
        });
      });
      json = glib.gu_telegraGetUpdates_(url);
      assert.equal(json, false);
    });

    it('should return Array Class', function() {
      // HTTPResponse.getContentText の上書き
      Sugar.Object.set(mymock, 'HTTPResponse.getContentText', function(charset) {
        return JSON.stringify({ok:true, result:[]});
      });
      json = glib.gu_telegraGetUpdates_(url);
      assert.typeOf(json.result, 'Array');
    });

    it('with offset');
  });

  // test for createPayloadList()
  describe('#createPayloadList()', function() {
    it('should return Array Class', function() {
      result = glib.gu_createPayloadList_(json, uid);
      assert.typeOf(result, 'Array');
    });

    it('UID以下のとき結果はゼロ', function() {
      // HTTPResponse.getContentText の上書き
      Sugar.Object.set(mymock, 'HTTPResponse.getContentText', function(charset) {
        json.result = [{
          update_id: -1,
          message: {}
        }];
        return JSON.stringify(json);
      });
      json = glib.gu_telegraGetUpdates_(url);
      result = glib.gu_createPayloadList_(json, uid);
      assert.equal(result.length, 0);
    });

    it('UIDが等しいとき結果はゼロ');

    it('空文字のとき結果はゼロ', function() {
      // HTTPResponse.getContentText の上書き
      Sugar.Object.set(mymock, 'HTTPResponse.getContentText', function(charset) {
        json.result = [{
          update_id: 310645964,
          message: {
            text: '  　 　  　'
          }
        }];
        return JSON.stringify(json);
      });
      json = glib.gu_telegraGetUpdates_(url);
      result = glib.gu_createPayloadList_(json, uid);
      assert.equal(result.length, 0);
    });

    it('プレビューオフ', function() {
      // HTTPResponse.getContentText の上書き
      Sugar.Object.set(mymock, 'HTTPResponse.getContentText', function(charset) {
        json.result = [{
          update_id: 310645964,
          message: {
            message_id: 792,
            from: {
              id: 289888283
            },
            chat: {
              id: 289888283,
              type: 'private'
            },
            date: 1494591008,
            text: 'hello world'
          }
        }];
        return JSON.stringify(json);
      });
      json = glib.gu_telegraGetUpdates_(url);
      result = glib.gu_createPayloadList_(json, uid);
      assert.equal(result[0].disable_web_page_preview, true);
    });

    it('通知オフ', function() {
      assert.equal(result[0].disable_notification, true);
    });
  });
});
