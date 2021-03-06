function doPost(e) {
  var sp = PropertiesService.getScriptProperties();
  Telegram.BotAPI.setProperties(sp.getProperties());
  var json = JSON.parse(e.postData.contents);

  var update_id = Number(json.update_id);
  if(isNaN(update_id)) throw new Error('update_id');

  var result = {
    ok: true,
    result: []
  };
  result.result.push(json);
  result = Common.createPayloadList(result);

  Common.sendMessage(result);

  sp.setProperty('update_id', String(update_id));

  return true;
}
