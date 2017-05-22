var TelegramAPI = function() {

  this.getUpdateID = function() {
    var sp = PropertiesService.getScriptProperties();
    var uid = sp.getProperty('update_id');
    if(uid == null) uid = 0;
    return Number(uid);
  }

  this.getApiToken = function() {
    var sp = PropertiesService.getScriptProperties();
    var token = sp.getProperty('api_token');
    return token;
  }

  this.getApiUrl = function(token, method) {
    var url = 'https://api.telegram.org/bot'+token+'/'+method;
    return url;
  }

  this.getUpdates = function(url, uid) {
    var payload = {};
    if(uid != null) payload['offset'] = uid;
    var json = UrlFetchApp.fetch(url, {
      'method': 'post',
      'muteHttpExceptions': true,
      'payload': payload
    });
    json = JSON.parse(json.getContentText());
    if(json.ok == false) return json.ok;
    return json;
  }
};

var telegram = new TelegramAPI();
