<template lang="pug">
.activate_container(v-ic-loading="loading")
  div(class="login-testCode login-testCode-dcw")
    .dcw-title-login
      .wxloginback-line
      span.wxloginback-title {{step.stepTitle}}

    div(v-show="curStep==1")
      verify-user-phone(:verify-info="verify" :verify-success="phoneSuccessSubmit" :loading="isLoading")

    div(v-show="curStep==2")
      verify-user-info(:verify-info="verify" :prev-step="prevStep" :verify-success="infoSuccessSubmit" :loading="isLoading")

    div.activate_step-three(v-show="curStep==3")
      span.login_verify-phone-icon.activate_icon-step-three
        i.ibass-done
      span.login_verify-phone-done 账号激活成功
      .login_success-btn(@click="complate") {{complateBtnText}}
</template>

<script>
import verifyUserPhone from './components/VerifyUserPhone'
import verifyUserInfo from './components/VerifyUserInfo'
import loginService from '@/vue/service/login'

export default {
  components: {verifyUserPhone, verifyUserInfo},
  data () {
    return {
      step: {
        stepTitle: '激活账号'
      },
      curStep: 1,
      userName: '',
      authCode: '',
      verify: {
        code: '',
        state: '',
        phone: '',
        zone: '',
        userInfo: {},
        name: '',
        officeName: '',
        unionId: '',
        userId: '',
        captcha: '',
        linkcode: '',
        securityCode: '',
        phoneSecurityCode: ''
      },
      complateBtnText: '开始使用 Alpha',
      loading: false,
      loginRes: {}
    }
  },
  methods: {
    /**
     * 提供组件调用 loading
     */
    isLoading (isLoading) {
      this.loading = isLoading
    },
    /**
     * 手机信息完成-下一步
     */
    phoneSuccessSubmit () {
      this.curStep = 2
    },
    /**
     * 用户信息完成-下一步
     * 记录激活返回信息，用于后面登录
     */
    infoSuccessSubmit (isSuccess, loginRes) {
      this.loading = false

      if (isSuccess) {
        this.curStep = 3
        this.loginRes = loginRes
      } else {
        this.loginRes = false
      }
    },
    /**
     * 用户信息-上一步
     */
    prevStep () {
      this.curStep = 1
    },
    /**
     * 校验激活链接 获取 unionId
     * 否则跳回原页面
     */
    wechatVerifyLink () {
      let params = this.$route.query
      this.loading = true

      loginService.wechatVerifyLink(params).then((res) => {
        this.loading = false
        this.verify.unionId = res.data.unionId
      }, () => {
        setTimeout(() => {
          this.$postMessage.stateGo('login.activate', {linkCode: params.linkcode})
        }, 2000)
      })
    },
    /**
     * 激活完成登录
     */
    complate: function () {
      if (this.loginRes) {
        let res = this.loginRes
        loginService.doAfterLogin(res.data)
      }
    }
  },
  mounted () {
    // this.wechatVerifyLink()
    this.verify.userId = this.verify.linkcode = this.$route.query.linkcode
    this.verify.unionId = this.$route.query.unionId
    this.verify.type = this.$route.query.type
  }
}
</script>

<style lang="scss" scoped>
@import "./assets/css/login.scss";

.activate_container {
    background-color: #f8f8f8;
    position: relative;
    margin: 0;
    padding: 10% 0 0;
    height: 100%;
    text-align: center;
    width: 100%;
    min-height: 629px;
    background-size: cover;
}

.activate_icon-step-three {
  display: inline-block;
  height: 38px;

  i{
    font-size: 38px;
    height: 38px;
    color: $color-icon-success;
    display: inline-block;
    line-height: 38px;
  }
}

.login_verify-phone-done {
  display: inline-block;
  line-height: 38px;
  height: 38px;
  vertical-align: top;
  margin-left: 16px;
  @extend %f-small;
}

.activate_step-three {
  margin-top: 83px;
  font-size: 0;
}

.login_success-btn {
  display: block;
  background-color: $theme-color-light;
  margin: 128px auto 0;
  width: 120px;
  height: 36px;
  line-height: 36px;
  border-radius: 20px;
  color: $color-white;
  @extend %f-extra-small;
  cursor: pointer;
  text-align: center;
}

</style>

<style lang="scss">

