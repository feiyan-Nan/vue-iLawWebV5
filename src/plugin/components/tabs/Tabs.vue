<template lang="pug">
    ul.ic-tabs
        slot
        .tabs__slide_bar(ref="slideBar")
</template>

<script>
export default {
  name: 'IcTabs',
  componentName: 'IcTabs',
  props: {
    value: {
      type: String,
    },
  },
  data () {
    return {
      children: []
    }
  },
  watch: {
  },
  methods: {
    __change (name, tabItem, e) {
      this.$emit('change', tabItem, e)
      this.$emit('input', name)
      this.__barSlide(name)
    },
    __barSlide (name, times = 10) {
      const { slideBar } = this.$refs
      const targetEl = this.children.find(item => item.name === name).$el
      const { offsetWidth: width, offsetLeft: left } = targetEl
      slideBar.style.left = left + 'px'
      slideBar.style.width = width + 'px'
    },
    __initChildData (tabItem) {
      this.children.push(tabItem)
    }
  },
  mounted () {
    this.__barSlide(this.value || this.children[0])
  }
}
</script>

<style lang="scss" scoped>
.ic-tabs {
    @include flex(row, flex-start, center);
    position: relative;
    .tabs__slide_bar {
        position: absolute;
        transition: all .3s ease-in-out;
        bottom: 0;
        height: 3px;
        background-color: $theme-color-light;
    }
}
</style>
