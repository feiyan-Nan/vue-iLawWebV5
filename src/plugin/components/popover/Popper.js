export default {
  created: function () {
  },
  methods: {
    getScrollParent: function (element) {
      let parent = element.parentNode
      if (!parent) {
        return element
      }

      if (parent === window.document) {
        if (window.document.body.scrollTop || window.document.body.scrollLeft) {
          return window.document.body
        } else {
          return window.document.documentElement
        }
      }

      // Firefox want us to check `-x` and `-y` variations as well
      if (
        ['scroll', 'auto'].indexOf(this.getStyleComputedProperty(parent, 'overflow')) !== -1 ||
            ['scroll', 'auto'].indexOf(this.getStyleComputedProperty(parent, 'overflow-x')) !== -1 ||
            ['scroll', 'auto'].indexOf(this.getStyleComputedProperty(parent, 'overflow-y')) !== -1
      ) {
        return parent
      }
      return this.getScrollParent(element.parentNode)
    },
    getStyleComputedProperty: function (element, property) {
      let css = window.getComputedStyle(element, null)
      return css[property]
    },
  },
  mounted () {
    this.scrollDom = this.getScrollParent(this.$refs.content)
    this.scrollDom.addEventListener('scroll', this.scrollListener)
    // this.scrollDom = document.body
  },

  beforeDestroy () {
    this.scrollDom.removeEventListener('scroll', this.scrollListener(event))
  }
}