.login_verify {
  &-activate {

    &-first-error {
      position: absolute;
      right: 0;
      top: -16px;
      @extend %f-extra-small;
      line-height: 14px;
      color: $dangerous-color;
      .ibass-warning {
        margin-left: 8px;
        @extend %f-extra-small;
        color: $dangerous-color;
        vertical-align: middle;
      }
    }
    &-wrap {
      text-align: center;
      .loading {
        padding-top: 0;
        top: -30px !important;
      }

      .btn-next-step {
        margin-top: 48px;
      }
    }
    &-title {
      margin-top: -5px;
      margin-bottom: 48px;
      @extend %f-small;
      color: $color-text-light;
      line-height: 16px;
    }
    &-content {
      position: relative;
      color: $color-text-light;
    }
    &-form {
      position: relative;

      margin: 0 auto 43px;
      height: 36px;
      .ns-popover-item.active {
        background-color: $color-bg-light;
      }

      .ibass-required {
          float: right;
          color: $dangerous-color;
          display: inline-block;
          @extend %f-extra-small;
          line-height: 20px;
          margin-top: -28px;
          position: relative;
      }
    }
    &-label {
      position: absolute;
      top: -16px;
      left: 0;
      font-size: 12px;
      line-height: 16px;
      color: $color-text-placeholder;
      transition: all 0.3s linear 0s;

      &.placeholder {
        display: block;
        top: 7px;
        @extend %f-small;
      }
    }
    &-desc {
      margin-top: 20px;
      line-height: 1;
      @extend %f-small;
      color: $color-text-placeholder;
    }
    &-input {
      width: 340px;
      height: 40px;
      line-height: 40px;
      border-radius: 5px;
      // border: 1px solid #d4d4d4;
      text-align: center;
      color: $color-text-primary;
    }
    &-line {
      width: 340px;
      margin: 20px auto 0;
      text-align: left;
      line-height: 1;
      overflow: hidden;
      .login_verify-count-wrap {
        float: right;
      }
    }
    &-stepthree {
      margin-top: 70px;
      text-align: center;
    }
    &-icon {
      .ibass-done {
        font-size: 38px;
        color: $color-icon-success;
        vertical-align: middle;
      }
    }
    &-done {
      position: relative;
      top: -4px;
      margin-left: 6px;
      @extend %f-small;
      color: $color-text-primary;
    }
    &-btns {
      width: 340px;

      margin: 0 auto;
      text-align: left;
      line-height: 1;
      overflow: hidden;
      .ibass-refresh {
        @extend %f-normal;
        color: $theme-color-light;
        vertical-align: middle;
      }
    }
    &-error {
      @extend %f-extra-small;
      color: $dangerous-color;
      .ibass-warning {
        margin-left: 8px;
        @extend %f-extra-small;
        color: $dangerous-color;
        vertical-align: middle;
      }
    }
    &-link {
      @extend %f-small;
      margin-left: 6px;
      cursor: pointer;
    }
  }
  &-text {
    @extend %f-small;
    color: $color-text-light;
  }
  &-btns-one {
    margin-top: 46px;
    text-align: center;
    &:first-child {
      margin-left: 0;
    }
  }
  &-btn {
    display: inline-block;
    background-color: $theme-color-light;
    margin: 0 10px;
    width: 120px;
    height: 36px;
    line-height: 36px;
    border-radius: 20px;
    color: $color-white;
    @extend %f-extra-small;
    cursor: pointer;
    text-align: center;

    &.btn-disabled{
      background: $color-bg-light;
      color: $color-text-placeholder;
      cursor: not-allowed;
    }
  }
  &-input {

    height: 20px;
    @extend %f-small;
    line-height: 20px;
    border: 1px solid $color-bd-input;
    border-width: 0 0 1px;
    outline: none;
    vertical-align: bottom;
    color: $color-text-primary;
    padding: 4px 0 8px;
    &.verify-input-error-color {
      border-color: $dangerous-color;
    }
  }
  &-zone {
    position: relative;
    display: inline-block;
    width: 80px;
    border-bottom: 1px solid $color-bd-input;
    color: $color-text-primary;
    text-align: left;
    @extend %f-small;
    cursor: pointer;

    .ibass-trig-down {
      position: absolute;
      top: 0;
      right: 10px;
      color: $color-icon-light;
    }
  }
}
</style>
