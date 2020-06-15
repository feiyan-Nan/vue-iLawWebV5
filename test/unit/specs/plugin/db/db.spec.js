import db from '@/plugin/db'

describe('db存储方法相关', () => {
  let ls = db.ls
  let ss = db.ss
  describe('localStorage操作方法', () => {
    beforeEach(() => {
      ls.set('TEST', 'test')
      ls.set('TEST_1', 'test_1')
    })
    it('get方法的验证', () => {
      let obj = JSON.parse(localStorage.getItem('TEST'))
      assert.equal(obj, 'test')
    })
    it('set方法的验证', () => {
      assert.equal(ls.get('TEST'), 'test')
    })
    it('remove方法的验证', () => {
      ls.remove('TEST')
      assert.isNull(ls.get('TEST'))
      assert.equal(ls.get('TEST_1'), 'test_1')
    })
    it('clear方法的验证', () => {
      ls.clear()
      assert.isNull(ls.get('TEST'))
      assert.isNull(ls.get('TEST_1'))
    })
  })
  describe('sessionStorage操作方法', () => {
    beforeEach(() => {
      ss.set('TEST', 'test')
      ss.set('TEST_1', 'test_1')
    })
    it('get方法的验证', () => {
      let obj = JSON.parse(sessionStorage.getItem('TEST'))
      assert.equal(obj, 'test')
    })
    it('set方法的验证', () => {
      assert.equal(ss.get('TEST'), 'test')
    })
    it('remove方法的验证', () => {
      ss.remove('TEST')
      assert.isNull(ss.get('TEST'))
      assert.equal(ss.get('TEST_1'), 'test_1')
    })
    it('clear方法的验证', () => {
      ss.clear()
      assert.isNull(ss.get('TEST'))
      assert.isNull(ss.get('TEST_1'))
    })
  })
})