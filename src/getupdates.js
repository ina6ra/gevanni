function myGetUpdates() {
  var sp = PropertiesService.getScriptProperties();
  Telegram.BotAPI.setProperties(sp.getProperties());

  var uid = Telegram.BotAPI.getUpdateID();

  var payload = {};
  payload['offset'] = uid;

  var json = Telegram.BotAPI.getUpdates(payload);
  if(json == false) return json;

  var result = common.createPayloadList(json, uid);
  if(result.length == 0) return false;

  var url = Telegram.BotAPI.getApiUrl('sendMessage');
  var text = '';

  result.forEach(function(res) {
    text = UrlFetchApp.fetch(url, {
      'method': 'post',
      'muteHttpExceptions': true,
      'payload': res
    });
  });

  sp.setProperty('update_id', String(json.result.pop().update_id));

  return true;
}
