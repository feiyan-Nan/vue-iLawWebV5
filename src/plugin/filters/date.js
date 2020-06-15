import Vue from 'vue'
Vue.filter('formatDate', function (value, format) {
  if (value && format) {
    return moment(value).format(format)
  }
})