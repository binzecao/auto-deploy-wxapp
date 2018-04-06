var fs = require('fs');
var assert = require('assert');
var should = require('should');
var Utility = require('../../lib/utility');
var PathError = require('../../lib/error/path-error');
describe('test-utility', () => {
  describe('#mkdirsSync()', () => {
    let root = 'c:\\zzzzzz';
    beforeEach(function () {
      Utility.rmdirSync(root);
    });

    afterEach(function () {
    });

    it('1', () => {
      let dirName = root + '\\' + 'a1';
      Utility.mkdirsSync(dirName);
    });

    it('2', () => {
      let dirName = root + '\\a2\\a2\\a2';
      Utility.mkdirsSync(dirName);
    });

    it('3', () => {
      let dirName = root + '/a3/a3/a3';
      Utility.mkdirsSync(dirName);
    });

  });

  //TODO
  describe('#findAllFilesSync()', () => {
    let root = 'c:\\zzzzzz';
    beforeEach(function () {
      Utility.rmdirSync(root);
    });

    afterEach(function () {
    });

    /*
    it('1', () => {
      let dirName = root + '\\' + 'a1';
      Utility.findAllFilesSync(dirName);
    });
    */
  });


  describe('#formatFilePathWithWin32Style()', () => {
    it('1', () => {
      let path = 'C:\\cc\\aa.txt';
      let result = 'C:\\cc\\aa.txt';
      Utility.formatFilePathWithWin32Style(path).should.equal(result);
    });

    it('2', () => {
      let path = 'C:/cc/aa.txt';
      let result = 'C:\\cc\\aa.txt';
      Utility.formatFilePathWithWin32Style(path).should.equal(result);
    });

    it('3', () => {
      let path = 'C:/cc/aa.txt/';
      let result = 'C:\\cc\\aa.txt\\';
      Utility.formatFilePathWithWin32Style(path).should.equal(result);
    });

    it('4', () => {
      let path = 'C://cc//////ee\\\\ddd\\//aa.txt';
      let result = 'C:\\cc\\ee\\ddd\\aa.txt';
      Utility.formatFilePathWithWin32Style(path).should.equal(result);
    });

    it('5', () => {
      let path = '//cc\\\\\\aa.txt';
      (() => { Utility.formatFilePathWithWin32Style(path) })
        .should.throwError(PathError);

      let path2 = 'C://cc//////ee\\\\ddd\\//aa.txt';
      (() => { Utility.formatFilePathWithWin32Style(path2) })
        .should.not.throwError();
    });
  });

  describe('#adjustUrlSlash()', () => {
    it('1', () => {
      let url = 'http://ffff.com/aaa.txt';
      let result = 'http://ffff.com/aaa.txt';
      Utility.adjustUrlSlash(url).should.equal(result);
    });
    it('2', () => {
      let url = 'http://ffff.com\\aaa.txt';
      let result = 'http://ffff.com/aaa.txt';
      Utility.adjustUrlSlash(url).should.equal(result);
    });
    it('3', () => {
      let url = 'http:\\\\ffff.com\\aaa.txt';
      let result = 'http://ffff.com/aaa.txt';
      Utility.adjustUrlSlash(url).should.equal(result);
    });
    it('4', () => {
      let url = 'https:\\\\ffff.com\\aaa.txt';
      let result = 'https://ffff.com/aaa.txt';
      Utility.adjustUrlSlash(url).should.equal(result);
    });
    it('5', () => {
      let url = '/ffff.com\\aaa.txt';
      (() => { Utility.adjustUrlSlash(url) }).should.throwError(PathError);
    });
    it('6', () => {
      let url = 'ftp://ffff.com/cc';
      (() => { Utility.adjustUrlSlash(url) }).should.throwError(PathError);
    });
    it('7', () => {
      let url = 'http://ffff.com/';
      let result = 'http://ffff.com/';
      Utility.adjustUrlSlash(url).should.equal(result);
    });
    it('8', () => {
      let url = 'https://ffff.com';
      let result = 'https://ffff.com';
      Utility.adjustUrlSlash(url).should.equal(result);
    });
  });
});
