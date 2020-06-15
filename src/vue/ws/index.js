/**
 * 云信消息通知解析相关内容
 */
import store from '@/store'
import config from '@/config'
import ImService from '@/vue/service/im'

let LAST_YX_TIME_KEY = 'LAST_YX_MSG_TIME'
let ls = db.ls
let timer = null
let yx = {
  // 云信的实例对象
  instance: null,
  cb: {
    onConnect (data) {
      // store.commit('yxConnected')
      yx.instance.getLocalSessions({
        limit: 100,
        /* eslint handle-callback-err: "error" */
        done: function (error, obj) {
        //   console.log(error)
          // if (error === undefined) {
          //     store.commit('sessionUpdate', obj.sessions)
          // }
        }
      })
    },
    onWillReconnect: function (data) {
      // store.commit('yxConnecting')
    },
    onDisconnect: function (data) {
      // store.commit('yxDisconnected')
      if (!timer) {
        timer = setTimeout(function () {
          yx.instantiate()
          timer = null
        }, 3000)
      }
    },
    onError: function (data) {
      if (!timer) {
        timer = setTimeout(function () {
          yx.instantiate()
          timer = null
        }, 3000)
      }
    },
    onSessions: function (sessions) {
      // store.commit('sessionUpdate', sessions)
      // store.commit('stickListUpdate')
    },
    onUpdateSession: function (session) {
      // store.commit('sessionUpdate', [session])
      // store.commit('shouldUpdateUnreadCount')
    },
    onMsg: function (msg) {
    //   console.log('YX-ONMSG', msg)
      ls.set(LAST_YX_TIME_KEY, new Date().getTime())
      // 如果没有登录，不收消息
      if (!ls.get('token')) {
        return
      }
      switch (msg.type) {
        case 'notification':
          handleNotification(msg)
          break
        case 'custom':
          handleCustom(msg)
          break
        default:
        //   console.log('YX-Default', msg)
      }
    }
  },
  // 云信实例化过程
  instantiate () {
    ImService.getMe().then(res => {
      // 根据当前的host来判断不同的key
      this.instance = instantiate(config.NIM_APP_KEY_BY_HOST, res.data.accid, res.data.token, this.cb)
    })
  }
}

function handleNotification (msg) {
//   console.log('YX-NOTIFICATION', msg)
}

function handleCustom (msg) {
  // 当没有发现信息返回的时候，可能需要直接抛出全局异常
  if (!msg.content) {
    throw new Error('NIM通知获取异常')
  }
  // 获取云信消息主体
  let content = JSON.parse(msg.content)
  // 更新store信息
  store.dispatch(`${content.object}.${content.type}`, content)
}

// 实例化一个云信的对象
function instantiate (appKey, accid, token, cb) {
  // console.log('NIM_INSTANCE', appKey, accid, token)
  return NimSDK.NIM.getInstance({
    syncSessionUnread: true,
    appKey: appKey,
    // account: store.state.user.accid,
    // token: store.state.user.token,
    account: accid,
    token: token,
    autoMarkRead: false,
    onconnect: cb.onConnect,
    onwillreconnect: cb.onWillReconnect,
    ondisconnect: cb.onDisconnect,
    onsessions: cb.onSessions,
    onupdatesession: cb.onUpdateSession,
    onerror: cb.onError,
    onmsg: cb.onMsg
  })
}

// 影响激活页面暂时注释
// yx.instantiate()

export default yx