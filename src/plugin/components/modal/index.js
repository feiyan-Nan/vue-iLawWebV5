import Vue from 'vue'
import Modal from './Modal'

let ModalConstruct = Vue.extend(Modal)
let instance
let modal = function (option) {
  Object.keys(option.props || {}).map(item => {
    option.component.props[item].default = typeof option.component.props[item].default === 'function' ? function () { return option.props[item] } : option.props[item]
  })
  instance = new ModalConstruct({
    data: option
  })
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  return instance.vm
}
modal.open = (option = {}) => {
  const instance = modal(option)
  instance.open()
  return instance
}
export default modal