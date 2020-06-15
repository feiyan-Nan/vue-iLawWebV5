import Vue from 'vue'
import App from './App'
import router from './router'
import plugin from '@/plugin'
import '@/fonts/icon-bass.css'
import '@/plugin/filters'
import '@/mixins'
import '@/vue/ws'
import '@/utils/receiveMessage'
import '@/utils/document'
import postMessage from '@/utils/postMessage'
import analysis from '@/utils/analysis'
import modal from '@/plugin/components/modal'

Vue.use(plugin)
Vue.config.productionTip = false
Vue.prototype.$postMessage = postMessage
Vue.prototype.$analysis = analysis
Vue.prototype.$modal = modal
// window.addEventListener('error', (error) => {
//   let vue = new Vue()
//   vue.$Toast.error(error)
// })

// 点击Vue隐藏angulr中的下拉模态
// window.addEventListener('click', () => {
//   window.parent && window.parent.document.body.click()
// })
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
