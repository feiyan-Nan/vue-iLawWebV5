import i18n from '@/utils/i18n'

describe('国际化对象的单元测试', () => {
  it('设置中文语言获取中文信息', () => {
    i18n.language = 'zh'
    assert.equal(i18n.getText()['FOR_ALPHA'], '为了Alpha')
  })
  it('设置英文语言获取英文数据信息', () => {
    i18n.language = 'en'
    assert.equal(i18n.getText()['FOR_ALPHA'], 'For Alpha')
  })
})