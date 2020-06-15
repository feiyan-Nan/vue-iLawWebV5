/**
 * create by liuhao
 * date 2018-04-12
 * 对象工具类，提供基本的对象方法
 */
const objUtil = {
  // 判断对象是否为空
  isEmpty (data) {
    return data === undefined || data === null || String(data).trim() === ''
  },
  // 获取浏览器类型？
  getBrowser () {
    if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) { // Opera 8.0+
      return 'Opera'
    } else if (typeof InstallTrigger !== 'undefined') { // Firefox 1.0+
      return 'Firefox'
    } else if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) { // At least Safari 3+: "[object HTMLElementConstructor]"
      return 'Safari'
    } else if (document.documentMode) { // Internet Explorer 6-11
      return 'Internet explorer'
    } else if (window.StyleMedia) { // Edge 20+
      return 'Edge'
    } else if (!!window.chrome && !!window.chrome.webstore) { // Chrome 1+
      return 'Chrome'
    }
  },
  // 自动构建query参数
  buildQuery (params) {
    let queryStr = ''
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        queryStr += `${key}=${encodeURIComponent(params[key])}&`
      }
    }
    queryStr = queryStr.substring(0, queryStr.length - 1)
    return queryStr
  }
}

export default objUtil