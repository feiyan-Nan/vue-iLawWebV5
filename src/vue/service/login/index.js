import qs from 'qs'
import $postMessage from '@/utils/postMessage'
import IlawService from '@/vue/service/ilaw'
import iStorageService from '@/vue/service/iStorage'
import yx from '@/vue/ws'

export default{
  /*
  * 获取微信登录的appid相关信息
  */
  getQRCode () {
    let url = '/user/api/v1/login/wechat/info'
    return request.get(url, {})
  },
  /**
   * 获取手机验证码
   * @param {Object} params 参数
   */
  sendCaptcha: function ({linkcode = '', phone = '', zone = '', phoneSecurityCode = ''}) {
    const url = '/user/api/v1/certification/register/phone/sendCaptcha'
    return request.post(url, qs.stringify({'linkCode': linkcode, 'phone': phone, 'zone': zone, 'securityCode': phoneSecurityCode}))
  },
  /**
   * 校验手机有效性
   * @param {Object} param 参数
   */
  checkPhoneValid: function ({userId = '', phone = '', zone = ''}) {
    return request.get('/user/api/v1/certification/verify/phone', {'userId': userId, 'phone': phone, 'zone': zone})
  },
  /**
   * 新用户注册,校验短信验证码
   * @param {Object} params 参数
   */
  verifyRegisterPhoneCode: function ({linkcode = '', phone = '', zone = '', phoneSecurityCode = '', captcha = '', unionId = ''}) {
    const url = '/user/api/v1/certification/register/phone/verifyCaptcha'
    return request.post(url, qs.stringify({'linkCode': linkcode, 'phone': phone, 'zone': zone, 'securityCode': phoneSecurityCode, 'captcha': captcha, 'unionId': unionId}))
  },
  /**
   *  校验激活链接 获取用户 unionId
   * @param {Object} 微信登录 code state 激活 linkcode
   */
  wechatVerifyLink: function ({code = '', state = '', linkcode = ''}) {
    const url = '/user/api/v1/login/wechat/verify/link'
    return request.post(url, { 'code': code, 'state': state, 'verifyCode': linkcode })
  },
  /**
   *  新用户注册
   * @param {Object} params 参数
   */
  register: function ({name, linkcode, phone, zone, unionId, securityCode, captcha, officeName}) {
    let params = {name, linkCode: linkcode, phone, zone, unionId, securityCode, captcha, officeName}
    const url = '/user/api/v1/certification/register/account'
    return request.post(url, qs.stringify(params))
  },
  /**
   *  激活结果处理
   *  根据激活返回信息 设置token 登录
   * @param {Object} loginResult 激活返回信息
   */
  doAfterLogin: function (loginResult) {
    Object.assign(loginResult.userDTO, loginResult.jwtTokenDTO)
    let isSameUser = window.localStorage.userid === loginResult.userDTO.id
    this.toPageAfterLogin(isSameUser)
    this.setSession(loginResult.userDTO)
    IlawService.getToken()
    IlawService.getShareToken()
    IlawService.getDefaultLibrary()
    IlawService.getOfficeAdmin()
    // 将用户信息发送给云客服系统

    $postMessage.sendUserInfo(loginResult.userDTO)
    $postMessage.setIsRefresh(isSameUser)
  },
  /**
   *  登录后跳转页面
   * @param {boolean}} isSameUser 当前登录用户和之前登录用户是否一致
   */
  toPageAfterLogin: function (isSameUser) {
    let state = this.getHomePage() // 获取登录后的home地址
    let param = {}
    let cacheRouter = this.getCacheRouter()
    if (cacheRouter) {
      param = this.getCacheRouter().params
      if (isSameUser || isSameUser === undefined) {
        let name = this.getCacheRouter().state.name
        if (name && !name.startsWith('login.')) {
          state = name
        }
      }
    }
    $postMessage.stateGo(state, param, { reload: true })
  },
  /**
   *  获取登录后的home地址
   */
  getHomePage: function () {
    return 'app.my.task'
  },
  getCacheRouter: function () {
    let historyUrl = window.localStorage.getItem('historyUrl') || null

    if (historyUrl && JSON.parse(historyUrl).state.name.indexOf('app.auth') > -1) {
      $postMessage.stateGo('app.my.task')
    } else {
      return JSON.parse(historyUrl)
    }
  },
  /**
   *  设置 session
   * @param {Object}} 激活或登录信息中返回的 session 信息
   */
  setSession (sessionInfo) {
    // 判断当前用户与上一用户是否为同一用户
    if (window.localStorage.userid !== sessionInfo.id) {
      iStorageService.clearStorage()
    }
    window.localStorage.loginusername = sessionInfo.name
    window.localStorage.officeid = sessionInfo.officeId
    window.localStorage.officename = sessionInfo.officename

    window.localStorage.name = sessionInfo.name
    window.localStorage.userid = sessionInfo.id
    window.localStorage.photo = sessionInfo.avatar
    if (sessionInfo.avatar !== '') {
      window.localStorage.pic = sessionInfo.avatar
      window.localStorage.name = sessionInfo.name
    }
    // 记录律所id的cookie失效时间：50年后。以「秒」为单位。该cookie用于在在web服务器上区分用户从而提供不同的资源文件
    let maxAge = 1576800000
    document.cookie = 'officeId=' + sessionInfo.officeId + ';max-age=' + maxAge

    this.storageToken(sessionInfo)
    this.setProjectTemplateReopId()
    // 神策标识用户
    // https://www.sensorsdata.cn/manual/js_sdk.html 利用userId标识用户
    window.parent.alpha_sa.login(sessionInfo.id)
    window.parent.alpha_sa.setProfile({
      email: sessionInfo.email,
      phone: sessionInfo.phone,
      name: sessionInfo.name,
      officename: sessionInfo.officename
    })

    // 建立云信链接
    // iSetupNimService.setupNimLink()
    yx.instantiate()

    // 登录成功后，显示聊天入口
    if (window.parent._showChatBubble) {
      window.parent._showChatBubble()
    }
  },
  setProjectTemplateReopId: function () {
    request.get('/ilaw/api/v2/templates/document/repo', { type: 1 }).then(function (data) {
      // 设置律所模板的repoid
      localStorage.protplfirmrepoid = data.data.repoId
      localStorage.protplfirmtoken = data.data.token
    })
    request.get('/ilaw/api/v2/templates/document/repo', { type: 2 }).then(function (data) {
      // 设置共享模板的repoid
      localStorage.protplpublicrepoid = data.data.repoId
      localStorage.protplpublictoken = data.data.token
    })
  },
  storageToken: function (data) {
    let forwardTime = (data.expireTime - data.startTime) / 2
    // token刷新时间，提前token有效时长的一半时长刷新，把本地时间跟服务器时间的误差计算在内
    window.localStorage.tokenExpireTime = data.expireTime - data.startTime - forwardTime + new Date().getTime()
    window.localStorage.refreshTokenExpireTime = data.refreshTokenExpireTime - data.refreshTokenStartTime + new Date().getTime()
    window.localStorage.token = data.token
    window.localStorage.refreshToken = data.refreshToken
    this.setCookieToken(data.token, data.refreshToken)
  },
  setCookieToken: function (token, refreshToken) {
    // 失效时间：50年后。以「秒」为单位。
    let maxAge = 1576800000
    document.cookie = 'token=' + (escape(token)) + ';max-age=' + maxAge + ';'
    document.cookie = 'refreshToken=' + (escape(refreshToken)) + ';max-age=' + maxAge + ';'
  }
}
