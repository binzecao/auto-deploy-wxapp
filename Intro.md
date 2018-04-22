# 实现思路

记录下，免得时间长忘记。
<br>
<br>
<br>

## 前端

> 前端使用谷歌crx插件方式，将功能的入口添加在特定右键菜单里。
>
> 访问云指小程序发布页，点击右键，点击自动发布按钮，然后弹出页面，通过这个页面提交信息，与后端做交互。

<br>
<br>

## 后端

> 后端做websocket服务端，监听前端请求，然后根据提交信息实现将小程序自动部署到微信开发者工具上。
>
> 前端提交数据后，后端实现如下步骤：
>
> 1. 检查信息输入
> 2. 获取代码包地址
> 3. 远程请求下载代码包
> 4. 解压到指定目录
> 5. 更改文件配置(config.js)
> 6. 创建工程配置文件(project.config.js)
> 7. 创建bat文件，用于打开编辑器
> 8. 执行bat文件打开项目
> 9. 返回成功信息给前端

<br>
<br>

## 前端用到的一些技术

### crx

主要实现右键点击菜单，获取当前页面数据的功能。

在crx的背景页的**background.js**，增加创建鼠标右键页面的功能。

```javascript
// 创建右键菜单
chrome.contextMenus.create({
  type: 'normal',
  title: 'open in wx editor', // 右键标题
  contexts: ['page', 'link'], // 限制出现范围
  documentUrlPatterns: ['*://*/admin/index.html'], // 只在此页面右键菜单  
  onclick: function () {
  }
});
```

在小程序发布页面中，注入**content-script.js**，使得插件拥有操作页面dom的能力。

**manifest.json**中配置：

```json
  "content_scripts": [
    {
      "matches": [
        "*://*/admin/index.html"
      ],
      "js": [
        "js/content-script.js"
      ],
      "run_at": "document_idle"
    }
  ],
```

然后在**content-script.js**中监听事件：

```javascript
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // 可以用 document.getElementById 这种api获取信息
  var data = {};
  sendResponse(data);
});
```

右键菜单点击时触发事件：

```javascript
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

// 触发事件，主动与content-script通信
sendMessageToContentScript({ cmd: 'aa', msg: 'bb'}, (data) => { showForm(data) });
```

这样，右键菜单就可以与**content-script.js**通信了。

<br>
<br>

### websocket

使用**socket.io**这个js组件实现与后端交互。

<br>
<br>

## 后端用到的一些技术

用nodeJs实现，

使用**socket.io**这个模块实现websocket的监听。

使用Pkg这个模块进行打包。

使用mocha做单元测试。


<br>
<br>

### Token

使用token校验，防止重复提交

后端设置全局唯一token，**服务启动**或者**成功执行完一次自动部署流程**，均会刷新token，并且将这个token推送到所有socket中。

前端监听**refreshToken**事件，用作接收后端发送的最新token，然后每次提交数据时，将这个token一起提交。




