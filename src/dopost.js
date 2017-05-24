function doPost(e) {
  if(e == null) return 'e';
  if(e.postData == null) return 'postData';
  if(e.postData.contents == null) return 'contents';

  var json = JSON.parse(e.postData.contents);

  if(json.update_id == null) return 'update_id';

  var update_id = Number(json.update_id);
  var uid = telegram.getUpdateID();

  if(update_id == uid) return 'update_id2';
  if(update_id < uid) return 'update_id3';

  if(json.message == null) return 'message';
  if(json.message.message_id == null) return 'message_id';
  if(json.message.from == null) return 'from';
  if(json.message.from.id == null) return 'from.id';

  if(json.message.text == null) return 'text';
  var text = json.message.text.replace(/　/g, '').trim();
  if(text == '') return 'text2';

  var result = {
    ok: true,
    result: []
  };
  result.result.push(json);
  result = common.createPayloadList(result);

  var token = telegram.getApiToken();
  var url = telegram.getApiUrl(token, 'sendMessage');

  var text = '';
  result.forEach(function(res) {
    text = UrlFetchApp.fetch(url, {
      'method': 'post',
      'muteHttpExceptions': true,
      'payload': res
    });
  });

  var sp = PropertiesService.getScriptProperties();
  sp.setProperty('update_id', String(update_id));

  return true;
}
