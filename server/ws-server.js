var AutoDeploy = require("./lib/auto-deploy");
var logger = require("./lib/logger")('ws-server');
var socketIo = require('socket.io');
var tokenUtil = require("./lib/token-utility");

let port = 8025;
let path = '/auto-deploy';

/**
 * 是否正在执行流程
 */
let processRunning = false;

/**
 * 获取socket的token的key值
 * @param {object} socket 
 */
let getTokenKey = (socket) => {
  return 'socket_' + socket.id;
}

/**
 * 检查提交的数据
 * @param {object} socket 链接
 * @param {object} data 提交过来的数据
 * @returns {boolean}
 */
let checkSubmitData = (socket, data) => {
  try {
    // 验证token
    if (!tokenUtil.checkToken(getTokenKey(socket), data.token)) {
      throw new Error('Do not submit data repleatly.');
    }

    // 流程执行中
    if (processRunning) {
      throw new Error('The process is running, wait a moment then retry it.');
    }

    // 判断接收信息是否为json格式
    try {
      let dataStr = JSON.stringify(data);
      logger.info('submit data url: ' + socket.request.url + ', data: ' + dataStr);
    } catch (ex) {
      throw new Error('The submitting data is not in the json format.');
    }

    return true;
  } catch (ex) {
    logger.error(ex.message);
    socket.emit('progress', { msg: ex.message, status: 1 });
    return false;
  }
};

/**
 * 启动服务
 */
let startServer = () => {
  // 监听
  let io = socketIo(port, { path: path });
  io.on('connection', (socket) => {
    // 日志记录
    logger.info('connect: ' + socket.request.url);

    // 监听请求token事件
    socket.on('get token', (data) => {
      // 生成token
      let token = tokenUtil.getTokenIfNullCreated('socket_' + socket.id);
      // 做日志
      logger.info('create new token: ' + token.getVal());
      // 发送新的token值给客户端
      socket.emit('get token', { token: token.getVal(), status: 0 });
    });

    // 监听提交信息
    socket.on('submit data', (data) => {
      // 检查提交的数据
      if (!checkSubmitData(socket, data)) {
        return;
      }

      // 设置流程执行中，阻止其他请求执行流程
      processRunning = true;

      // 刷新token值，防止同一个socket重复提交
      tokenUtil.refreshTokenVal(getTokenKey(socket));

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
          // 已经完成，响应成功信息
          socket.emit('progress', { msg: 'finish', status: 2 });
          // 设置流程未在执行中，允许其他请求执行流程
          processRunning = false;
          // 清除token，防止重复提交
          tokenUtil.removeToken(getTokenKey(socket));
        })
        .catch((err) => {
          // 流程执行失败，响应错误
          socket.emit('progress', { msg: err + '', status: 1 });
          // 设置流程未在执行中，允许其他请求执行流程
          processRunning = false;
          // 清除token，防止重复提交
          tokenUtil.removeToken(getTokenKey(socket));
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
