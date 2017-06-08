function doPost(e) {
  var json = JSON.parse(e.postData.contents);

  var update_id = Number(json.update_id);
  if(isNaN(update_id)) throw new Error('update_id');

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
