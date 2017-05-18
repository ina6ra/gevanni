function myGetUpdates() {
  var uid = telegram.getUpdateID();
  var token = telegram.getApiToken();

  var url = telegram.getApiUrl(token, 'getUpdates');
  
  var json = telegram.getUpdates(url, uid);
  if(json == false) return json;

  var result = telegram.createPayloadList(json, uid);

  if(result.length == 0) return false;

  url = telegram.getApiUrl(token, 'sendMessage');

  var text = '';

  result.forEach(function(res) {
    text = UrlFetchApp.fetch(url, {
      'method': 'post',
      'muteHttpExceptions': true,
      'payload': res
    });
  });

  var sp = PropertiesService.getScriptProperties();
  sp.setProperty('update_id', String(json.result.pop().update_id));

  return true;
}
