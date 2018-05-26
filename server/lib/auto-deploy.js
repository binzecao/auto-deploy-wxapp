// 步骤：
// 获取代码包地址
// 远程请求下载代码包
// 解压到指定目录
// 更改文件配置(config.js)
// 创建工程配置文件(project.config.js)
// 创建bat文件，用于打开编辑器
// 执行bat文件打开项目

var http = require("http");
var fs = require("fs");
var path = require("path");
var child_process = require('child_process');
var Schema = require('validate');
var iconv = require('iconv-lite');
var Utility = require("./utility");
var Decompression = require("./decompression");
var WxAppProjectConfig = require("./wxapp-project-config");
var logger = require("./logger")('auto-deploy');

class AutoDeploy {
  static createInstance() {
    return new AutoDeploy();
  }

  constructor() {
    this.packageUrl = ''; // 代码包下载地址
    this.projectPath = ''; // 项目路径
    this.configSiteBaseUrl = ''; // 小程序项目配置中，需要覆盖的一个参数：访问前缀（端口+域名）
    this.appId = ''; // 小程序appId
    this.projectName = ''; // 小程序项目名
    this.wxEditorDir = ''; // 编辑器所在目录
  }

  setPackageUrl(url) {
    this.packageUrl = url;
    return this;
  }

  setProjectPath(projectPath) {
    this.projectPath = projectPath;
    return this;
  }

  setConfigSiteBaseUrl(configSiteBaseUrl) {
    this.configSiteBaseUrl = configSiteBaseUrl;
    return this;
  }

  setWxEditorDir(wxEditorDir) {
    this.wxEditorDir = wxEditorDir;
    return this;
  }

  setAppId(appId) {
    this.appId = appId;
    return this;
  }

  setProjectName(projectName) {
    this.projectName = projectName;
    return this;
  }

  getPackageUrlWithoutParams() {
    return (this.packageUrl || '').replace(/\?.*$/, '');
  }

  /**
   * 获取项目目录
   * @returns {string}
   */
  getProjectDir() {
    return Utility.formatFilePathWithWin32Style(this.projectPath + '/' + this.getDownloadFileName());
  }

  /**
   * 获取下载代码包存放的目录名
   * @returns {string}
   */
  getDownloadFileName() {
    if (!this.fileName) {
      var nowDate = new Date();
      this.fileName = nowDate.getTime() + '' + (Math.floor(Math.random() * (10000 - 1) + 10000));
    }
    return this.fileName;
  }

  /**
   * 获取下载代码包所在的文件路径
   * @returns {string}
   */
  getDownloadFilePath() {
    var projectDir = this.projectPath + '/' + this.getDownloadFileName();
    var projectFilePath = projectDir + '/' + path.basename(this.getPackageUrlWithoutParams());
    return projectFilePath;
  }

  /**
   * 获取代码包解压目录路径
   * @returns {string}
   */
  getDecompressOutputPath() {
    var packageUrl = this.getPackageUrlWithoutParams();
    var projectDir = this.projectPath + '/' + this.getDownloadFileName();
    var regexp = new RegExp(path.extname(packageUrl) + '.*$', 'i');
    var outputPath = projectDir + '/' + path.basename(packageUrl).replace(regexp, '');
    return outputPath;
  }

  /**
   * 获取run.bat文件路径
   */
  getRunBatPath() {
    return Utility.formatFilePathWithWin32Style(this.getProjectDir() + '/run.bat');
  }

  /**
   * 检验参数
   */
  checkOptions() {
    logger.info('check options.');

    // 各种检测参数方法
    let checkPath = val => /^[a-zA-Z]:\\.+/.test(val);
    let checkUrl = val => /^((https*)|(ftp)):\/\/.+/.test(val);
    let checkZip = val => /\.zip\?.*$/i.test(val);
    let checkUrlIfNotEmpty = val => (!val && val !== 0) || /^((https*)|(ftp)):\/\/.+/.test(val);
    let checkWxEditorExe = (val) => {
      let dir = Utility.formatFilePathWithWin32Style(val);
      let exePath = Utility.formatFilePathWithWin32Style(dir + '/微信web开发者工具.exe');
      return fs.existsSync(dir) && fs.statSync(dir).isDirectory() && fs.existsSync(exePath);
    }

    // 参数检测规格
    let optionsValidationSchema = new Schema({
      packageUrl: {
        type: 'string',
        required: true,
        use: { checkUrl, checkZip }
      },
      projectPath: {
        type: 'string',
        required: true,
        use: { checkPath },
      },
      configSiteBaseUrl: {
        type: 'string',
        required: false,
        use: { checkUrlIfNotEmpty },
      },
      wxEditorDir: {
        type: 'string',
        required: true,
        use: { checkPath, checkWxEditorExe },
      },
      projectName: {
        type: 'string',
        length: { max: 20 }
        // required: true,
      },
      // appId: {
      //   type: 'string',
      //   required: true,
      // }
    });
    optionsValidationSchema.message({
      checkPath: (path, obj) => `${path} is unvalid, it must be win32 style path.`,
      checkUrlIfNotEmpty: (path, obj, val) => `the '${path}' value is '${val}', it is not valid, it must be url style path or empty string`,
      checkUrl: (path, obj) => `${path} is unvalid, it must be url style path`,
      checkZip: (path, obj) => `${path} is unvalid, it must be a zip`,
      checkWxEditorExe: (path, obj) => `the wx-editor directory '${obj.wxEditorDir}' is not exists, or is not the real root path of wx editor.`,
    });

    // 检测参数，报错就抛出
    let errors = optionsValidationSchema.validate(this);
    if (errors && errors.length > 0) {
      logger.error(`check options error: ` + errors[0]);
      throw new Error(errors[0] + '');
    }

    // 写日志
    logger.info(`check options successfully.`);

    return this;
  }

