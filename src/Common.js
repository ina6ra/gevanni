var Common = {

  createPayloadList: function(json, uid) {
    var update_id = 0;
    var text = '';
    var result = [];
    json.result.forEach(function(chat) {
      update_id = Number(chat.update_id);
      if(isNaN(update_id)) return;
      if(update_id == uid) return;
      if(update_id < uid) return;

      if(chat.message.message_id == null) return;
      if(chat.message.from.id == null) return;
      if(chat.message.text == null) return;

      text = chat.message.text.replace(/　/g, '').trim();
      if(text == '') return;

      // JsでURI（URL）エンコードとURIデコード - wiki - PCスキルの小技・忘却防止メモ
      // http://tips.recatnap.info/wiki/Js%E3%81%A7URI%EF%BC%88URL%EF%BC%89%E3%82%A8%E3%83%B3%E3%82%B3%E3%83%BC%E3%83%89%E3%81%A8URI%E3%83%87%E3%82%B3%E3%83%BC%E3%83%89
      text = encodeURIComponent(text);
//      text = encodeURI(text);
      result.push({
        'chat_id': chat.message.from.id,
        'text': 'https://www.google.co.jp/search?q='+text,
        'reply_to_message_id': chat.message.message_id,
        'disable_web_page_preview': true,
        'disable_notification': true
      });
    });
    return result;
  },

  sendMessage: function(result) {
    var url = Telegram.BotAPI.getApiUrl('sendMessage');
    var text = '';

    result.forEach(function(res) {
      text = UrlFetchApp.fetch(url, {
        'method': 'post',
//        'muteHttpExceptions': true,
        'payload': res
      });
    });
  }
};
