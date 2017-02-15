chrome.storage.sync.get("num",function(data){
  if (data['num'] == -1){
    localStorage['num'] = 0;
    chrome.storage.sync.set({'num': 0});
  }
})

chrome.storage.sync.get("clickAD",function(data){
  if(data["clickAD"]){
    localStorage['clickAD'] = data["clickAD"];
  }else{
    localStorage['clickAD'] = false;
    chrome.storage.sync.set({'clickAD': false});
  }
})

if (document.title == ""){ // 检查标题是否为空, 被劫持标题一般都是空的.
  var html = document.body.outerHTML;
  if (html.split("<iframe").length-1 != -1){ // 寻找iframe, 被劫持一定会有iframe的.
    var url = document.URL;
    var contenid = document.getElementById("contenid");
    if (contenid){
      var src = contenid.src;
      if (src == url+"?" || src == url+"&"){ // 检查iframe的地址, 确认是否被劫持.
        // 判断是否需要模拟点击广告
        if (localStorage['clickAD']){
          // 获取广告URL
          var u = html.split("var content='")[1];
          // 请求广告URL, 让劫持者认为已点击广告.
          if (u){
            u = u.split("'")[0];
            var xhr = new XMLHttpRequest();
            xhr.open("GET", u, true);
            xhr.onreadystatechange = function() {
              if (xhr.readyState == 4 && xhr.status == 200) {
                var dom = loadXMLString(xhr.responseText);
                var theForm = dom.forms['form1'];
                if (!theForm) {
                  theForm = dom.form1;
                }
                if (!theForm.onsubmit || (theForm.onsubmit() != false)) {
                  var xhr1 = new XMLHttpRequest();
                  xhr1.open("POST", u, true);
                  xhr1.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                  var data = "__EVENTTARGET=btnNoNeed&__EVENTARGUMENT=&__VIEWSTATE=";
                  data += encodeURIComponent(theForm.__VIEWSTATE.value);
                  data += "&__VIEWSTATEGENERATOR=";
                  data += theForm.__VIEWSTATEGENERATOR.value;
                  data += "&__EVENTVALIDATION=";
                  data += encodeURIComponent(theForm.__EVENTVALIDATION.value);
                  xhr1.send(data);
                }
              }
            };
            xhr.send(null);
          }
        }
        // 刷新页面.
        top.location.href = url;
        // 保存被运营商劫持的次数.
        if (window.localStorage){
          var num = localStorage['num'];
          if (!num){
            num = 0;
          }
          num += 1;
          chrome.storage.sync.set({'num': num});
          localStorage['num'] = num;
        }
      }
    }
  }
}

/*字符串转dom对象*/
function loadXMLString(txt)
{
  try //Internet Explorer
   {
     xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
     xmlDoc.async="false";
     xmlDoc.loadXML(txt);
     return(xmlDoc);
   }
  catch(e)
   {
     try //Firefox, Mozilla, Opera, etc.
      {
        parser=new DOMParser();
        xmlDoc=parser.parseFromString(txt,"text/xml");
        return(xmlDoc);
      }
     catch(e) {alert(e.message)}
   }
  return(null);
}
