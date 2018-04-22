'use strict';

// 创建右键
chrome.contextMenus.create({
  type: 'normal',
  title: 'open in wx editor', // 右键标题
  contexts: ['page', 'link'], // 限制出现范围
  documentUrlPatterns: [
    '*://*/admin/index.html',
    '*://*/home/shopadmin*/',
    '*://*/home/siteadmin*/'
  ], // 只在此页面右键菜单  
  onclick: function () {
    /* 这样是不行的，因为这个js执行在background.html，所以没有这些元素
    var projectName = document.getElementsByName('tbName')[0].value;
    var appId = document.getElementsByName('tbAppID')[0].value;
    var packageUrl = document.getElementsById('download-manaul').href;
    var params = '&projectName=' + projectName + '&appId=' + appId + '&packageUrl=' + packageUrl;
    */

    // 与content-script.js通信，获取信息
    var message = {
      cmd: 'getWxAppData'
    };
    var callback = function (data) {
      // 拼接参数
      var params = '&projectName=' + encodeURIComponent(data.projectName)
        + '&appId=' + encodeURIComponent(data.appId)
        + '&packageUrl=' + encodeURIComponent(data.packageUrl);

      // 显示form页面
      showForm(params);
    };
    sendMessageToContentScript(message, callback);
  }
});

/**
 * 向content-script.js发送信息，主要用于获取客户端页面信息
 * @param {string} message 
 * @param {function} callback 
 */
function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
      if (callback) callback(response);
    });
  });
}

/**
 * 显示form页面
 * @param {string} params 
 */
function showForm(params) {
  // showFormInNewTab(params);
  showFormInFloatWindow(params);
}

/**
 * 创建新标签
 * @param {string} params 
 */
function showFormInNewTab(params) {
  var url = 'html/form.html?' + params;
  chrome.tabs.create({ url: url });
}

/**
 * 弹出浮动窗体
 * @param {string} params 
 */
function showFormInFloatWindow(params) {
  var url = 'html/form.html?' + params;
  var name = 'crxFrame';
  var iWidth = 600;
  var iHeight = 620;
  var iTop = (window.screen.height - 30 - iHeight) / 2; //获得窗口的垂直位置;   
  var iLeft = (window.screen.width - 10 - iWidth) / 2; //获得窗口的水平位置;
  var win = window.open(url, name, 'height=' + iHeight + ',width=' + iWidth + ',top=' + iTop + ',left=' + iLeft
    + ',toolbar=no,menubar=no,scrollbars=auto,resizable=no,location=no,status=no');
  win.focus();
}