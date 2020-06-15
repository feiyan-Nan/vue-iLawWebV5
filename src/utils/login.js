import rules from '@/utils/validation/rules'

const loginUtil = {
  checkPhoneReg,
  checkNameReg
}

/**
 * 手机号码格式校验
 * @param {*} zone 区号
 * @param {*} phone 手机号码
 */
function checkPhoneReg (zone, phone) {
  const MOBILE_EMPTY = '请输入手机号'

  if (!phone) {
    return [false, MOBILE_EMPTY]
  }

  if (zone === '0086' && !rules().mobile.validate(phone)) {
    return [false, rules().mobile.error]
  } else if (!rules().otherMobile.validate(phone)) {
    return [false, rules().mobile.error]
  }

  return [true]
}

/**
 * 用户注册姓名校验
 * @param {*} name 姓名
 */
function checkNameReg (name) {
  const spritReg = /\//g
  const NAME_EMPTY = '请输入您的姓名'
  const NAME_NOT_RIGHT = '请输入正确的姓名'

  if (!name) {
    return [false, NAME_EMPTY]
  } else if (!rules().noEmoji.validate(name)) {
    return [false, NAME_NOT_RIGHT]
  } else if (name.length > 64) {
    return [false, NAME_NOT_RIGHT]
  } else if (spritReg.test(name)) {
    return [false, NAME_NOT_RIGHT]
  }

  return [true]
}

export default loginUtil