  /**
   * 创建工程目录
   */
  createProjectDir() {
    logger.info('create project directory.');

    // 计算目录路径
    let projectDir = this.getProjectDir();

    // 生成目录文件夹
    try {
      Utility.mkdirsSync(projectDir);
    } catch (ex) {
      logger.info('create project directory falid, error: ' + ex);
      throw new Error(`Can not create project dir! \nerror:` + ex);
    }
    return this;
  }

  /**
   * 下载包代码包
   */
  downloadPackage() {
    return new Promise((resolve, reject) => {
      logger.info('downloading package.');

      let projectDir = this.getProjectDir();
      // 保存下载文件的本地文件路径
      let projectFilePath = Utility.formatFilePathWithWin32Style(projectDir + '/' + path.basename(this.getPackageUrlWithoutParams()));

      // 做日志
      logger.info('downloading package url: ' + this.packageUrl);

      // 下载
      let fd = null;
      http.get(this.packageUrl, async (res) => {
        fd = fs.openSync(projectFilePath, 'w');
        res.on('data', (chunk) => {
          fs.writeSync(fd, chunk, 0, chunk.length);
        });
        res.on('end', () => {
          fs.closeSync(fd);
          logger.info(`complete downloading.`);
          resolve(res);
        });
        res.on("error", (err) => {
          fs.closeSync(fd);
          logger.error(`request fail: "` + err);
          reject(err);
        });
      }).setTimeout(1000 * 40, () => {
        if (fd) {
          fs.closeSync(fd);
        }
        logger.error(`download timeout"`);
        reject('download timeout');
      });
    });
  }

  /**
   * 解压代码包
   */
  async decompress() {
    return new Promise(async (resolve, reject) => {
      logger.info(`do decompress.`);
      await Decompression.decompress(this.getDownloadFilePath(), this.getDecompressOutputPath())
        .then((msg) => {
          logger.info(msg);
          resolve(msg);
        }).catch((msg) => {
          logger.error(msg);
          reject(msg);
        });
    });
  }

