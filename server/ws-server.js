var AutoDeploy = require("./lib/auto-deploy");
var logger = require("./lib/logger")('ws-server');
var socketIo = require('socket.io');

let port = 8025;
let path = '/auto-deploy';

let checkPortEngage = () => {

}

let startServer = () => {
  // 监听
  let io = socketIo(port, { path: path });
  io.on('connection', (socket) => {
    // 日志记录
    logger.info('connect: ' + socket.request.url);

    // 监听提交信息
    socket.on('submit data', (data) => {
      // 判断接收信息是否为json格式
      try {
        let dataStr = JSON.stringify(data);
        // 日志记录
        logger.info('submit data url: ' + socket.request.url + ', data: ' + dataStr);
      } catch (ex) {
        socket.emit('progress', { msg: 'The submitting data is not in the json format', status: 1 });
        return;
      }

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
          socket.emit('progress', { msg: 'finish', status: 2 })
        })
        .catch((err) => socket.emit('progress', { msg: err + '', status: 1 }));

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
