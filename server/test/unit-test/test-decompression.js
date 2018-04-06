var fs = require('fs');
var assert = require('assert');
var should = require('should');
var Decompression = require('../../lib/decompression');
var Utility = require('../../lib/utility');

describe('test-decompression', () => {
  describe('#doDecompress()', () => {
    let filePath = 'test/resources/for-test-decompression.zip';
    let outputDir = 'c:\\qqqqqqq';

    beforeEach(() => {
      Utility.rmdirSync(outputDir);
      // this.timeout(1000);
    });

    afterEach(() => {
      Utility.rmdirSync(outputDir);
    });

    it('1', async () => {
      await Decompression.decompress(filePath, outputDir);
      (fs.existsSync(outputDir) && fs.statSync(outputDir).isDirectory()).should.equal(true);
    });

    it('2', async () => {
      filePath = 'test\\resources\\for-test-decompression.zip';
      await Decompression.decompress(filePath, outputDir);
      (fs.existsSync(outputDir) && fs.statSync(outputDir).isDirectory()).should.equal(true);
    });

    it('3', () => {
      filePath = 'test\\resources\\no-exist-file.zip';
      return Decompression.decompress(filePath, outputDir).should.be.rejected();
    });

  });
});

