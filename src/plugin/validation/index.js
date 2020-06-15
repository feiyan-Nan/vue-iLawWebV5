/**
 * create by liuhao
 * date 2018-04-14
 * 验证方法，注意要考虑异步验证方案，因此使用了Promise以及函数回掉来控制
 */
const validation = {
  validate (model, rules, errors, broadcast, callback) {
    let vp = []
    // 未传递rules的时候不进行表单验证
    if (!rules) {
      return Promise.resolve(errors)
    }
    // 获取绑定对象中所有的属性值，和规则值做判断，如果存在规则内容，则进行验证
    Object.keys(model).forEach(key => {
      let val = model[key]
      // 如果rule的prop有设置key属性按照key属性比较，否则按照prop属性比较
      let ruleKey = Object.keys(rules).filter(prop => {
        return rules[prop].key === key || prop === key
      }).shift()
      let rule = rules[ruleKey]
      // 如果存在该属性的验证规则，那么进行验证
      if (rule) {
        // 执行验证规则
        if (rule.validators) {
          // 使用[].concat的原因在于不能移除掉rules对象本身中的validators，需要copy一份来做处理
          vp.push(validate(key, val, [].concat(rule.validators), errors, broadcast))
        }
      }
    })
    return Promise.all(vp).then(() => {
      callback && callback(errors)
    })
  }
}

// 规则验证，递归依次验证
function validate (key, val, validators, errors, broadcast) {
  // 当对应属性没有错误信息的时候才发生验证调用
  let validator = validators[0]
  if (!errors[key].msg && validator && validator.validate && typeof validator.validate === 'function') {
    // 递归调用验证规则，验证通过一个进行下一个，否则终止验证
    return Promise.resolve(validator.validate(val)).then(res => {
      if (!res) {
        errors[key] = { msg: validator.error, validating: false }
        broadcast(errors)
      } else {
        validators.shift()
        return validate(key, val, validators, errors, broadcast)
      }
    })
  }
  errors[key].validating = false
  broadcast(errors)
  return Promise.resolve(null)
}

export default validation