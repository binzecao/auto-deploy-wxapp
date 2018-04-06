var fs = require('fs');
var path = require('path');
var join = path.join;
var PathError = require('./error/path-error');

class Utility {
  /**
   * 创建文件夹，支持递归
   * @param {string} dirname 
   */
  static mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (Utility.mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  }

  /**
   * 删除文件夹，支持递归
   * @param {string} path 
   */
  static rmdirSync(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function (file) {
        var curPath = path + "/" + file;
        if (fs.statSync(curPath).isDirectory()) { // recurse
          Utility.rmdirSync(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };


  /**
   * 查找某个文件夹内，所有的文件名
   * @param {string} startPath 
   * @returns {Array}
   */
  static findAllFilesSync(startPath) {
    let result = [];
    let finder = (path) => {
      let files = fs.readdirSync(path);
      files.forEach((val, index) => {
        let fPath = join(path, val);
        let stats = fs.statSync(fPath);
        if (stats.isDirectory()) finder(fPath);
        if (stats.isFile()) result.push(fPath);
      });

    }
    finder(startPath);
    return result;
  }

  /**
   * 将路径格式化成windows格式
   * @param {string} path 
   * @returns {string} 
   */
  static formatFilePathWithWin32Style(path) {
    if (!/^[a-zA-Z]:/.test(path)) {
      throw new PathError('The path is not the win32 format.');
    }
    return (path || '').replace(/[\/\\]+/g, '\\');
  }

  /**
   * 校准url的斜杠
   * @param {string} url 
   * @returns {string} 
   */
  static adjustUrlSlash(url) {
    if (!/^https*:/.test(url)) {
      throw new PathError('The url is invalid.');
    }
    return (url || '').replace(/[\\\/]+/g, '/').replace(/(https*:)\/+/g, '$1//');
  }
}

module.exports = Utility;