  /**
   * 修改配置文件
   */
  modifyConfigJsFile() {
    logger.info(`modify config.`);

    // 获取基本原本的配置文件文本
    var outputPath = this.getDecompressOutputPath();
    var configPath = Utility.formatFilePathWithWin32Style(outputPath + '/config.js');
    var content = fs.readFileSync(configPath, 'utf8');

    // 找出配置文件中的APPID，并且赋值到实例属性
    var appId = '';
    var matchAppId = content.match(/['"]*APPID['"]*\s*:\s*['"]([^'"]+)['"]/i);
    if (matchAppId && matchAppId.length > 1) {
      appId = matchAppId[1];
    }
    if (!this.appId) {
      this.appId = appId;
    }

    // 找出配置文件中的APPTITLE，并且赋值到实例属性
    var projectName = '';
    var matchProjectName = content.match(/['"]*APPTITLE['"]*\s*:\s*['"]([^'"]+)['"]/i);
    if (matchProjectName && matchProjectName.length > 1) {
      projectName = matchProjectName[1];
    }
    // 如果没提供projectName，就根据配置文件，自动生成projectName
    if (!this.projectName) {
      this.projectName = projectName;
    }
    this.projectName += '_' + + new Date().getTime();

    // 替换数据SITEBASEURL
    if (this.configSiteBaseUrl) {
      content = content.replace(/(['"]*SITEBASEURL['"]*\s*:\s*['"])[^'"]+(['"])/i, '$1' + this.configSiteBaseUrl + '$2');
    }

    // 做日志
    logger.debug(`modify config content: ${content}`);

    // 写入文件
    fs.writeFileSync(configPath, content, 'utf8');
    return this;
  }

  /**
   * 创建工程配置文件(project.config.js)
   */
  createProjectConfigJsonFile() {
    logger.info(`create project config file.`);

    // 获取 project.config.js 配置文本
    var projectConfigString = WxAppProjectConfig
      .createInstance()
      .setAppId(this.appId)
      .setProjectName(this.projectName)
      .setLibVersion('')
      .setUrlCheck(false)
      .getConfigString();

    // 做日志
    logger.debug(`project config file: ` + projectConfigString);

    // 写入文件
    Utility.mkdirsSync(this.getDecompressOutputPath());
    var filePath = Utility.formatFilePathWithWin32Style(this.getDecompressOutputPath() + '/project.config.json');
    let fd = fs.openSync(filePath, 'w');
    try {
      fs.writeFileSync(fd, projectConfigString, 'utf-8');
    } catch (ex) {
      throw ex;
    } finally {
      if (fd) {
        fs.closeSync(fd);
      }
    }
    return this;
  }

  /**
   * 创建bat文件，用于打开编辑器
   */
  createBatFile() {
    logger.info(`create open editor bat file.`);

    // 找出编辑器所在盘符
    var drive = '';
    var match = this.wxEditorDir.match(/([a-zA-Z]):[/\\\\]+/i);
    if (match && match.length > 1) {
      drive = match[1];
    }

    // 执行打开编辑器代码
    let cmdStr = this.getCmdStringForOpenningProjectInWxEditor();

    // 因为路径可能涉及中文，bat文件中是不能用utf-8作为编码，去执行cmd命令的，
    // 所以需要重新编码，将bat文件编码成GB2312，才能成功执行。
    // 但fs.writeFileSync又不支持GB2312这种编码，所以先将命令文本装成流，
    // 再调用fs.writeFileSync写入文件。
    let buffer = iconv.encode(cmdStr, 'GB2312');

    // 将命令写入bat文件，
    // writeFileSync默认编码为utf-8，但没有GB2312这种编码，所以用ASCII
    let batPath = this.getRunBatPath();
    let fd = fs.openSync(batPath, 'w');
    try {
      fs.writeFileSync(batPath, buffer, 'ASCII');
    } catch (ex) {
      throw ex;
    } finally {
      fs.closeSync(fd);
    }
  }

  /**
   * 获取在微信开发者工具打开项目的命令
   * 格式为 "c:\aa bb\中文路径\cli.bat" -o "d:\中文项目路径\aa"
   */
  getCmdStringForOpenningProjectInWxEditor() {
    let cmsStr = '"' + Utility.formatFilePathWithWin32Style(this.wxEditorDir + '\\cli.bat') + '" -o "'
      + Utility.formatFilePathWithWin32Style(this.getDecompressOutputPath()) + '"';
    return cmsStr;
  }

  /**
   * 准备
   */
  async prepare() {
    return new Promise(async (resolve, reject) => {
      try {
        this.checkOptions();
        this.createProjectDir();

        let hasReject = false;

        await this.downloadPackage().catch((ex) => {
          hasReject = true;
          throw ex;
        });

        await this.decompress().catch((ex) => {
          throw ex;
        });

        this.modifyConfigJsFile();
        this.createProjectConfigJsonFile();
        this.createBatFile();

        logger.info('prepare successfully.');
        resolve({ msg: 'prepare successfully.' });

        /*
        return Promise.all([this.decompress()])
          .then(() => {
            this.modifyConfigJsFile();
            this.createProjectConfigJsonFile();
            this.createBatFile();
            logger.info('prepare successfully.');
            resolve({ msg: 'prepare successfully.' });
          })
          .catch((ex) => { reject({ ex }) });
          */
      } catch (ex) {
        reject(ex);
      }
    });
  }

  /**
   * 用bat打开编辑器
   */
  openByBat() {
    logger.info(`open wx editor by run.bat.`);

    let batPath = this.getRunBatPath();
    let cmdStr = '"' + batPath + '"';
    logger.debug(`run cmd: "${cmdStr}".`);

    child_process.execSync(cmdStr, (err, stdout, stderr) => {
      if (stdout) {
        logger.info('msg: ' + stdout);
      }
      if (err) {
        logger.error('err: ' + err);
      }
      if (stderr) {
        logger.error('stderr: ' + stderr);
      }
    });
  }

  /**
   * 用命令行打开编辑器
   */
  openByCmd() {
    logger.info(`open wx editor by direct visit command.`);

    var drive = '';
    var match = this.wxEditorDir.match(/([a-zA-Z]):[/\\\\]+/i);
    if (match && match.length > 1) {
      drive = match[1];
    }

    // 获取打开命令
    let cmdStr = this.getCmdStringForOpenningProjectInWxEditor();
    logger.debug(`cmdStr:` + cmdStr);

    // 执行命令
    child_process.exec(cmdStr, (err, stdout, stderr) => {
      if (stdout) {
        logger.info('msg: ' + stdout);
      }
      if (err) {
        logger.error('err: ' + err);
      }
      if (stderr) {
        logger.error('stderr: ' + stderr);
      }
    })

    return this;
  }

  /**
   * 打开编辑器工具
   */
  open() {
    // this.openByBat();
    this.openByCmd();
  }
}

module.exports = AutoDeploy;