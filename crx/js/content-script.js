(function () {
    var getDataForCrxBackground = function () {
        try {
            var projectName = document.getElementsByName('tbName')[0].value;
            var appId = document.getElementsByName('tbAppID')[0].value;
            var packageUrl = document.getElementById('download-manaul').href;
            return {
                projectName, appId, packageUrl
            };
        } catch (ex) {
            alert('Please ensure that you are in the yunzhi wxapp publish page, and at the last step of manual publish!');
        }
    }

    var getDataFromWxAppApi = function (callback) {
        var wxAppId = getCookie('WxAppID');
        if (!wxAppId) {
            alert('Can not find the wxAppId');
            return;
        }
        var url = '/index.php?c=admin/WxApp/WxAppManage&a=getinfo&id=' + wxAppId;
        var req = new XMLHttpRequest();
        // Can not use asynchronous the method 'chrome.runtime.onMessage.addListener'
        req.open('get', url, false);
        req.onload = function (e) {
            if (this.status == 200 || this.status == 304) {
                try {
                    var rtnData = JSON.parse(this.responseText);
                } catch (ex) {
                    alert('Can not get the data from api, the api return data is not in the json format');
                    return;
                }

                if (!rtnData.success) {
                    alert(rtnData.msg);
                    return;
                }
                var projectName = rtnData.info.Name;
                var appId = rtnData.info.AppID;
                var downloadBtn = document.getElementById('download-manaul');
                if (!downloadBtn) {
                    alert('Please ensure that you are in the yunzhi wxapp publish page, and at the last step of the manual downloading process');
                    return;
                }
                var packageUrl = downloadBtn.href;
                var data = {
                    projectName, appId, packageUrl
                };
                callback(data);
            }
        }
        req.ontimeout = function (e) {
            alert('Get the data timeout');
        };
        req.onerror = function (e) {
            alert('Get the data falied: ' + e.data);
        };
        req.send();
    }

    var getData = function (callback) {
        if (/wxapppublish/i.test(window.hash)) {
            callback(getDataForCrxBackground());
        } else {
            getDataFromWxAppApi(callback);
        }
    }

    var getCookie = function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        return (arr = document.cookie.match(reg)) ? arr[2] : null;
    }

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.cmd === 'getWxAppData') {
            getData(sendResponse);
            return;
        }
        alert('No such command for chrome message listener');
    });
})();