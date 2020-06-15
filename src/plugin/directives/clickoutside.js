export default {
  bind: function (el, binding) {
    let documentHandler = function (e) {
      if (el.contains(e.target)) {
        return false
      }

      if (binding.expression) {
        binding.value(e)
      }
    }
    el.__clickOutsideHandler = documentHandler
    document.addEventListener('click', el.__clickOutsideHandler)
    window.parent && window.parent.document.addEventListener('click', el.__clickOutsideHandler)
  },
  unbind: function (el, binding) {
    document.removeEventListener('click', el.__clickOutsideHandler)
    window.parent && window.document.removeEventListener('click', el.__clickOutsideHandler)
    delete el.__clickOutsideHandler
  }
}
