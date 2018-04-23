var assert = require('assert');
var should = require('should');
var tokenUtil = require("../../lib/token-utility");

describe('test-token-utility', () => {
  let key = 'ss_';
  let testIndex = 1;

  beforeEach(() => {
    testIndex = 1;
  })

  describe('#createToken()', () => {
    it(`${testIndex++} 测试创建token`, () => {
      let token = tokenUtil.createToken(key);
      should(token).not.be.null();
      let val = token.getVal();
      should(val).not.be.null();
      val.length.should.greaterThan(0);
    });
  })

  describe('#removeToken()', () => {
    it(`${testIndex++} 测试删除token`, () => {
      let token = tokenUtil.createToken(key);
      tokenUtil.removeToken(key);
      let token2 = tokenUtil.getToken(key);
      should(token2).be.undefined();
    });
  })

  describe('#refreshTokenVal()', () => {
    it(`${testIndex++} 测试刷新token`, () => {
      let token = tokenUtil.createToken(key);
      let originTokenVal = token.getVal();
      tokenUtil.refreshTokenVal(key);
      let token2 = tokenUtil.getToken(key);

      should(token2).not.be.null().and.not.be.undefined();
      should(token2.getVal()).not.be.null().and.not.be.undefined();
      token2.getVal().should.not.be.equal(originTokenVal);
    });
  })

  describe('#checkToken()', () => {
    it(`${testIndex++} 测试检查token，正常值`, () => {
      let token = tokenUtil.createToken(key);
      tokenUtil.checkToken(key, token.getVal()).should.be.equal(true);
    });

    it(`${testIndex++} 测试检查token，错误值`, () => {
      let token = tokenUtil.createToken(key);
      tokenUtil.checkToken(key, '111111111').should.not.be.equal(true);
    });
  })

  describe('#getToken()', () => {
    it(`${testIndex++} 测试获取token`, () => {
      let token = tokenUtil.createToken(key);
      let token2 = tokenUtil.getToken(key);

      should(token2).not.be.null().and.not.be.undefined();
      should(token2.getVal()).not.be.null().and.not.be.undefined();
      token2.getVal().should.be.equal(token.getVal());
    });

    it(`${testIndex++} 测试获取token null情况`, () => {
      let token = tokenUtil.createToken(key);
      let token2 = tokenUtil.getToken('121224sxdr434');
      should(token2).be.undefined();
    });
  })

  describe('#getTokenIfNullCreated()', () => {
    it(`${testIndex++} 测试获取token`, () => {
      let token = tokenUtil.createToken(key);
      let token2 = tokenUtil.getTokenIfNullCreated(key);

      should(token2).not.be.null().and.not.be.undefined();
      should(token2.getVal()).not.be.null().and.not.be.undefined();
      token2.getVal().should.be.equal(token.getVal());
    });

    it(`${testIndex++} 测试获取token`, () => {
      let token = tokenUtil.getTokenIfNullCreated(key);
      let token2 = tokenUtil.createToken(key);

      should(token2).not.be.null().and.not.be.undefined();
      should(token2.getVal()).not.be.null().and.not.be.undefined();
      token2.getVal().should.not.be.equal(token.getVal());
    });
  })

  describe('#getVal()', () => {
    it(`${testIndex++} 测试获取token值`, () => {
      let token = tokenUtil.createToken(key);
      let token2 = tokenUtil.getTokenIfNullCreated(key);

      should(token2).not.be.null().and.not.be.undefined();
      should(token2.getVal()).not.be.null().and.not.be.undefined();
      token2.getVal().should.be.equal(token.getVal());
    });

    it(`${testIndex++} 测试获取token值`, () => {
      let token = tokenUtil.createToken(key);
      let token2 = tokenUtil.getTokenIfNullCreated(key);
      let token3 = tokenUtil.getTokenIfNullCreated(key);

      should(token2).not.be.null().and.not.be.undefined();
      should(token2.getVal()).not.be.null().and.not.be.undefined();
      should(token3).not.be.null().and.not.be.undefined();
      should(token3.getVal()).not.be.null().and.not.be.undefined();
      token2.getVal().should.be.equal(token.getVal());
      token3.getVal().should.be.equal(token2.getVal());
    });

    it(`${testIndex++} 测试获取值`, () => {
      let tokenA = tokenUtil.createToken(key);
      let tokenB = tokenUtil.createToken(key + 'aaa');
      let tokenA2 = tokenUtil.getTokenIfNullCreated(key);
      let tokenB2 = tokenUtil.getTokenIfNullCreated(key + 'aaa');

      should(tokenA2).not.be.null().and.not.be.undefined();
      should(tokenB2).not.be.null().and.not.be.undefined();
      should(tokenA2.getVal()).not.be.null().and.not.be.undefined();
      should(tokenB2.getVal()).not.be.null().and.not.be.undefined();

      tokenA2.getVal().should.not.be.equal(tokenB2.getVal());
    });
  })
})
