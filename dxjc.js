chrome.storage.sync.get("num",function(date){
  if (date['num'] == "-1"){
    localStorage['num'] = "0";
    chrome.storage.sync.set({'num': "0"});
  }
})

if (document.title == ""){ // 检查标题是否为空, 被劫持标题一般都是空的.
  var html = document.body.outerHTML;
  if (html.split("<iframe").length-1 != -1){ // 寻找iframe, 被劫持一定会有iframe的.
    var url = document.URL;
    var src = document.getElementById("contenid").src;
    if (src == url+"?" || src == url+"&"){ // 检查iframe的地址, 确认是否被劫持.
      // 获取广告URL
      var u = document.body.outerHTML.split("<a href=\"")[1].split("\" target=\"_blank\"")[0];
      // 刷新页面.
      top.location.href = url;
      // 请求广告URL, 让劫持者认为已点击广告.
      if (u){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", u,true);
        xhr.send(null);
      }
      // 保存被运营商劫持的次数.
      if (window.localStorage){
        var num = localStorage['num'];
        if (!parseInt(num)){
          num = "0";
        }
        num = parseInt(num) + 1;
        chrome.storage.sync.set({'num': String(num)});
        localStorage['num'] = num;
      }
    }
  }
}