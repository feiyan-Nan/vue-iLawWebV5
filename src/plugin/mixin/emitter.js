/**
 * 从el-element抄过来的事件总线机制，会向上查找伏组件绑定的方法
 * 需要给组件增加coponentName来进行处理，我想没有直接使用name的原因在于部分情况下希望name和compoenntName不一致吧
 */

function broadcast (componentName, eventName, params) {
  this.$children.forEach(child => {
    let name = child.$options.componentName
    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params))
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]))
    }
  })
}
export default {
  methods: {
    dispatch (componentName, eventName, params) {
      let parent = this.$parent || this.$root
      let name = parent.$options.componentName

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent

        if (parent) {
          name = parent.$options.componentName
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    },
    broadcast (componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params)
    }
  }
}
