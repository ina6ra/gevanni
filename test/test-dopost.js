var assert = require('chai').assert;
var Sugar = require('sugar');
var config = require('config');

// $ yarn add https://github.com/ina6ra/gas-mock
var gas = require('gas-mock');

var mymock = gas.globalMockDefault;

// ソースフォルダの指定はプロジェクトルートからの相対パス
var glib = gas.require('./src', mymock);

describe('dopost.js', function() {

  var e;
  var result;
  var data;
  
  // test for doPost()
  describe('#doPost()', function() {

    it('引数がnullの場合はエラー', function() {
      e = null;
      result = glib.doPost(e);
      assert.equal(result, 'e');
    });

    it('postDataがない場合はエラー', function() {
      e = {};
      result = glib.doPost(e);
      assert.equal(result, 'postData');
    });

    it('contentsがない場合はエラー', function() {
      e = {
        postData: {}
      };
      result = glib.doPost(e);
      assert.equal(result, 'contents');
    });

    it('update_idがない場合はエラー', function() {
      data = {};
      e.postData.contents = JSON.stringify(data);
      result = glib.doPost(e);
      assert.equal(result, 'update_id');
    });

    it('投稿済であればエラー', function() {
      data = {
        update_id: 12345
      };
      e.postData.contents = JSON.stringify(data);
      result = glib.doPost(e);
      assert.equal(result, 'update_id2');
    });

    it('messageがない場合はエラー', function() {
      data.update_id = 123456;
      e.postData.contents = JSON.stringify(data);
      result = glib.doPost(e);
      assert.equal(result, 'message');
    });

    it('message_idがない場合はエラー', function() {
      Sugar.Object.merge(data, {message: {}}, {deep: true});
      e.postData.contents = JSON.stringify(data);
      result = glib.doPost(e);
      assert.equal(result, 'message_id');
    });

    it('fromがない場合はエラー', function() {
      data.message = {
        message_id: 123
      };
      e.postData.contents = JSON.stringify(data);
      result = glib.doPost(e);
      assert.equal(result, 'from');
    });

    it('from.idがない場合はエラー', function() {
      Sugar.Object.merge(data.message, {from: ''}, {deep: true});
      e.postData.contents = JSON.stringify(data);
      result = glib.doPost(e);
      assert.equal(result, 'from.id');
    });

    it('textがない場合はエラー', function() {
      data.message.from = {id: 12345678};
      e.postData.contents = JSON.stringify(data);
      result = glib.doPost(e);
      assert.equal(result, 'text');
    });

    it('本文がない場合はエラー', function() {
      Sugar.Object.merge(data.message, {text: '  　 　  　'}, {deep: true});
      e.postData.contents = JSON.stringify(data);
      result = glib.doPost(e);
      assert.equal(result, 'text2');
    });

    it('最後まで実行できたらtrue', function() {
      var setup = config.get('Setup');
      // Properties.getProperty の上書き
      Sugar.Object.set(mymock, 'Properties.getProperty', function(key) {
        return setup['ScriptProperties'][key];
      });
      // UrlFetchApp.fetch の上書き
      Sugar.Object.set(mymock, 'UrlFetchApp.fetch', function(url, params) {
        return this.response;
      });
      Sugar.Object.merge(data, {update_id: 12345678}, {deep: true});
      data.message.text = 'gas post test';
      e.postData.contents = JSON.stringify(data);
      result = glib.doPost(e);
      assert.equal(result, true);
    });
  });
});
