import Vue from 'vue'
Vue.directive('ic-tooltip', {
  bind (el, binding) {
    // el.style.arg = binding.value.arg
    el.style.position = 'relative'
    el.appendChild(`<div class="ic__tooltip ic__tooltip-black"></div`)
  }
})