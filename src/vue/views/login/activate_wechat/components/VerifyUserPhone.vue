<template lang="pug">
.login_verify-activate-wrap
  .login_verify-activate-content
    .login_verify-activate-stepone
      .login_verify-activate-title {{ verifyInfo.title }}
      form(name="verifyPhoneForm")

        .login_verify-activate-form
          .phone_filter-zone
            ic-dropdown(:visible="phoneZoneState" @visiableChange="phoneZoneState = !phoneZoneState" name="打开手机区号框_手机认证")
              div
                span {{zoneSelectedAction.val}}
                i.ibass-trig-down
              ic-dropdown-menu(slot="dropdown")
                div.phone_filter-zone-scroll
                  ic-dropdown-item(v-for="(item,index) in phoneZoneList" :key="index" @click="selectZone(item)" :active ="zoneSelectedAction.val===item.val")
                    .phone__dropdown-menu-zone-label
                      span(:class="{'active': zoneSelectedAction.val===item.val}") {{item.name}}

            label.login_verify-activate-label 手机号

          input.login_verify-input(autocomplete="off" type="text" v-model="verifyInfo.phone" name="verifyPhone" @keyup="keyUpCheckValid" :class="{'verify-input-error-color':phoneError}")
          label.login_verify-activate-first-error.label-active(v-show="phoneError") {{ phoneError }}
            i.ibass-warning

    .login_verify-activate-steptwo()
      .login_verify-activate-btns

      .login_verify-activate-form
        label.login_verify-activate-label(:class="{'placeholder': captchaCode == '' && !codeLabel}") 验证码
        input.login_verify-input(type="text" v-model="captchaCode" @focus="inputFocus('codeLabel')" @blur="inputBlur('codeLabel')" @keyup="checkVerifyCode" name="verifyphone_captcha" autocomplete="off" :class="{'verify-input-error-color':captchaCodeError}")
        i.ibass-required

        label.login_verify-activate-error(v-show="captchaCodeError") {{ captchaCodeError }}
            i.ibass-warning
        .login_verify-activate-btns-one
            a.login_verify-btn.btn-step-one(name="获取验证码_手机认证" :class="{'btn-disabled': !canSendCaptcha, 'btn-send-captcha': canSendCaptcha=='again'}" @click="sendCaptchaCode()") {{captchaCodeBtnMsg}}

      .login_verify-activate-btns-one
          a.login_verify-btn.btn-next-step(:class=("{'btn-disabled': !canNext}") name="校验手机验证码_手机认证" @click="nextStep") 下一步

</template>

<script>
import phoneStart from '@/utils/phone_start'
import loginService from '@/vue/service/login'
import loginUtils from '@/utils/login'

const phoneZone = [
  { name: '中国 +86', val: '+86' },
  { name: '中国香港特别行政区 +852', val: '+852' },
  { name: '中国澳门特别行政区 +853', val: '+853' },
  { name: '中国台湾地区 +886', val: '+886' }
]

const timer = 60

