function myGetUpdates() {
  var sp = PropertiesService.getScriptProperties();
  Telegram.BotAPI.setProperties(sp.getProperties());

  var uid = Telegram.BotAPI.getUpdateID();

  var payload = {};
  payload['offset'] = uid;

  var json = Telegram.BotAPI.getUpdates(payload);
  if(json == false) return json;

  var result = Common.createPayloadList(json, uid);
  if(result.length == 0) return false;

  Common.sendMessage(result);

  sp.setProperty('update_id', String(json.result.pop().update_id));

  return true;
}
