if (window.localStorage){
  chrome.storage.sync.get("num",function(date){
    var num = date['num'];
    if (parseInt(num) > 0){
      document.getElementById("num").innerHTML = "你被嘿嘿嘿了" + num + "次.";
    }
  })
}

document.getElementById("rs").addEventListener('click', function(){
  chrome.storage.sync.set({'num': "-1"});
  document.getElementById("num").innerHTML = "你还是纯洁的.";
}, false);