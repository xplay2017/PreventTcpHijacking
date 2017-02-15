if (window.localStorage){
  chrome.storage.sync.get("num",function(data){
    var num = document.getElementById("num");
    if (parseInt(num) > 0){
      num.innerHTML = "你被嘿嘿嘿了" + data['num'] + "次.";
    }else{
      num.innerHTML = "你的浏览器还是纯洁的.";
    }
  });
  chrome.storage.sync.get("clickAD",function(data){
    if (data['clickAD']){
      document.getElementById("clickAD").checked = true;
    }
  });
}

document.getElementById("rs").addEventListener('click', function(){
  chrome.storage.sync.set({'num': -1});
  document.getElementById("num").innerHTML = "你的浏览器还是纯洁的.";
}, false);

document.getElementById("clickAD").addEventListener('click', function(){
  chrome.storage.sync.set({'clickAD': document.getElementById("clickAD").checked});
}, false);
