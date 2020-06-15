import validation from '@/plugin/validation'

describe('validaiton方法验证', () => {
  it('validate方法验证，通过验证', () => {
    const model = {
      name: 'Test'
    }
    const rules = {
      name: {
        validators: [{
          validate (data) {
            return data !== null
          },
          error: '名称不能为空'
        }]
      }
    }
    validation.validate(model, rules, (res) => {
      assert.equal(Object.keys(res).length, 0)
    })
  })
  it('validate方法验证，验证失败', () => {
    const model = {
      name: ''
    }
    const rules = {
      name: {
        validators: [{
          validate (data) {
            return data !== ''
          },
          error: '名称不能为空'
        }]
      }
    }
    validation.validate(model, rules, (res) => {
      assert.equal(Object.keys(res).length, 1)
      assert.equal(res.name.msg, '名称不能为空')
    })
  })
  it('validate方法验证（异步），通过验证', async () => {
    const model = {
      name: 'Test'
    }
    const rules = {
      name: {
        validators: [{
          validate (data) {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(true)
              }, 1000)
            })
          },
          error: '名称不能为空'
        }]
      }
    }
    await validation.validate(model, rules, (res) => {
      assert.equal(Object.keys(res).length, 0)
    })
  })
  it('validate方法验证（异步），验证失败', async () => {
    const model = {
      name: ''
    }
    const rules = {
      name: {
        validators: [{
          validate (data) {
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(false)
              }, 1000)
            })
          },
          error: '名称不能为空'
        }]
      }
    }
    await validation.validate(model, rules, (res) => {
      assert.equal(Object.keys(res).length, 1)
      assert.equal(res.name.msg, '名称不能为空')
    })
  })

  it('validate方法验证, 未绑定规则，或者rules为null', () => {
    const model = {
      name: ''
    }
    validation.validate(model, null, (res) => {
      assert.equal(Object.keys(res).length, 0)
    })
  })
})