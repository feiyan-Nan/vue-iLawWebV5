import loginUtil from '@/utils/login'

describe('登录工具方法单元测试', () => {
  describe('账号激活手机号码格式校验', () => {
    it('账号激活正确的手机号吗', () => {
      assert.isTrue(loginUtil.checkPhoneReg('0086', '15000000000')[0])
      assert.isTrue(loginUtil.checkPhoneReg('012', '1500000')[0])
    })

    it('账号激活手机号格式有误', () => {
      assert.isFalse(loginUtil.checkPhoneReg('0086', '1500000')[0])
      assert.isFalse(loginUtil.checkPhoneReg('012', 'ssss')[0])
    })
  })
  describe('账号激活用户名校验', () => {
    it('账号激活正确的用户名', () => {
      assert.isTrue(loginUtil.checkNameReg('ABC')[0])
      assert.isTrue(loginUtil.checkNameReg('橙子')[0])
    })

    it('账号激活用户名格式有误', () => {
      assert.isFalse(loginUtil.checkNameReg('abc/')[0])
      assert.isFalse(loginUtil.checkNameReg('😃')[0])
      assert.isFalse(loginUtil.checkNameReg('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')[0])
    })
  })
})