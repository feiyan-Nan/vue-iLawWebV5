import $postMessage from '@/utils/postMessage'

const APP_KEY = {
  TEST: '27ad390771e244d0f9afb39afaf9a457',
  PRE: 'dd84e11dfdb21ee432baf9b4fb5864dc',
  PROD: 'c8c7a60c918645e80229e500f4c0e58f'
}
export default {
  NIM_APP_KEY: appKey(),
  NIM_APP_KEY_BY_HOST: appKeyByHost()
}

/**
 *  根据部署环境的参数获取appKey
 */
function appKey () {
  switch (process.env) {
    case '"development"':
      return APP_KEY.TEST
    case '"testing"':
      return APP_KEY.TEST
    case '"pre"':
      return APP_KEY.PRE
    case '"production"':
      return APP_KEY.PROD
    default:
      return APP_KEY.TEST
  }
}
/**
 * 根据Host获取appKey
 */
function appKeyByHost () {
  const host = location.host
  let appKey
  if (host.indexOf('pre.alphalawyer.cn') === 0) {
    appKey = APP_KEY.PRE
  } else if (host.indexOf('alphalawyer.cn') === 0) {
    appKey = APP_KEY.PROD
  } else {
    appKey = APP_KEY.TEST
  }
  return appKey
}

// 绑定C健 新建
document.addEventListener('keydown', event => {
  let e = event || window.event
  if (e.ctrlKey || e.metaKey || e.keyCode !== 67) {
    return false
  }
  if (document.activeElement.tagName.toUpperCase() === 'BODY' && window.parent.document.querySelectorAll('.create-task-by-dig').length === 0) {
    $postMessage.createTask()
  }
})