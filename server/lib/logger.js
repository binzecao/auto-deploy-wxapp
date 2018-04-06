var path = require('path');
var process = require('process')
var winston = require('winston');
require('winston-daily-rotate-file');

class Logger {
  constructor(options = {}) {
    options = options || {};
    this.logLevel = options.logLevel || 'info';
    this.logPath = options.logPath || path.resolve(process.cwd(), 'logs');
    this.logName = options.logName || '';
    this.outputType = options.outputType || [0, 1];
    this.logger = {};
  }

  setLogName(logName) {
    this.logName = logName;
  }

  emergency(msg) {
    return this.log('emergency', msg);
  }

  alert(msg) {
    return this.log('alert', msg);
  }

  critical(msg) {
    return this.log('critical', msg);
  }

  error(msg) {
    return this.log('error', msg);
  }

  warn(msg) {
    return this.log('warn', msg);
  }

  notice(msg) {
    return this.log('notice', msg);
  }

  info(msg) {
    return this.log('info', msg);
  }

  debug(msg) {
    return this.log('debug', msg);
  }

  log(level, msg) { }
}

class WinstonLogger extends Logger {
  constructor(options = {}) {
    super(options);
    this.initLogger();
  }

  initLogger() {
    let transports = [];

    // 文件
    // let transportFile = winston.transports.File({ filename: this.logPath });
    let transportFile = new (winston.transports.DailyRotateFile)({
      dirname: this.logPath,
      filename: `${this.logName}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '5m',
      // maxFiles: '14d'
    });
    transports.push(transportFile);

    // 控制台(npm test 不输出)
    let isInTest = process.env.npm_lifecycle_event && process.env.npm_lifecycle_event.toUpperCase() == 'TEST';
    if (this.outputType.indexOf(1) > -1 && !isInTest) {
      transports.push(new (winston.transports.Console)({ level: this.logLevel }));
    }

    // 创建实例
    this.logger = new (winston.Logger)({
      level: this.logLevel || 'info',
      transports: transports
    });
  }

  log(level, msg) {
    // this.logger.transports.file.filename = path.resolve(this.logPath, this.logName);

    let logResult = null;
    switch (level) {
      case 'emergency': {
        logResult = this.logger.error(msg);
        break;
      }
      case 'alert': {
        logResult = this.logger.alert(msg);
        break;
      }
      case 'critical': {
        logResult = this.logger.error(msg);
        break;
      }
      case 'error': {
        logResult = this.logger.error(msg);
        break;
      }
      case 'warn': {
        logResult = this.logger.warn(msg);
        break;
      }
      case 'notice': {
        logResult = this.logger.notice(msg);
        break;
      }
      case 'info': {
        logResult = this.logger.info(msg);
        break;
      }
      case 'debug': {
        logResult = this.logger.debug(msg);
        break;
      }
      default: {
        throw new Error('no such level log');
      }
    }
    return logResult;
  }

}

function getLogger(logName, logPath = '') {
  if (!logName) {
    throw new Error('logName can not be empty');
  }
  return new WinstonLogger({ logName, logPath });
}

module.exports = getLogger;