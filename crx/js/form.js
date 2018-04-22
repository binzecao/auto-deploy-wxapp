var socket = null;
var token = '';

function getUrlParams() {
    var search = window.location.search;
    var tmparray = search.substr(1, search.length).split("&");
    var paramsArray = new Array;
    if (tmparray != null) {
        for (var i = 0; i < tmparray.length; i++) {
            var reg = /[=|^==]/;
            var set1 = tmparray[i].replace(reg, '&');
            var tmpStr2 = set1.split('&');
            var array = new Array;
            array[tmpStr2[0]] = tmpStr2[1];
            paramsArray.push(array);
        }
    }
    return paramsArray;
}

function getParamValue(name) {
    var paramsArray = getUrlParams();
    if (paramsArray != null) {
        for (var i = 0; i < paramsArray.length; i++) {
            for (var j in paramsArray[i]) {
                if (j == name) {
                    return paramsArray[i][j];
                }
            }
        }
    }
    return null;
}

function serializeObject(form) {
    var o = {};
    $.each($(form).serializeArray(), function (index) {
        if (o[this['name']]) {
            o[this['name']] = o[this['name']] + ";" + this['value'];
        } else {
            o[this['name']] = this['value'];
        }
    });
    return o;
}

function submitData() {
    cacheData('projectPath', $('[name=projectPath]').val());
    cacheData('siteBaseUrl', $('[name=siteBaseUrl]').val());
    cacheData('wxEditorDir', $('[name=wxEditorDir]').val());
    var params = serializeObject('form');
    params.token = token;
    socket = getSocket();
    socket.emit('submit data', params);
}

function listen() {
    if (!socket) {
        socket = getSocket();
        socket.on('progress', function (data) {
            if (data.status == 1) {
                console.log('receive data: ', data);
                showProgressText('<font color=red>' + data.msg + '</font>');
                return;
            }
            showProgressText(data.msg);
        });
    }
}

function getSocket() {
    if (!socket) {
        socket = io.connect('ws://localhost:8025/', { path: '/auto-deploy', transports: ['websocket'] });
        socket.on('connect', function () {
            console.log('connected');
        });
        socket.on('disconnect', function () {
            showProgressText('<font color=red>Socket: disconnected</font>');
        });
        socket.on('connect_error', function () {
            socket.close();
            showProgressText('<font color=red>Socket: connect_error</font>');
        });
        socket.on('connect_timeout', function (data) {
            showProgressText('<font color=red>Socket: connect_timeout</font>');
        });
        socket.on('error', function (data) {
            showProgressText('<font color=red>Socket: error</font>');
        });
        socket.on('refreshToken', function (data) {
            token = data.token || '';
        });
    }
    socket.open();
    return socket;
}

function initData() {
    $('[name=packageUrl]').val(decodeURIComponent(getParamValue('packageUrl')));
    $('[name=appId]').val(decodeURIComponent(getParamValue('appId')));
    $('[name=projectName]').val(decodeURIComponent(getParamValue('projectName')));
    getCacheData('projectPath', (val) => {
        $('[name=projectPath]').val(val);
    });
    getCacheData('siteBaseUrl', (val) => {
        $('[name=siteBaseUrl]').val(val);
    });
    getCacheData('wxEditorDir', (val) => {
        $('[name=wxEditorDir]').val(val);
    });
}

function initCtrls() {
    $('#btnSubmit').on('click', function () {
        listen();
        submitData();
    });
}

function cacheData(key, val) {
    var data = {};
    data[key] = val;
    chrome.storage.local.set(data, function (items) {
        // console.log(key, val);
    });
}

function getCacheData(key, callback) {
    var data = {};
    data[key] = '';
    chrome.storage.local.get(data, function (items) {
        items = items || {};
        callback && callback(items[key]);
    });
}

function showProgressText(html) {
    $('#progressModal .modal-body').html(html);
    closeModal();
    setTimeout(function () {
        $('#progressModal').modal();
    }, 400);
}

function closeModal(selector) {
    if (selector) {
        $(selector).modal('hide');
    } else {
        $('.modal').modal('hide');
    }
}

initData();
initCtrls();
