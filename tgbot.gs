botUsername="sheetsApi_bot";
botName="sheetsApiExample";
botId="2013992015:AAHS_W1x_utmY_LkZbiKLvyc-EInG5Bi3tk";
botLink="https://api.telegram.org/bot"+botId;
deploy_id="AKfycbzGJB8ZuZh0f6PCyYOPqsd04MNbtv_aMTa4rbQ0kJjqe2eYRUWuaVQhy1NKrLfu4KF7"
App_link="https://script.google.com/macros/s/"+deploy_id+"/exec"

sheetswebapp_name="sheetsWebApp"
google_oauth_credential_client_id="78303811704-bae8j1iealp3op83qdml6k81kicgn97l.apps.googleusercontent.com"

setwebhookurl="https://api.telegram.org/bot2013992015:AAHS_W1x_utmY_LkZbiKLvyc-EInG5Bi3tk/setWebHook?url=https://script.google.com/macros/s/"+deploy_id+"/exec"
deletewebhookurl="https://api.telegram.org/bot2013992015:AAHS_W1x_utmY_LkZbiKLvyc-EInG5Bi3tk/setWebHook?url="
tableId="10N6sCsCWGlTvvr5ltxKlFQxIV6V3m2X6J_-1vI57RSQ"

cols={
	"id":"A",
	"name1":"B",
	"name2":"C",
	"name3":"D",
	"birthdate":"E",
	"adress":"F",
	"phone":"G"
}


function send (msg, chat_id) {
  let payload = {
  'method': 'sendMessage',
  'chat_id': String(chat_id),
  'text': msg,
  'parse_mode': 'HTML'
  }
  let data = {
    'method': 'post',
    'payload': payload
  }
    UrlFetchApp.fetch('https://api.telegram.org/bot' + botId + '/', data);
}

function sendWithKeyboard(msg,chat_id,keyboard){
  // let payload = {
  // 'method': 'sendMessage',
  // 'chat_id': String(chat_id),
  // 'text': msg,
  // 'parse_mode': 'HTML',
  // 'reply_markup': JSON.stringify(keyboard)
  // }
  let data = {
    'method': 'post',
    'payload': {
      'method': 'sendMessage',
      'chat_id': String(chat_id),
      'text': msg,
      'parse_mode': 'HTML',
      'reply_markup': JSON.stringify(keyboard)
    }
  }
    UrlFetchApp.fetch('https://api.telegram.org/bot' + botId + '/', data);
}

Date.prototype.ddmmyyyy=function(){
  d=""
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [(dd>9 ? '' : '0') + dd, (mm>9 ? '' : '0') + mm, this.getFullYear(),].join('.');
}

function rowToCols(row){
  return Object.keys(cols).reduce((obj, key, index) => ({ ...obj, [key]: row[index] }), {});
}

function doPost(e) {
  let contents = JSON.parse(e.postData.contents);
  //нам нужен только тип "сообщение"
  if (contents.hasOwnProperty('message')) {
    let msg = contents.message;
    let chat_id = msg.chat.id;
    let text = msg.text;
    let user = msg.from.username;
    var result = SpreadsheetApp.openById(tableId).getSheetByName("Лист1").getRange("a2:e6").getValues();
    if(contents.callback_data){
      
    }
    if (text == "/hello") {
      try{
        var a=""
        result.forEach(i=>{a+=i.join(": ")+"\n"})
        send(a,chat_id);
      }
      catch(e){
        send("error: "+e.message, chat_id)

      }
    }
    else if(text=="/query"){
      try{
        var a=""
        cols2=Object.keys(cols)
        result.forEach(i=>{
          var ar=rowToCols(i)
          //a+= i[0]+ " ФИО: "+i[cols2.indexOf("name1")]+" "+i[cols2.indexOf("name2")]+" "+i[cols2.indexOf("name3")]+"\n"})
          a+= ar["id"]+ " <b>ФИО</b>: "+ar["name1"]+" "+ar["name2"]+" "+ar["name3"]+"\n<b>Дата рожд.</b>: "+(new Date(ar["birthdate"])).ddmmyyyy()+"\n"})
        var keyBoard ={ 
          "keyboard": [["OK","Cancel"]],
          "one_time_keyboard":true,
          "resize_keyboard":true
        };
        var inlinekeyBoard ={ 
          "inline_keyboard": [
            [{
              "text":"OK",
              "callback_data":"okokok"
            }],
            [{
              "text":"cancel", 
              "callback_data":"ccc"
            }]
          ],
          "one_time_keyboard":true,
          "resize_keyboard":true
        };
        sendWithKeyboard(a,chat_id,inlinekeyBoard);

        // send(a,chat_id);
      }
      catch(e){
        send("error: "+e.message, chat_id)
      }
    }
  }
}

function doGet(e){
	return HtmlService.createHtmlOutput("doGet success");
}

function api_connector () {
  UrlFetchApp.fetch("https://api.telegram.org/bot"+botLink+"/setWebHook?url="+App_link); 
}

function get(){
  u=botLink+"/getMe"
  r=UrlFetchApp.fetch(u)
  Logger.log(r)
}

function setWebhook(){
	r=UrlFetchApp.fetch(setwebhookurl)
	Logger.log(r.getContentText())
}

function deleteWebhook(){
	r=UrlFetchApp.fetch(deletewebhookurl)
	Logger.log(r.getContentText())
}
