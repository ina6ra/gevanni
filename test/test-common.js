var init = require('./init-mock');
var assert = init.assert;
var Sugar = init.Sugar;
var config = init.config;
var fx = init.fx;

var gas = init.gas;
var mymock = init.mymock;
var glib = init.glib;

describe('Common.js', function() {

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
      result = glib.Common.createPayloadList(json);
      assert.typeOf(result, 'Array');
    });

    it('update_idがないとき結果はゼロ', function() {
      json.result = [fx.common.createPayloadList.uid.empty];
      result = glib.Common.createPayloadList(json);
      assert.equal(result.length, 0);
    });

    it('UIDが等しいとき結果はゼロ', function() {
      // Properties.getProperty の上書き
      Sugar.Object.set(mymock, 'Properties.getProperty', function(key) {
        return setup['ScriptProperties'][key];
      });
      uid = glib.telegram.getUpdateID();
      json.result = [fx.common.createPayloadList.uid.equal];
      result = glib.Common.createPayloadList(json, uid);
      assert.equal(result.length, 0);
    });

    it('UID以下のとき結果はゼロ', function() {
      json.result = [fx.common.createPayloadList.uid.less];
      result = glib.Common.createPayloadList(json, uid);
      assert.equal(result.length, 0);
    });

    it('UIDのチェックをしない');

    it('message_id が無いとき結果はゼロ', function() {
      json.result = [fx.common.createPayloadList.message.id];
      result = glib.Common.createPayloadList(json);
      assert.equal(result.length, 0);
    });

    it('from.id が無いとき結果はゼロ', function() {
      json.result = [fx.common.createPayloadList.message.from_id];
      result = glib.Common.createPayloadList(json);
      assert.equal(result.length, 0);
    });

    it('text が無いとき結果はゼロ', function() {
      json.result = [fx.common.createPayloadList.message.text];
      result = glib.Common.createPayloadList(json);
      assert.equal(result.length, 0);
    });

    it('text が空文字のとき結果はゼロ', function() {
      json.result = [fx.common.createPayloadList.message.empty];
      result = glib.Common.createPayloadList(json);
      assert.equal(result.length, 0);
    });

    it('プレビューオフ', function() {
      json.result = [fixture['createPayloadList']['all']]
      result = glib.Common.createPayloadList(json);
      assert.equal(result[0].disable_web_page_preview, true);
    });

    it('通知オフ', function() {
      assert.equal(result[0].disable_notification, true);
    });
  });
});
