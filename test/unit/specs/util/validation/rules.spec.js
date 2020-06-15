import rules from '@/utils/validation/rules'

describe('验证项目验证规则的有效性', () => {
  describe('notEmpty验证校验', () => {
    it('空对象校验', () => {
      assert.isTrue(rules().notEmpty.validate({}))
    })
    it('非空字符串校验', () => {
      assert.isTrue(rules().notEmpty.validate('test'))
    })
    it('数字校验', () => {
      assert.isTrue(rules().notEmpty.validate(0))
    })
    it('空字符串校验', () => {
      assert.isFalse(rules().notEmpty.validate(''))
      assert.isFalse(rules().notEmpty.validate('    '))
    })
    it('null对象校验', () => {
      assert.isFalse(rules().notEmpty.validate(null))
    })
    it('undefined对象校验', () => {
      assert.isFalse(rules().notEmpty.validate(undefined))
    })
  })
  describe('email验证校验', () => {
    it('正确的email校验', () => {
      assert.isTrue(rules().email.validate('icourt@icourt.cc'))
    })
    it('错误的email校验', () => {
      assert.isFalse(rules().email.validate('icourt.cc'))
    })
  })
  describe('手机号码验证校验', () => {
    it('正确的phone校验', () => {
      assert.isTrue(rules().phone.validate('+8615800000000'))
      assert.isTrue(rules().phone.validate('+86 15800000000'))
      assert.isTrue(rules().phone.validate('15800000000'))
    })
    it('位数不正确', () => {
      assert.isFalse(rules().phone.validate('15800000'))
    })
  })
  describe('无区号中国手机号码验证校验', () => {
    it('正确的mobile校验', () => {
      assert.isTrue(rules().mobile.validate('15800000000'))
      assert.isTrue(rules().mobile.validate('13300000000'))
    })
    it('格式不正确', () => {
      assert.isFalse(rules().mobile.validate('15800000'))
      assert.isFalse(rules().mobile.validate('1580000ssss'))
      assert.isFalse(rules().mobile.validate('+15800000000'))
    })
  })
  describe('无区号其他地区手机号码验证校验', () => {
    it('正确的otherMobile校验', () => {
      assert.isTrue(rules().otherMobile.validate('15800000000'))
      assert.isTrue(rules().otherMobile.validate('1234'))
    })
    it('格式不正确', () => {
      assert.isFalse(rules().otherMobile.validate('12ss'))
      assert.isFalse(rules().otherMobile.validate('+15800000'))
    })
  })
  describe('onlyNum验证校验', () => {
    it('空数据校验', () => {
      assert.isTrue(rules().onlyNum.validate(''))
      assert.isTrue(rules().onlyNum.validate(undefined))
      assert.isTrue(rules().onlyNum.validate(null))
    })
    it('数字校验', () => {
      assert.isTrue(rules().onlyNum.validate(0))
      assert.isTrue(rules().onlyNum.validate(1))
    })
    it('非数字校验', () => {
      assert.isFalse(rules().onlyNum.validate({}))
      assert.isFalse(rules().onlyNum.validate('"'))
    })
  })
  describe('onlyNumOrAlphabet验证校验', () => {
    it('空数据校验', () => {
      assert.isTrue(rules().onlyNumOrAlphabet.validate(''))
      assert.isTrue(rules().onlyNumOrAlphabet.validate(undefined))
      assert.isTrue(rules().onlyNumOrAlphabet.validate(null))
    })
    it('数字校验', () => {
      assert.isTrue(rules().onlyNumOrAlphabet.validate(0))
      assert.isTrue(rules().onlyNumOrAlphabet.validate(1))
    })
    it('字母校验', () => {
      assert.isTrue(rules().onlyNumOrAlphabet.validate('s'))
    })
    it('非数字字母校验', () => {
      assert.isFalse(rules().onlyNumOrAlphabet.validate({}))
      assert.isFalse(rules().onlyNumOrAlphabet.validate('*'))
    })
  })
  describe('noSpaces验证校验', () => {
    it('空数据校验', () => {
      assert.isTrue(rules().noSpaces.validate(''))
      assert.isTrue(rules().noSpaces.validate(undefined))
      assert.isTrue(rules().noSpaces.validate(null))
    })
    it('存在空格数据校验', () => {
      assert.isFalse(rules().noSpaces.validate('T es t'))
    })
  })
  describe('noEmoji验证校验', () => {
    it('空数据校验', () => {
      assert.isTrue(rules().noEmoji.validate(''))
      assert.isTrue(rules().noEmoji.validate(undefined))
      assert.isTrue(rules().noEmoji.validate(null))
    })
    it('存在Emoji数据校验', () => {
      assert.isFalse(rules().noEmoji.validate('😊'))
    })
  })
  describe('noSpecial验证校验', () => {
    it('空数据校验', () => {
      assert.isTrue(rules().noSpecial.validate(''))
      assert.isTrue(rules().noSpecial.validate(undefined))
      assert.isTrue(rules().noSpecial.validate(null))
    })
    it('特殊字符数据校验', () => {
      assert.isFalse(rules().noSpecial.validate('*'))
      assert.isFalse(rules().noSpecial.validate(':'))
      assert.isFalse(rules().noSpecial.validate('?'))
      assert.isFalse(rules().noSpecial.validate('|'))
      assert.isFalse(rules().noSpecial.validate('<'))
      assert.isFalse(rules().noSpecial.validate('>'))
      assert.isFalse(rules().noSpecial.validate('\\'))
      assert.isFalse(rules().noSpecial.validate('/'))
      assert.isFalse(rules().noSpecial.validate('"'))
    })
  })
  describe('传入多个值校验是否都存在非空非undefined字符串', () => {
    it('传入值正确', () => {
      assert.isTrue(rules().rightParams.validate('a', 'b', 'c'))
      assert.isTrue(rules().rightParams.validate(12, '2', 'abc'))
    })
    it('传入值有误', () => {
      assert.isFalse(rules().rightParams.validate('undefined', 'a'))
      assert.isFalse(rules().rightParams.validate('a', '', 'c'))
      assert.isFalse(rules().rightParams.validate('a', undefined, 'c'))
      assert.isFalse(rules().rightParams.validate('a', null, 'c'))
    })
  })
})