export default {
  props: {
    verifyInfo: {
      type: Object
    },
    verifySuccess: {
      type: Function
    },
    loading: {
      type: Function
    }
  },
  data () {
    return {
      phoneError: '',
      captchaCodeError: '',
      captchaCode: '',
      phoneZoneList: phoneStart || phoneZone,
      phoneZoneState: false,
      codeLabel: false,
      canNext: false,
      zoneSelectedAction: {
        name: '中国 +86',
        val: '+86'
      },
      captchaCodeBtnMsg: '获取验证码',
      canSendCaptcha: true,
      timer: timer,
      captchaTimer: false
    }
  },
  methods: {
    /**
     * 区号选择
     */
    selectZone (item) {
      this.zoneSelectedAction = item
    },
    /**
     * 输入框获取焦点、失焦 - 触发 placeholder 动画
     */
    inputFocus (type) {
      this[type] = true
    },
    inputBlur (type) {
      this[type] = false
    },
    /**
     * 手机号格式校验
     */
    checkPhoneReg () {
      this.phoneError = ''

      let regResult = loginUtils.checkPhoneReg(this.verifyInfo.zone, this.verifyInfo.phone)
      if (!regResult[0]) {
        this.phoneError = regResult[1]
      }

      return regResult[0]
    },
    /**
     * 手机号输入框防抖检查
     */
    keyUpCheckValid: _.debounce(function (ev) {
      if (ev.keyCode !== 9) {
        this.checkValid()
      }
    }, 300),
    /**
     * 手机号输入框检查逻辑
     */
    async checkValid () {
      if (!this.checkPhoneReg()) {
        this.canNext = false
        return false
      }

      this.verifyInfo.zone = this.zoneSelectedAction.val.replace('+', '00')

      let res = await loginService.checkPhoneValid(this.verifyInfo)
      let data = res.data || {}
      let codedata = data.data
      // sucess = true可编辑, false已认证, data = 1 != 1
      if (data.sucess && codedata !== '1') {
        this.verifyInfo.phoneSecurityCode = data.data || ''

        this.phoneChange()

        return true
      } else if (data.sucess && codedata === '1') {
        this.phoneError = data.message
        this.canNext = false
        return false
      } else {
        this.phoneError = data.message || '手机号校验失败'
        this.canNext = false
        return false
      }
    },
    /**
     * 手机号码变动重置验证码时间
     */
    phoneChange: function () {
      if (this.captchaTimer) {
        clearInterval(this.captchaTimer)
        this.timer = timer

        this.captchaCodeBtnMsg = '获取验证码'
        this.canSendCaptcha = true
      }
    },
    /**
     * 获取验证码，先校验格式是否正确
     */
    async sendCaptchaCode () {
      if (!this.canSendCaptcha) {
        return false
      }

      if (!this.checkPhoneReg()) {
        return false
      }

      if (this.phoneError) {
        return false
      }

      let resp = await this.checkValid()
      if (!resp) {
        return false
      }

      this.verifyInfo.zone = this.zoneSelectedAction.val.replace('+', '00')

      return loginService.sendCaptcha(this.verifyInfo).then((res) => {
        if (res.isSuccess) {
          this.isStartTime = true
          this.canSendCaptcha = false

          this.captchaTimer = setInterval(() => {
            this.captchaCodeBtnMsg = `${this.timer}s 重新获取`
            this.timer--

            if (this.timer < 0) {
              clearInterval(this.captchaTimer)
              this.canSendCaptcha = 'again'
              this.captchaCodeBtnMsg = '重新获取'
              this.timer = timer
            }
          }, 1000)
        } else {
          this.phoneError = res.resultMsg || '手机号错误'
        }
      })
    },
    /**
     * 输入完后校验验证码
     * @params {Event} event事件句柄
     */
    checkVerifyCode: _.debounce(function (ev) {
      if (ev.keyCode === 9) {
        return false
      }

      if (!this.captchaCode) {
        this.captchaCodeError = '请输入验证码'
        this.canNext = false
        return false
      }
      if (!/^\d{4}$/g.test(this.captchaCode)) {
        this.captchaCodeError = '验证码错误'
        this.canNext = false
        return false
      }

      this.captchaCodeError = ''
      this.canNext = true
    }, 300),
    /**
     * 下一步
     */
    async nextStep () {
      if (this.canNext) {
        this.verifyInfo.captcha = this.captchaCode
        this.verifyInfo.zone = this.zoneSelectedAction.val.replace('+', '00')

        loginService.verifyRegisterPhoneCode(this.verifyInfo).then((res) => {
          if (res.isSuccess) {
            let data = res.data || {}

            if (!data) {
              this.captchaCodeError = res.resultMsg || '验证码错误'
              this.canNext = false
              return false
            }

            this.verifyInfo.securityCode = res.data
            this.canNext = true

            // 验证码校验成功跳转下一步
            this.verifySuccess()
          }
        }, () => {
          this.captchaCodeError = '验证码错误'
          this.canNext = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login_verify {

  &-activate-form{
    width: 401px;
  }

  &-activate-btns {
    height: auto;
  }

  &-activate-error {
    position: absolute;
    left: 188px;
    top: -16px;
    @extend %f-extra-small;
    line-height: 16px;
    color: $dangerous-color;
  }

  &-btn.btn-step-one{
    width: 110px;
    height: 36px;
    float: right;
    margin-top: -3px;
  }

  &-input{
    width: 298px;
    margin-left: 20px;
  }

  &-zone{
    height: 20px;
    line-height: 20px;
    padding: 4px 0 8px;
  }

  // 验证码输入框
  &-activate-steptwo &-input{
    float: left;
    margin-left: 0;
    width: 251px;
    padding-right: 16px;
  }

  &-activate-form{
    .ibass-required {
      color: $dangerous-color;
      display: inline-block;
      @extend %f-extra-small;
      line-height: 20px;
      margin-top: 6px;
      right: 132px;
      position: absolute;
    }
  }

}

// 手机号国际编码下拉
.phone_filter-zone {
  display: inline-block;
  border-bottom: 1px solid $color-bd-input;
  @extend %f-small;
  line-height: 20px;
  width: 80px;
  text-align: left;
  color: $color-text-primary;

  .ic__dropdown{
    padding-bottom: 8px;

  }

  .ic__dropdown__menu {
    width: 240px;
  }

  .phone__dropdown-menu-zone-label{
    text-align: left;
      height: 36px;
      line-height: 36px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      box-sizing: border-box;
      position: relative;
      padding: 0 1.7rem 0 0.875rem;

      span {
        @extend %f-small;
      }

      &:hover {
        background: $color-bg-light;
      }
  }

  .phone_filter-zone-scroll{
    height: 200px;
    margin: 15px 0;
    overflow: auto;
  }

  .ibass-trig-down{
    float: right;
    color: $color-icon-light;
    margin-top: 2px;
  }

  .ic__dropdown__item__active {
    background: $color-bg-light;
  }
}

.btn-send-captcha{
  border: 1px solid #e8e8e8;
  box-sizing: border-box;
  background: #fff;
  color: $color-text-primary;
}

</style>

<style lang="scss">
.phone_filter-zone {
  .ic__dropwdown-solt{
    padding: 0;
    width: 100%;
    margin: -10px 0;
  }
}
</style>
