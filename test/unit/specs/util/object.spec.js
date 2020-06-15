import objUtil from '@/utils/object'

describe('对象工具方法单元测试', () => {
  describe('isEmpty方法', () => {
    it('验证null对象是否true', () => {
      assert.isTrue(objUtil.isEmpty(null))
    })
    it('验证undefined对象是否true', () => {
      assert.isTrue(objUtil.isEmpty(undefined))
    })
    it('验证空字符串对象是否true', () => {
      assert.isTrue(objUtil.isEmpty(''))
    })
    it('验证全部为空格的字符串对象是否true', () => {
      assert.isTrue(objUtil.isEmpty('   '))
    })
  })
})