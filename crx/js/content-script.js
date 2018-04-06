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
            alert('plz ensure that you are in the yunzhi wxapp publish page, and at the last step of manual publish!');
        }
    }

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        var data = getDataForCrxBackground();
        sendResponse(data);
    });
})();