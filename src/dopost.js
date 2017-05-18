function doPost(e) {
  if(e == null) return 'e';
  if(e.postData == null) return 'postData';
  if(e.postData.contents == null) return 'contents';
  
  var json = JSON.parse(e.postData.contents);

  if(json.message == null) return 'message';
  if(json.message.message_id == null) return 'message_id';
  if(json.message.from == null) return 'from';
  if(json.message.from.id == null) return 'from.id';

  if(json.message.text == null) return 'text';
  var text = json.message.text.replace(/　/g, '').trim();
  if(text == '') return 'text2';

  telegram = new TelegramAPI();
  var uid = telegram.getUpdateID();
  var token = telegram.getApiToken();

  var result = {
    ok: true,
    result: []
  };
  result.result.push(json);
  result = telegram.createPayloadList(result);

  var url = telegram.getApiUrl(token, 'sendMessage');

  var text = '';
  result.forEach(function(res) {
    text = UrlFetchApp.fetch(url, {
      'method': 'post',
      'muteHttpExceptions': true,
      'payload': res
    });
  });

  return true;
}
