/**
 * 数据分析统计
 * 利用神策数据sensors进行分析
 */
const analysis = {
  // sensor对象睡
  instance: null,
  // sensor初始化的方法
  instantiate: function () {
    // 目前暂时是通过从父容器中获取
    this.instance = this.instance || window.parent.window.alpha_sa
  },
  // sensor记录验证主要方法，事件以及options
  track: function (eventName, options) {
    this.instance.track(eventName, this.addPublicProperties(options))
  },
  // 添加公共属性
  addPublicProperties: function (options) {
    let props = options || {}
    if (!props.sys_product_name) {
      props.sys_product_name = 'alpha'
    }
    if (!props.sys_platform) {
      props.sys_platform = 'web'
    }
    return props
  },
  // sensor自动添加路由的pageView
  routeTrack: function (route) {
    this.instance.quick('autoTrack', {
      // 根据路由配置对路径来判断采集的名字
      customTitle: route.name || document.title
    })
  },
  login: function () {
    this.instance.login()
  },
  setProfile: function () {
    this.instance.setProfile()
  },
  quick: function (eventName, options) {
    this.instance.quick(eventName, options)
  }
}
// 初始化神策数据对象
analysis.instantiate()

export default analysis