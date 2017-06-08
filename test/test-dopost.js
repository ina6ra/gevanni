var expect = require('chai').expect;
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
  var error;

  // test for doPost()
  describe('#doPost()', function() {

    it('引数にpostDataが含まれていない場合はエラー', function() {
      e = null;
      error = (()=>glib.doPost(e));
      expect(error).to.throw(/postData/);
    });

    it('引数にcontentsが含まれていない場合はエラー', function() {
      e = {postData: {}};
      error = (()=>glib.doPost(e));
      expect(error).to.throw(/JSON at position/);
    });

    it('引数にupdate_idが含まれていない場合はエラー', function() {
      data = {};
      e.postData.contents = JSON.stringify(data);
      error = (()=>glib.doPost(e));
      expect(error).to.throw(/update_id/);
    });

    it('エラーなく最後まで実行できたらtrue', function() {
      data = {
        update_id: 1234567,
        message: {
          message_id: 123,
          from: {
            id: 12345678
          },
          text: 'test'
        }
      };
      e.postData.contents = JSON.stringify(data);
      // UrlFetchApp.fetch の上書き
      Sugar.Object.set(mymock, 'UrlFetchApp.fetch', function(url, params) {
        return this.response;
      });
      error = (()=>{result = glib.doPost(e)});
      expect(error).to.not.throw();
      expect(result).to.equal(true);
    });
  });
});
