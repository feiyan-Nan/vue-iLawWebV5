<template lang="pug">
.login_wrap.login_wx-wrap
  .login_login-box
    h1.ibass-alpha
      span Alpha
    p.login_slogan 法律智能操作系统
    .login_button
      ic-button(@click="login") 点击激活 Alpha

  #login_qrbox(:class="{'loginShow': isQRCodeShow}")
    a.login_close(href="javascript:;" @click="closeLoginBox") x
    #login-container.login-qrcode(ref="loginContainer")
</template>

<script>
import loginService from '@/vue/service/login'
import iStorageService from '@/vue/service/iStorage'
import rules from '@/utils/validation/rules'

export default {
  data () {
    return {
      isQRCodeShow: false,
      wxQRcode: {}
    }
  },
  methods: {
    /**
     * 显示隐藏登录二维码弹层
     */
    login () {
      this.isQRCodeShow = true
    },
    closeLoginBox () {
      this.isQRCodeShow = false
    },
    /**
     * 获取 appid 生成登录二维码
     */
    showQRCode () {
      loginService.getQRCode().then((data) => {
        if (data.isSuccess) {
          this.wxQRcode = new WxLogin({
            id: 'login-container',
            appid: data.data.appId,
            scope: data.data.scope,
            redirect_uri: encodeURIComponent(`${window.parent.alphaConfig.redirectUrl}/#/login/wxactivate?linkCode=${this.$route.query.linkcode}&type=${this.$route.query.type}`),
            state: data.data.state,
            style: 'black',
            href: ''
          })
        }
      })
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
        if (res.data.unionId) {
          this.$postMessage.stateGo('login.activateback', {linkCode: params.linkcode, unionId: res.data.unionId, type: params.type})
        }
      }, () => {
        // this.$postMessage.stateGo('login.activate', {linkCode: params.linkcode})
        this.$postMessage.locationSearch({linkCode: params.linkcode})
      })
    },
  },
  mounted () {
    // 清理本地的 token 等信息
    iStorageService.clearStorage()

    if (rules().rightParams.validate(this.$route.query.linkcode, this.$route.query.code, this.$route.query.state)) {
      this.wechatVerifyLink()
    }

    this.showQRCode()
    this.$nextTick(() => {
      document.querySelector('#app').classList.add('full')
    })
  },
  destroyed () {
    document.querySelector('#app').classList.remove('full')
  }
}
</script>

<style lang="scss" scoped>
@import "./assets/css/login.scss";

.login_wx-wrap {
  background: #464C63 url('~@/../static/img/login-background.jpg') no-repeat 50% 100%;
  background-size: cover;
  position: relative;
  margin: 0;
  padding: 0;
  height: 100%;
  min-height: 629px;
  text-align: center;
  width: 100%;
  @extend %f-small;
}

</style>

<style>
#app.full {height: 100%;}
</style>
