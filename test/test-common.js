var assert = require('chai').assert;
var Sugar = require('sugar');
var config = require('config');
var fx = require('node-fixtures');

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

  // test for createPayloadList()
  describe('#createPayloadList()', function() {

    it('should return Array Class', function() {
      json = fx.common.createPayloadList.Array;
      result = glib.common.createPayloadList(json);
      assert.typeOf(result, 'Array');
    });

//    it('UIDが等しいとき結果はゼロ', function() {
//      // HTTPResponse.getContentText の上書き
//      Sugar.Object.set(mymock, 'HTTPResponse.getContentText', function(charset) {
//        json.result = [fixture['createPayloadList']['uid']['equal']];
//        return JSON.stringify(json);
//      });
//      json = glib.telegram.getUpdates(url);
//      result = glib.common.createPayloadList(json, uid);
//      assert.equal(result.length, 0);
//    });
//
//    it('UID以下のとき結果はゼロ', function() {
//      // HTTPResponse.getContentText の上書き
//      Sugar.Object.set(mymock, 'HTTPResponse.getContentText', function(charset) {
//        json.result = [fixture['createPayloadList']['uid']['less']];
//        return JSON.stringify(json);
//      });
//      json = glib.telegram.getUpdates(url);
//      json.result = [fx.common.createPayloadList.uid.equal];
//      result = glib.common.createPayloadList(json, uid);
//      assert.equal(result.length, 0);
//    });

    it('UIDのチェックをしない');

    it('空文字のとき結果はゼロ', function() {
      json.result = [fx.common.createPayloadList.empty];
      result = glib.common.createPayloadList(json);
      assert.equal(result.length, 0);
    });

    it('プレビューオフ', function() {
      json.result = [fixture['createPayloadList']['all']]
      result = glib.common.createPayloadList(json);
      assert.equal(result[0].disable_web_page_preview, true);
    });

    it('通知オフ', function() {
      assert.equal(result[0].disable_notification, true);
    });
  });
});
