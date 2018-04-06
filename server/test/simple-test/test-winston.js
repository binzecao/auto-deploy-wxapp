var winston = require('winston');
var process = require('process');

// winston.add(winston.transports.File, { filename: 'somefile.log' });
// winston.remove(winston.transports.Console);

/*
winston.log('info', 'aaaaaaaaaa!');
winston.info('info dfdfdf');

winston.level = 'debug';
winston.log('debug', 'rerer!');
*/


// console.log(process.execPath)
// console.log(__dirname)
// console.log(process.cwd())


var logger = new (winston.Logger)({
  level: 'error',
  transports: [
    // new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: __dirname + '\\aa.log' })
  ]
});

logger.info('aaaaaaaaa');
logger.error('bbbbbbbbb');



