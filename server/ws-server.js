var AutoDeploy = require("./lib/auto-deploy");
var logger = require("./lib/logger")('ws-server');
var socketIo = require('socket.io');

let port = 8025;
let path = '/auto-deploy';

/**
 * 创建token
 */
let genrateToken = () => {
  return (new Date()).getTime() + '' + parseInt(Math.random() * 100000);
}

/**
 * 服务端唯一的token，用作保证只有一个请求能够处理自动部署的流程
 */
let uniqueToken = null;

/**
 * 检查提交的数据
 * @param {object} socket 链接
 * @param {object} data 提交过来的数据
 */
let checkSubmitData = (socket, data) => {
  // 验证token
  if (!data.token || !uniqueToken) {
    let errMsg = 'Token is empty, please get the token first';
    logger.error(errMsg);
    socket.emit('progress', { msg: errMsg, status: 1 });
    return;
  }

  if (data.token != uniqueToken) {
    let errMsg = 'Do not submit repeatly';
    logger.error(errMsg);
    socket.emit('progress', { msg: errMsg, status: 1 });
    return;
  }

  // 判断接收信息是否为json格式
  try {
    let dataStr = JSON.stringify(data);
    // 日志记录
    logger.info('submit data url: ' + socket.request.url + ', data: ' + dataStr);
  } catch (ex) {
    socket.emit('progress', { msg: 'The submitting data is not in the json format', status: 1 });
    return;
  }
};

/**
 * 刷新token，并且推送到每个链接
 */
let refreshToken = (io) => {
  uniqueToken = genrateToken();
  emitToken(io);
}

/**
 * 将token推送到每个链接
 */
let emitToken = (io) => {
  io.emit('refreshToken', { token: uniqueToken, status: 0 });
}

/**
 * 启动服务
 */
let startServer = () => {
  // 监听
  let io = socketIo(port, { path: path });
  io.on('connection', (socket) => {
    // 日志记录
    logger.info('connect: ' + socket.request.url);

    // 推送最新的token
    emitToken(io);

    // 监听提交信息
    socket.on('submit data', (data) => {
      // 检查提交的数据
      checkSubmitData(socket, data);

      // 返回信息给客户端
      socket.emit('progress', { msg: 'Starting the process and wait a moment...', status: 0 });

      // 进行自动部署
      let instance = AutoDeploy.createInstance();
      instance
        .setPackageUrl(data.packageUrl)
        .setProjectPath(data.projectPath)
        .setWxEditorDir(data.wxEditorDir)
        .setConfigSiteBaseUrl(data.siteBaseUrl)
        .setProjectName(data.projectName)
        .prepare()
        .then(() => {
          instance.open();
          socket.emit('progress', { msg: 'finish', status: 2 });
          refreshToken(io);
        })
        .catch((err) => {
          socket.emit('progress', { msg: err + '', status: 1 });
          refreshToken(io);
        });
    });
  });

  // 日志记录
  logger.info('start to listen :' + port + path);
}

// 监听uncaughtException，主要监听端口占用，其他错误记录，然后重新抛出。
process.on('uncaughtException', (err) => {
  if (err.code === 'EADDRINUSE' || err.errno === 'EADDRINUSE') {
    logger.critical('The port 8025 is be used by another programs, so it start falied.');
    return;
  }
  logger.critical(err + '');
  throw err;
});

module.exports.start = startServer;
