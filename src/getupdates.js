function gu_getUpdateID_() {
  var sp = PropertiesService.getScriptProperties();
  var uid = sp.getProperty('update_id');
  if(uid == null) uid = 0;
  return Number(uid);
}

function gu_getApiToken_() {
  var sp = PropertiesService.getScriptProperties();
  var token = sp.getProperty('api_token');
  return token;
}

function gu_telegraApiUrl_(token, method) {
  var url = 'https://api.telegram.org/bot'+token+'/'+method;
  return url;
}

function gu_telegraGetUpdates_(url, uid) {
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

function gu_createPayloadList_(json, uid) {
  var update_id = 0;
  var text = '';
  var result = [];
  json.result.forEach(function(chat) {
    update_id = Number(chat.update_id);
    if(update_id <= uid  ) return;
    text = chat.message.text.replace(/　/g, '').trim();
    if(text == '') return;
    // JsでURI（URL）エンコードとURIデコード - wiki - PCスキルの小技・忘却防止メモ
    // http://tips.recatnap.info/wiki/Js%E3%81%A7URI%EF%BC%88URL%EF%BC%89%E3%82%A8%E3%83%B3%E3%82%B3%E3%83%BC%E3%83%89%E3%81%A8URI%E3%83%87%E3%82%B3%E3%83%BC%E3%83%89
    text = encodeURIComponent(text);
//    text = encodeURI(text);
    result.push({
      'chat_id': chat.message.from.id,
      'text': 'https://www.google.co.jp/search?q='+text,
      'reply_to_message_id': chat.message.message_id,
      'disable_web_page_preview': true,
      'disable_notification': true
    });
  });
  return result;
}

function myGetUpdates() {
  var uid = gu_getUpdateID_();
  var token = gu_getApiToken_();

  var url = gu_telegraApiUrl_(token, 'getUpdates');

  var json = gu_telegraGetUpdates_(url, uid);
  if(json == false) return json;

  var result = gu_createPayloadList_(json, uid);

  url = gu_telegraApiUrl_(token, 'sendMessage');

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

  return false;
}
