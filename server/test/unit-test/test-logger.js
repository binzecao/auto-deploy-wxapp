var logger = require('../../lib/logger')('for-test');

describe('test-logger', () => {
  describe('#info()', () => {
    let testIndex = 1;
    it(`${testIndex++}`, () => {
      logger.info('info111');
    });
  });

  describe('#error()', () => {
    let testIndex = 1;
    it(`${testIndex++}`, () => {
      logger.error('error1222');
    });
  });

  describe('#debug()', () => {
    let testIndex = 1;
    it(`${testIndex++}`, () => {
      logger.debug('debug333333');
    });
  });

  describe('#log()', () => {
    let testIndex = 1;
    it(`${testIndex++}`, () => {
      logger.log('warn', 'warn444444444');
    });
  });
});


