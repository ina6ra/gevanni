var init = require('./init-mock');
var assert = init.assert;
var Sugar = init.Sugar;
var config = init.config;
var fx = init.fx;

var gas = init.gas;
var mymock = init.mymock;
var glib = init.glib;

describe('getupdates.js', function() {

  var setup = config.get('Setup');
  var fixture = config.get('Fixture');

  // test for myGetUpdates()
  describe('#myGetUpdates()', function() {

    it('投稿テスト', function() {
      // Properties.getProperty の上書き
      Sugar.Object.set(mymock, 'Properties.getProperty', function(key) {
        return setup['ScriptProperties'][key];
      });
      // HTTPResponse.getContentText の上書き
      Sugar.Object.set(mymock, 'HTTPResponse.getContentText', function(charset) {
        var json = {
          result: [fixture['createPayloadList']['all']]
        };
        return JSON.stringify(json);
      });
      // UrlFetchApp.fetch の上書き
      Sugar.Object.set(mymock, 'UrlFetchApp.fetch', function(url, params) {
        return this.response;
      });
      assert.equal(glib.myGetUpdates(), true);
    });
  });
});
