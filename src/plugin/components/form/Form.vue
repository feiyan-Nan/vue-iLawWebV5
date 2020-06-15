<template lang="pug">
  form(action="")
    slot
</template>
<script>
/**
 * create by liuhao
 * date 2018-04-14
 * 表单验证方案。采用和element-ui类似的验证规则，icourt简化版本
 * model为绑定的表单对象
 * rules为需要验证的规则，和element类似，加入了验证规则组的概念
 * rules: {
 *  propertyName: { // 验证表单model的属性名作为key
 *    group: // 验证诅
 *    validators: [{ // 自定义验证规则
 *      validate: // 验证方法
 *      error: // 错误提示
 *    }]
 *    trigger: // 触发条件
 *  }
 * }
 */
import validation from '../../validation'
import emitter from '../../mixin/emitter'
export default {
  name: 'IcForm',
  componentName: 'IcForm',
  mixins: [ emitter ],
  props: {
    model: Object, // 表单验证对象
    rules: Object, // 表单验证规则
  },
  data () {
    return {
      errors: {} // 验证以后错误信息结果集合
    }
  },
  methods: {
    validate (next) { // 验证
      // 如果是单个输入框的数据验证
      if (!this.rules) {
        // console.warn('[ic-warn]表单没有绑定数据，验证失败')
        return
      }
      // 设置
      for (let key of Object.keys(this.rules)) {
        this.errors[key] = {validating: true}
      }
      this.broadcastError(this.errors)
      validation.validate(this.model, this.rules, this.errors, this.broadcastError, errors => {
        if (Object.keys(errors).length !== 0) {
          Object.assign(this.errors, errors)
        }
        // 判断是否还存在errors存在错误信息，如果所有都没有返回true
        if (Object.keys(this.errors).every(key => !this.errors[key].msg)) {
          next(true)
        } else {
          next(false)
        }
      })
    },
    validateField (field) { // 验证某个输入字段
      // 单个组件的验证
      if (!field || !field.prop) {
        // console.warn('[ic-warn]没有绑定使用的表单组件')
        return
      }
      let model = {[field.prop]: field.value}
      // 进行数据验证，将错误信息添加到errors对象中
      this.errors = this.errors || {}
      this.errors[field.prop] = { validating: true }
      // 开始进入验证的时候发送通知，进入validating状态
      this.broadcastError(this.errors)
      // 开始进行验证操作
      validation.validate(model, this.rules, this.errors, this.broadcastError)
    },
    clearValidate () { // 清空验证结果
      this.errors = {}
      this.broadcast('IcInput', 'form.update-error', [])
    },
    broadcastError (errors) { // 需要触发的一场验证broadcast
      this.broadcast('IcInput', 'form.update-error', [errors])
    }
  },
  created () {
    // 增加单个输入内容的验证触发事件
    this.$on('form.blur', field => {
      this.validateField(field)
    })
    this.$on('form.change', field => {
      this.validateField(field)
    })
    this.$on('form.keyup', field => {
      this.validateField(field)
    })
  }
}
</script>
<style lang="scss" scoped>

</style>
