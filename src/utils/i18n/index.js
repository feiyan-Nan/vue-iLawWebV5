import en from './en.json'
import zh from './zh.json'

import { STORAGE } from '@/utils/constants'
let ls = db.ls
/**
 * create by liuhao
 * date 2018-04-12
 * 解决内容国际化问题，提供了设置语言的方法，当设置语言的时候替换对应的语言版本
 * 也提供了使得项目中所有关键字文本统一的方式，避免同一关键字文本修改的时候需要修改多处文案内容
 */
// 国际化文本对象
const I18N_TEXT = {
  ...zh
}
// 国际化文本方法
const i18n = {
  set language (language) {
    this._language = language
    // 使用新的语言覆盖当前的语言文本信息
    Object.assign(I18N_TEXT, changeLanguage(language))
    // 重新处理语言文本缓存
    ls.set(STORAGE.LANGUAGE_TEXT, I18N_TEXT)
  },
  get language () {
    return this._language
  },
  getText () {
    return ls.get(STORAGE.LANGUAGE_TEXT)
  }
}
// 首次加载的时候进行初始化操作
if (!ls.get(STORAGE.LANGUAGE_TEXT)) {
  ls.set(STORAGE.LANGUAGE_TEXT, I18N_TEXT)
}
/**
 * 改变语言对应的文本信息
 * @param language 语言
 */
function changeLanguage (language) {
  switch (language) {
    case 'zh': return zh
    case 'en': return en
    default: return zh
  }
}
export default i18n