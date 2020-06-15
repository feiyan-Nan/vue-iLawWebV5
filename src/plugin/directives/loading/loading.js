import Vue from 'vue'
import loadingVue from './loading.vue'

let Loading = Vue.extend(loadingVue)
/**
 * v-ic-loading
 * 指令使用支持boolean值和Promise值
 * modifier参数：fullscreen，是否使用全屏遮罩
 * 支持dataset参数：
 * data-load-text：设置loading提示文本
 * data-load-spinner: loading的icon支持，如果不想显示icon，请传入no
 * data-load-background: loading背景指定
 * data-load-class: 用户自定义class，会加到loading最外层
 * data-load-size: 默认loading的尺寸支持：支持samll/medium/large三种默认格式，默认使用medium模式
 */
Vue.directive('ic-loading', {
  bind: function (el, binding) {
    // 构建遮罩的loading节点
    const loading = new Loading({
      el: document.createElement('div'),
      data: {
        ...initialData(el),
        fullscreen: !!binding.modifiers.fullscreen
      }
    })
    // 绑定初始化对象和元素对象
    el.instance = loading
    el.loading = loading.$el
    // 增加自定义的样式
    if (el.dataset.loadClass) {
      el.loading.className = `${el.loading.className} ${el.dataset.loadClass}`
    }
  },
  inserted: function (el, binding) {
    // 判断修饰符，全屏和非全屏loading添加的位置将有所不同
    if (binding.modifiers.fullscreen) {
      append(document.body, el, binding.value)
    } else {
      // 非全屏模式下，判断对象是否有position属性，如果是static，设置为relative
      const position = window.getComputedStyle(el).position
      if (position === 'static') {
        el.style.position = 'relative'
      }
      append(el, el, binding.value)
    }
  },
  update: function (el, binding) {
    if (binding.modifiers.fullscreen) {
      append(document.body, el, binding.value)
    } else {
      append(el, el, binding.value)
    }
  },
  unbind: function () {

  }
})
// 获取dataset数据
function initialData (el) {
  return {
    text: el.dataset.loadText,
    spinner: el.dataset.loadSpinner || 'default',
    background: el.dataset.loadBackground || '',
    size: el.dataset.loadSize || 'large'
  }
}
// 添加到dom元素
function append (dom, el, val) {
  // 获取loading在dom中的子节点
  let loadDom = Array.prototype.find.call(dom.childNodes, node => node.id === el.loading.id)
  // 只支持Boolean和Promise两种类型
  if (typeof val === 'boolean') {
    if (val && !loadDom) {
      dom.appendChild(el.loading)
    } else if (!val && loadDom) {
      el.removeChild(el.loading)
    }
  } else if (val instanceof Promise) {
    if (!loadDom) {
      dom.appendChild(el.loading)
      val.then(_ => {
        dom.removeChild(el.loading)
      }).catch(e => {
        dom.removeChild(el.loading)
      })
    }
  }
}