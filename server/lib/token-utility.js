class Token {
  constructor(key) {
    this.key = key + '';
    this.val = null;
    if (this.key.length === 0) {
      throw new Error('Token must have a key');
    }
  }

  /**
   * 生成token值
   * @returns {string}
   */
  genrateVal() {
    return (new Date()).getTime() + '' + parseInt(Math.random() * 100000);
  }

  /**
   * 刷新token值
   */
  refreshVal() {
    this.val = this.genrateVal();
  }

  /**
   * 获取token值
   * @returns {string}
   */
  getVal() {
    return this.val;
  }
}

class TokenUtil {
  /**
   * 创建token对象
   * @param {string} key 
   * @returns {Token}
   */
  static createToken(key) {
    let token = new Token(key);
    let tokens = cachedTokens;

    let keyIndex = tokens.findIndex(item => {
      return item.key === key;
    });

    if (keyIndex === -1) {
      tokens.push(token);
    } else {
      tokens[keyIndex] = token;
    }

    token.refreshVal();
    return token;
  }

  /**
   * 删除token
   * @param {string} key 
   */
  static removeToken(key) {
    let tokens = cachedTokens;
    let keyIndex = tokens.findIndex(item => {
      return item.key === key;
    });
    tokens.splice(keyIndex, 1);


  }

  /**
   * 刷新token值
   * @param {string} key 
   */
  static refreshTokenVal(key) {
    let tokens = cachedTokens;
    let token = tokens.find(item => {
      return item.key === key;
    });
    if (token) {
      token.refreshVal();
      return true;
    }
    return false;
  }

  /**
   * 验证token是否正确
   * @param {string} key 
   * @param {string} val 
   * @returns {boolean}
   */
  static checkToken(key, val) {
    let tokens = cachedTokens;
    let hasFound = false;
    tokens.forEach(item => {
      if (item.key === key && item.val === val + '') {
        hasFound = true;
        return false;
      }
    });
    return hasFound;
  }

  /**
   * 根据key获取token，如果找不到，则返回null
   * @param {string} key 
   * @returns {Token}
   */
  static getToken(key) {
    let tokens = cachedTokens;
    return tokens.find(item => {
      return item.key === key;
    });
  }

  /**
   * 获取全新的token
   * @param {string} key 
   * @returns {Token}
   */
  static getTokenIfNullCreated(key) {
    let token = TokenUtil.getToken(key);
    if (!token) {
      token = TokenUtil.createToken(key);
    }
    return token;
  }

  /**
   * 根据key获取token对应的值
   * @param {string} key 
   * @returns {string|null}
   */
  static getVal(key) {
    let token = TokenUtil.getToken(key);
    if (token) {
      return token.val;
    }
    return null;
  }
}

/**
 * 缓存生成的token
 */
let cachedTokens = []


module.exports = TokenUtil;