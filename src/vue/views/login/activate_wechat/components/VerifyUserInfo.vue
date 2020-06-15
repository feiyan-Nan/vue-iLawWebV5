<template lang="pug">
.login_verify-activate-wrap
  .login_verify-activate-content
    .login_verify-activate-stepone
      .login_verify-activate-title {{ verifyInfo.title }}
      form(name="verifyPhoneForm")
        .login_verify-activate-form
          label.login_verify-activate-label(:class="{'placeholder': verifyInfo.name == '' & !nameLabel}") 姓名

          input.login_verify-input(autocomplete="off" type="text"  @focus="inputFocus('nameLabel')" @blur="inputBlur('nameLabel')" v-model="verifyInfo.name" name="verifyPhone" i-validation-message  @keyup="keyUpCheckNameReg" paravalue="6px" class="verify-name-input" :class="{'verify-input-error-color':nameError}")
          i.ibass-required
          label.login_verify-activate-first-error.label-active(v-show="nameError") {{ nameError }}
            i.ibass-warning

        .login_verify-activate-form(v-if="type!='integration'")
          label.login_verify-activate-label(:class="{'placeholder': verifyInfo.officeName == '' && !lawyerLabel}") 律所名称
          input.login_verify-input(autocomplete="off" type="text" @focus="inputFocus('lawyerLabel')" @blur="inputBlur('lawyerLabel')" v-model="verifyInfo.officeName" name="verifyPhone" i-validation-message @keyup="keyUpCheckLawyerFirmReg" paravalue="6px" class="verify-lawyer-firm-input" :class="{'verify-input-error-color':lawyerFirmError, 'placeholder': lawyerLabel}" )
          i.ibass-required
          label.login_verify-activate-first-error.label-active(v-show="lawyerFirmError") {{ lawyerFirmError }}
            i.ibass-warning

        .login_verify-activate-btns-one
          a.login_verify-btn.btn-prev-step(name="校验手机验证码_手机认证" @click="prevStep") 上一步
          a.login_verify-btn.btn-next-step(:class=("{'btn-disabled': !canNext}") name="校验手机验证码_手机认证" @click="nextStep") 激活账号
</template>

<script>
import loginService from '@/vue/service/login'
import loginUtils from '@/utils/login'

export default {
  props: {
    verifyInfo: {
      type: Object
    },
    verifySuccess: {
      type: Function
    },
    prevStep: {
      type: Function
    },
    loading: {
      type: Function
    }
  },
  data () {
    return {
      nameError: '',
      lawyerFirmError: '',
      nameLabel: false,
      lawyerLabel: false,
      canNext: false,
      type: this.$route.query.type
    }
  },
  methods: {
    /**
     * 输入框获取焦点、失焦 - 触发 placeholder 动画
     */
    inputFocus (type) {
      this[type] = true
    },
    inputBlur (type) {
      this[type] = false

      if (type === 'nameLabel') {
        this.checkNameReg()
      } else if (type === 'lawyerLabel') {
        this.checkLawyerFirmReg()
      }
    },
    /**
     * 防抖校验姓名是否合规
     */
    keyUpCheckNameReg: _.debounce(function (ev) {
      if (ev.keyCode !== 9) {
        this.checkNameReg()
      }
    }, 300),
    /**
     * 姓名校验规则
     */
    checkNameReg () {
      this.nameError = ''

      let regResult = loginUtils.checkNameReg(this.verifyInfo.name)
      if (!regResult[0]) {
        this.nameError = regResult[1]
        this.canNext = false
        return false
      }

      // 如果校验通过 并且 律所名称有值则表单校验通过
      if (this.verifyInfo.officeName || this.type === 'integration') {
        this.canNext = true
      }

      return true
    },
    /**
     * 防抖校验律所名称
     */
    keyUpCheckLawyerFirmReg: _.debounce(function (ev) {
      if (ev.keyCode !== 9) {
        this.checkLawyerFirmReg()
      }
    }, 300),
    /**
     * 律所名称校验规则 - 必填
     */
    checkLawyerFirmReg () {
      this.lawyerFirmError = ''
      if (this.type === 'integration') {
        this.canNext = true
        return true
      }

      if (!this.verifyInfo.officeName) {
        this.lawyerFirmError = '请输入您的律所名称'
        this.canNext = false
        return false
      }

      // 如果律所名称校验通过 并且 姓名非空&校验通过则表单校验通过
      if (this.verifyInfo.name && this.nameError === '') {
        this.canNext = true
      }

      return true
    },
    /**
     * 用户注册
     */
    save () {
      let params = this.verifyInfo
      this.loading(true)

      loginService.register(params).then((res) => {
        this.verifySuccess(true, res)
      }, () => {
        this.verifySuccess(false)
      })
    },
    /**
     * 提交校验
     */
    async nextStep () {
      if (await this.checkNameReg() && await this.checkLawyerFirmReg()) {
        this.save()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login_verify{
  &-activate-form {
    width: 406px;
  }

  &-activate-btns {
    height: 16px;
  }

  &-activate-error {
    float: right;
    @extend %f-extra-small;
    color: $dangerous-color;
  }

  &-btn {
    margin-top: 48px;
  }

  &-input {
    width: 320px;
  }
}

.btn-prev-step {
  background: $color-white;
  border: 1px solid #e8e8e8;
  box-sizing: border-box;
  @extend %f-extra-small;
  color: $color-text-primary;
}

.verify-name-input,
.verify-lawyer-firm-input {
  width: 391px;
  padding-right: 15px;
  color: $color-text-primary;

  &::-webkit-input-placeholder,
  &::-moz-placeholder,
  &:-moz-placeholder,
  &:-ms-input-placeholder {
    color: $color-text-placeholder;
  }
}
</style>
