var fs = require('fs');
var assert = require('assert');
var should = require('should');
var WxAppProjectConfig = require('../../lib/wxapp-project-config');

describe('test-wxapp-project-config', () => {
  let appId = 'wx123456cc3346556a';
  let projectName = 'xxfffe发';
  let libVersion = '1.3.45';
  let urlCheck = false;

  beforeEach(() => {
    appId = 'wx123456cc3346556a';
    projectName = 'xxfffe发';
    libVersion = '1.3.45';
    urlCheck = false;
  });

  describe('#getConfig()', () => {
    it('1', () => {
      var projectConfig = WxAppProjectConfig
        .createInstance()
        .setAppId(appId)
        .setProjectName(projectName)
        .setLibVersion(libVersion)
        .setUrlCheck(urlCheck)
        .getConfig();

      projectConfig.should.not.throwError();
      projectConfig.should.be.an.Object().and.not.empty();
      projectConfig.should.have.property('libVersion', libVersion).and.not.empty().and.which.is.a.String();
      projectConfig.should.have.property('appid', appId).and.not.empty().and.which.is.a.String();
      projectConfig.should.have.property('projectname', projectName).and.not.empty().and.which.is.a.String();
      projectConfig.setting.should.be.an.Object().and.not.empty().and.have.property('urlCheck', urlCheck);
    });

    it('2', () => {
      appId = 'xxx';
      (() => {
        WxAppProjectConfig
          .createInstance()
          .setAppId(appId)
          .setProjectName(projectName)
          .setLibVersion(libVersion)
          .setUrlCheck(urlCheck)
          .getConfig();
      }).should.throwError();
    });

    it('3', () => {
      appId = '1233435445566';
      (() => {
        WxAppProjectConfig
          .createInstance()
          .setAppId(appId)
          .setProjectName(projectName)
          .setLibVersion(libVersion)
          .setUrlCheck(urlCheck)
          .getConfig();
      }).should.throwError();
    });

    it('4', () => {
      projectName = '';
      (() => {
        WxAppProjectConfig
          .createInstance()
          .setAppId(appId)
          .setProjectName(projectName)
          .setLibVersion(libVersion)
          .setUrlCheck(urlCheck)
          .getConfig();
      }).should.throwError();
    });

    it('5', () => {
      libVersion = '235';
      (() => {
        WxAppProjectConfig
          .createInstance()
          .setAppId(appId)
          .setProjectName(projectName)
          .setLibVersion(libVersion)
          .setUrlCheck(urlCheck)
          .getConfig();
      }).should.throwError();
    });

    it('6', () => {
      urlCheck = '33';
      (() => {
        WxAppProjectConfig
          .createInstance()
          .setAppId(appId)
          .setProjectName(projectName)
          .setLibVersion(libVersion)
          .setUrlCheck(urlCheck)
          .getConfig();
      }).should.not.throwError();
    });
  });

  describe('#getConfigString()', () => {
    it('1', () => {
      var configString = WxAppProjectConfig
        .createInstance()
        .setAppId(appId)
        .setProjectName(projectName)
        .setLibVersion(libVersion)
        .setUrlCheck(urlCheck)
        .getConfigString();

      configString.should.be.a.String()
        .and.not.empty()
        .and.match(/appid/);
    });
  });


});

