import objUtil from '@/utils/object'
import i18n from '@/utils/i18n'

const TEXT = i18n.getText()
/**
 * create by liuhao
 * 验证基础规则，所有的验证规则需要在这里声明
 * 声明内容包含两部分：rule和error
 * rule：验证所需要判断的规则
 * error: 验证的基础错误提示
 */
const rules = (label = '') => {
  return {
    // 不能为空
    notEmpty: {
      validate (data) {
        return !objUtil.isEmpty(data)
      },
      error: label + TEXT.NOT_EMPTY
    },
    // 邮箱校验
    email: {
      validate (data) {
        const REGEXP = /^[A-Za-z0-9_.-]+@([A-Za-z0-9_-]+\.)+[A-Za-z0-9]+$/
        return objUtil.isEmpty(data) || REGEXP.test(data)
      },
      error: label + TEXT.PATTERN_NOT_RIGHT
    },
    // 电话号码
    phone: {
      validate (data) {
        const REGEXP = /^008536\d{6,7}$|^0049017\d{8}$|^((\+86|0086)\s|(\+86|0086))?1[3456789]\d{9}$/
        return objUtil.isEmpty(data) || REGEXP.test(data)
      },
      error: label + TEXT.PATTERN_NOT_RIGHT
    },
    // 手机号码
    mobile: {
      validate (data) {
        const REGEXP = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/g
        return objUtil.isEmpty(data) || REGEXP.test(data)
      },
      error: label + TEXT.MOBILE_PATTERN_NOT_RIGHT
    },
    // 其他地区手机号码(区号非0086)
    otherMobile: {
      validate (data) {
        const REGEXP = /^\d+$/g
        return objUtil.isEmpty(data) || REGEXP.test(data)
      },
      error: label + TEXT.MOBILE_PATTERN_NOT_RIGHT
    },
    // 仅限数字
    onlyNum: {
      validate (data) {
        return objUtil.isEmpty(data) || /^[0-9]*$/g.test(data)
      },
      error: label + TEXT.ONLY_NUM
    },
    // 仅限数字和字母
    onlyNumOrAlphabet: {
      validate (data) {
        return objUtil.isEmpty(data) || /^[0-9a-zA-Z]*$/g.test(data)
      },
      error: label + TEXT.OLNY_NUM_ALPHABET
    },
    // 不能包含空格
    noSpaces: {
      validate (data) {
        return objUtil.isEmpty(data) || !/\s/g.test(data)
      },
      error: label + TEXT.NO_SPACES
    },
    // Emoji验证
    noEmoji: {
      validate (data) {
        let emotionsReg = /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/
        return objUtil.isEmpty(data) || !emotionsReg.test(data)
      },
      error: label + TEXT.NO_EMOJI
    },
    // 特殊字符验证
    noSpecial: {
      validate (data) {
        return objUtil.isEmpty(data) || !/[*:?|<>\\/'"]/.test(data)
      },
      error: label + TEXT.NO_SPECIAL_CHARACTER
    },
    // 非空非 undefined字符串
    rightParams: {
      validate (...params) {
        let isRightParams = true
        for (let index = 0; index < params.length; index++) {
          if (!params[index] || objUtil.isEmpty(params[index]) || params[index] === 'undefined') {
            isRightParams = false
            break
          }
        }
        return isRightParams
      }
    }
  }
}

export default rules