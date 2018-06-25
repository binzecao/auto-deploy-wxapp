var fs = require('fs');
var path = require('path');
var assert = require('assert');
var should = require('should');
var Utility = require('../../lib/utility');
var AutoDeploy = require('../../lib/auto-deploy');

let testOpen = 0; // 0:no 1:openByBat 2:openByCmd

describe('test-auto-deploy', () => {
  let packageUrl = '';
  let projectPath = '';
  let projectName = '';
  let appId = '';
  let configSiteBaseUrl = '';
  let wxEditorDir = '';

  beforeEach(() => {
    // packageUrl = 'http://bin1.test.72dns.net/comdata/1715/wxapp_43.zip?rand=0.3551965759371303';
    packageUrl = 'https://ceshi.yz168.cc/comdata/6688/wxapp_2.zip?rand=0.02753800315908017';
    projectPath = 'c:\\aaaaaaa';
    projectName = 'hello wxapp';
    appId = 'wx895687cc383444';
    configSiteBaseUrl = 'http://bin1.test.72dns.net';
    wxEditorDir = 'E:\\Program Files (x86)\\Tencent\\微信web开发者工具\\';

    // Utility.rmdirSync(projectPath);
  });

  after(() => {
    if (testOpen == 0) {
      Utility.rmdirSync(projectPath);
    }
  });

  describe('#checkOptions()', () => {
    let testIndex = 1;
    it(`${testIndex++} 测试正常值`, () => {
      var instance = AutoDeploy.createInstance();
      (() => {
        instance
          .setPackageUrl(packageUrl)
          .setProjectPath(projectPath)
          .setWxEditorDir(wxEditorDir)
          .setConfigSiteBaseUrl(configSiteBaseUrl)
          .setAppId(appId)
          .setProjectName(projectName)
          .checkOptions();
      }).should.not.throwError();
    });

    it(`${testIndex++} packageUrl为空`, () => {
      packageUrl = '';
      var instance = AutoDeploy.createInstance();
      (() => {
        instance
          .setPackageUrl(packageUrl)
          .setProjectPath(projectPath)
          .setWxEditorDir(wxEditorDir)
          .setConfigSiteBaseUrl(configSiteBaseUrl)
          .setAppId(appId)
          .setProjectName(projectName)
          .checkOptions()
      }).should.throwError();
    });

    it(`${testIndex++} packageUrl不合法`, () => {
      packageUrl = 'c:/e54545';
      var instance = AutoDeploy.createInstance();
      (() => {
        instance
          .setPackageUrl(packageUrl)
          .setProjectPath(projectPath)
          .setWxEditorDir(wxEditorDir)
          .setConfigSiteBaseUrl(configSiteBaseUrl)
          .setAppId(appId)
          .setProjectName(projectName)
          .checkOptions()
      }).should.throwError();
    });

    it(`${testIndex++} packageUrl不合法，不是以zip结尾`, () => {
      packageUrl = 'http://baidu.com';
      var instance = AutoDeploy.createInstance();
      (() => {
        instance
          .setPackageUrl(packageUrl)
          .setProjectPath(projectPath)
          .setWxEditorDir(wxEditorDir)
          .setConfigSiteBaseUrl(configSiteBaseUrl)
          .setAppId(appId)
          .setProjectName(projectName)
          .checkOptions()
      }).should.throwError();
    });

    it(`${testIndex++} projectPath为空`, () => {
      projectPath = '';
      var instance = AutoDeploy.createInstance();
      (() => {
        instance
          .setPackageUrl(packageUrl)
          .setProjectPath(projectPath)
          .setWxEditorDir(wxEditorDir)
          .setConfigSiteBaseUrl(configSiteBaseUrl)
          .setAppId(appId)
          .setProjectName(projectName)
          .checkOptions()
      }).should.throwError();
    });

    it(`${testIndex++} projectPath不合法`, () => {
      projectPath = '323:df/4/55554';
      var instance = AutoDeploy.createInstance();
      (() => {
        instance
          .setPackageUrl(packageUrl)
          .setProjectPath(projectPath)
          .setWxEditorDir(wxEditorDir)
          .setConfigSiteBaseUrl(configSiteBaseUrl)
          .setAppId(appId)
          .setProjectName(projectName)
          .checkOptions()
      }).should.throwError();
    });

    it(`${testIndex++} wxEditorDir为空`, () => {
      wxEditorDir = '';
      var instance = AutoDeploy.createInstance();
      (() => {
        instance
          .setPackageUrl(packageUrl)
          .setProjectPath(projectPath)
          .setWxEditorDir(wxEditorDir)
          .setConfigSiteBaseUrl(configSiteBaseUrl)
          .setAppId(appId)
          .setProjectName(projectName)
          .checkOptions()
      }).should.throwError();
    });

    it(`${testIndex++} wxEditorDir目录存在，但不是编辑器所在目录`, () => {
      wxEditorDir = 'c:\\';
      var instance = AutoDeploy.createInstance();
      (() => {
        instance
          .setPackageUrl(packageUrl)
          .setProjectPath(projectPath)
          .setWxEditorDir(wxEditorDir)
          .setConfigSiteBaseUrl(configSiteBaseUrl)
          .setAppId(appId)
          .setProjectName(projectName)
          .checkOptions();
      }).should.throwError();
    });

    it(`${testIndex++} wxEditorDir目录不存在`, () => {
      wxEditorDir = 'c:\\aa\\eeee\\ccc';
      var instance = AutoDeploy.createInstance();
      (() => {
        instance
          .setPackageUrl(packageUrl)
          .setProjectPath(projectPath)
          .setWxEditorDir(wxEditorDir)
          .setConfigSiteBaseUrl(configSiteBaseUrl)
          .setAppId(appId)
          .setProjectName(projectName)
          .checkOptions();
      }).should.throwError();
    });

    it(`${testIndex++} configSiteBaseUrl为空，不应该报错`, () => {
      configSiteBaseUrl = '';
      var instance = AutoDeploy.createInstance();
      (() => {
        instance
          .setPackageUrl(packageUrl)
          .setProjectPath(projectPath)
          .setWxEditorDir(wxEditorDir)
          .setConfigSiteBaseUrl(configSiteBaseUrl)
          .setAppId(appId)
          .setProjectName(projectName)
          .checkOptions();
      }).should.not.throwError();
    });

    it(`${testIndex++} configSiteBaseUrl不为空，但格式不对`, () => {
      configSiteBaseUrl = 'dfs/dfdf:rtt';
      var instance = AutoDeploy.createInstance();
      (() => {
        instance
          .setPackageUrl(packageUrl)
          .setProjectPath(projectPath)
          .setWxEditorDir(wxEditorDir)
          .setConfigSiteBaseUrl(configSiteBaseUrl)
          .setAppId(appId)
          .setProjectName(projectName)
          .checkOptions();
      }).should.throwError();
    });

    it(`${testIndex++} appId为空，不应该报错`, () => {
      appId = '';
      var instance = AutoDeploy.createInstance();
      (() => {
        instance
          .setPackageUrl(packageUrl)
          .setProjectPath(projectPath)
          .setWxEditorDir(wxEditorDir)
          .setConfigSiteBaseUrl(configSiteBaseUrl)
          .setAppId(appId)
          .setProjectName(projectName)
          .checkOptions();
      }).should.not.throwError();
    });

    it(`${testIndex++} projectName为空，不应该报错`, () => {
      projectName = '';
      var instance = AutoDeploy.createInstance();
      (() => {
        instance
          .setPackageUrl(packageUrl)
          .setProjectPath(projectPath)
          .setWxEditorDir(wxEditorDir)
          .setConfigSiteBaseUrl(configSiteBaseUrl)
          .setAppId(appId)
          .setProjectName(projectName)
          .checkOptions();
      }).should.not.throwError();
    });

    it(`${testIndex++} projectName超过20个字符，应该报错`, () => {
      projectName = '一二三四五六七八九十一二三四五六七八九十一';
      var instance = AutoDeploy.createInstance();
      (() => {
        instance
          .setPackageUrl(packageUrl)
          .setProjectPath(projectPath)
          .setWxEditorDir(wxEditorDir)
          .setConfigSiteBaseUrl(configSiteBaseUrl)
          .setAppId(appId)
          .setProjectName(projectName)
          .checkOptions();
      }).should.throwError();
    });

  });

  describe('#createProjectDir()', () => {
    it('1', () => {
      var instance = AutoDeploy.createInstance();
      (() => {
        instance
          .setPackageUrl(packageUrl)
          .setProjectPath(projectPath)
          .setWxEditorDir(wxEditorDir)
          .setConfigSiteBaseUrl(configSiteBaseUrl)
          .setAppId(appId)
          .setProjectName(projectName)
          .createProjectDir();
      }).should.not.throwError();

      fs.existsSync(instance.getProjectDir()).should.equal(true);
    });
  });

  describe('#downloadPackage()', () => {
    it('1 测试正常下载', async () => {
      var instance = AutoDeploy.createInstance();
      await instance
        .setPackageUrl(packageUrl)
        .setProjectPath(projectPath)
        .setWxEditorDir(wxEditorDir)
        .setConfigSiteBaseUrl(configSiteBaseUrl)
        .setAppId(appId)
        .setProjectName(projectName)
        .createProjectDir()
        .downloadPackage()
        .should.be.not.throwError()
        .and.be.fulfilled()

      fs.existsSync(projectPath).should.equal(true);

      let downloadSuccess = false;
      let fileNames = Utility.findAllFilesSync(projectPath);
      for (let i = 0; i < fileNames.length; i++) {
        if (/\.zip$/i.test(fileNames[i])) {
          downloadSuccess = true;
          break;
        }
      }
      downloadSuccess.should.equal(true);
    });

    it('2 给一个不可访问的路径，应该报错', async () => {
      packageUrl = 'https://deeee5rdsfsdff545.com/ddddddd.zip';
      var instance = AutoDeploy.createInstance();
      await instance
        .setPackageUrl(packageUrl)
        .setProjectPath(projectPath)
        .setWxEditorDir(wxEditorDir)
        .setConfigSiteBaseUrl(configSiteBaseUrl)
        .setAppId(appId)
        .setProjectName(projectName)
        .createProjectDir()
        .downloadPackage()
        .should.be.not.throwError()
        .and.be.rejected()

      fs.existsSync(projectPath).should.equal(true);
    });
  });

  describe('#decompress()', () => {
    it('1 正常测试', async () => {
      var instance = AutoDeploy.createInstance();
      await instance
        .setPackageUrl(packageUrl)
        .setProjectPath(projectPath)
        .setWxEditorDir(wxEditorDir)
        .setConfigSiteBaseUrl(configSiteBaseUrl)
        .setAppId(appId)
        .setProjectName(projectName)
        .createProjectDir()
        .downloadPackage()
        .should.not.throwError()
        .and.be.fulfilled();
      ;
      await instance.decompress()
        .should.not.throwError()
        .and.be.fulfilled();

      fs.existsSync(instance.getDecompressOutputPath());

      let fileNames = Utility.findAllFilesSync(projectPath);
      let fileCount = fileNames.length;
      fileCount.should.greaterThan(0);
    });

  });

  describe('#modifyConfigJsFile()', () => {
    it('1 正常测试', async () => {
      var instance = AutoDeploy.createInstance();
      instance
        .setPackageUrl(packageUrl)
        .setProjectPath(projectPath)
        .setWxEditorDir(wxEditorDir)
        .setConfigSiteBaseUrl(configSiteBaseUrl)
        .setAppId(appId)
        .setProjectName(projectName)
        .createProjectDir();

      await instance.downloadPackage()
        .should.not.throwError()
        .and.be.fulfilled();
      await instance.decompress()
        .should.not.throwError()
        .and.be.fulfilled();

      (() => instance.modifyConfigJsFile()).should.not.throwError();

      // 读取内容
      let configJsFilePath = Utility.formatFilePathWithWin32Style(instance.getDecompressOutputPath() + '/config.js');
      let fd = fs.openSync(configJsFilePath, 'r');
      let content = fs.readFileSync(fd, 'utf-8');

      // AppId应该是不改变的
      let mrAppId = content.match(/APPID[^:]*:\s*["']([^"']+)["']/);
      (mrAppId || {}).should.be.Array().and.not.empty();
      mrAppId[1].should.not.equal(appId);

      // 测试SITEBASEURL是否真改了
      let mrSITEBASEURL = content.match(/SITEBASEURL[^:]*:\s*["']([^"']+)["']/);
      (mrSITEBASEURL || {}).should.be.Array().and.not.empty();
      mrSITEBASEURL[1].should.equal(configSiteBaseUrl);

      fs.closeSync(fd);
    });

    it('2 configSiteBaseUrl为空，SITEBASEURL必须是原值', async () => {
      configSiteBaseUrl = '';
      var instance = AutoDeploy.createInstance();
      instance
        .setPackageUrl(packageUrl)
        .setProjectPath(projectPath)
        .setWxEditorDir(wxEditorDir)
        .setConfigSiteBaseUrl(configSiteBaseUrl)
        .setAppId(appId)
        .setProjectName(projectName)
        .createProjectDir();

      await instance.downloadPackage()
        .should.not.throwError()
        .and.be.fulfilled();
      await instance.decompress()
        .should.not.throwError()
        .and.be.fulfilled();

      (() => instance.modifyConfigJsFile()).should.not.throwError();

      // 读取内容
      let configJsFilePath = Utility.formatFilePathWithWin32Style(instance.getDecompressOutputPath() + '/config.js');
      let fd = fs.openSync(configJsFilePath, 'r');
      let content = fs.readFileSync(fd, 'utf-8');

      // AppId应该是不改变的
      let mrAppId = content.match(/APPID[^:]*:\s*["']([^"']+)["']/);
      (mrAppId || {}).should.be.Array().and.not.empty();
      mrAppId[1].should.not.equal(appId);

      // 测试SITEBASEURL是否是原值
      let mrSITEBASEURL = content.match(/SITEBASEURL[^:]*:\s*["']([^"']+)["']/);
      (mrSITEBASEURL || {}).should.be.Array().and.not.empty();
      mrSITEBASEURL[1].should.not.equal(configSiteBaseUrl);

      fs.closeSync(fd);
    });

  });

  describe('#createProjectConfigJsonFile()', () => {
    it('1 正常测试', async () => {
      var instance = AutoDeploy.createInstance();
      instance
        .setPackageUrl(packageUrl)
        .setProjectPath(projectPath)
        .setWxEditorDir(wxEditorDir)
        .setConfigSiteBaseUrl(configSiteBaseUrl)
        .setAppId(appId)
        .setProjectName(projectName)
        .createProjectDir()
        .createProjectConfigJsonFile();

      let projectConfigJsonFilePath = Utility.formatFilePathWithWin32Style(instance.getDecompressOutputPath() + '/project.config.json');
      fs.existsSync(projectConfigJsonFilePath).should.equal(true);

      let fd = fs.openSync(projectConfigJsonFilePath, 'r');
      let content = fs.readFileSync(fd, 'utf-8');
      let configJson = JSON.parse(content);

      configJson.should.have.property('appid', appId);
      configJson.should.have.property('projectname', projectName);
      configJson.should.have.property('libVersion', '');

      fs.closeSync(fd);
    });

  });

  describe('#createBatFile()', () => {
    it('1 正常测试', async () => {
      var instance = AutoDeploy.createInstance();
      (() => {
        instance
          .setPackageUrl(packageUrl)
          .setProjectPath(projectPath)
          .setWxEditorDir(wxEditorDir)
          .setConfigSiteBaseUrl(configSiteBaseUrl)
          .setAppId(appId)
          .setProjectName(projectName)
          .createProjectDir()
          .createProjectConfigJsonFile()
          .createBatFile()
      }).should.not.throwError();

      let batFilePath = Utility.formatFilePathWithWin32Style(path.dirname(instance.getDecompressOutputPath()) + '/run.bat');
      fs.existsSync(batFilePath).should.equal(true);

      let fd = fs.openSync(batFilePath, 'r');
      let content = fs.readFileSync(fd);
      let regExp = new RegExp('cli.bat', 'i');
      regExp.test(content).should.be.equal(true);
      fs.closeSync(fd);
    });
  });

  describe('#prepare()', async () => {
    it('1 正常测试', async () => {
      var instance = AutoDeploy.createInstance();
      await instance
        .setPackageUrl(packageUrl)
        .setProjectPath(projectPath)
        .setWxEditorDir(wxEditorDir)
        .setConfigSiteBaseUrl(configSiteBaseUrl)
        .setAppId(appId)
        .setProjectName(projectName)
        .prepare()
        .should.not.throwError()
        .and.be.fulfilled();
    });
  });


  if (testOpen == 1) {
    describe('#openByBat()', () => {
      it('1 正常测试', async () => {
        var instance = AutoDeploy.createInstance();
        await instance
          .setPackageUrl(packageUrl)
          .setProjectPath(projectPath)
          .setWxEditorDir(wxEditorDir)
          .setConfigSiteBaseUrl(configSiteBaseUrl)
          .setAppId(appId)
          .setProjectName(projectName)
          .prepare()
          .should.not.throwError()
          .and.be.fulfilled();

        await instance.openByBat();
      });

    });
  }

  if (testOpen == 2) {
    describe('#openByCmd()', () => {
      it('1 正常测试', async () => {
        var instance = AutoDeploy.createInstance();
        await instance
          .setPackageUrl(packageUrl)
          .setProjectPath(projectPath)
          .setWxEditorDir(wxEditorDir)
          .setConfigSiteBaseUrl(configSiteBaseUrl)
          .setAppId(appId)
          .setProjectName(projectName)
          .prepare()
          .should.not.throwError()
          .and.be.fulfilled();

        await instance.openByCmd();
      });
    });
  }

});