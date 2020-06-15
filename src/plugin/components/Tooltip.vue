<template lang="pug">
transition
    .ic__tooltip
        .ic__tooltip-content(v-show="innerVisible" :class="[`ic__tooltip-${theme}`,`ic__tooltip-${position}`]" ref="content" :style="style")
            slot(name="content")
        slot
</template>
<script>
export default {
  name: 'ic-tooltip',
  componentName: 'IcTooltip',
  props: {
    trigger: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'top'
    },
    visible: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: 'icourt'
    },
    theme: {
      type: String,
      default: 'black',
      validator: value => ['white', 'black'].indexOf(value) > -1
    }
  },
  data () {
    return {
      innerVisible: this.visible,
      style: {}
    }
  },
  methods: {
    appendTooltip () {
    //   const rect = this.$slots.default[0].elm.getBoundingClientRect()
    //   this.style.left = `${rect.x}px`
    //   this.style.top = `${rect.y}px`
    },
    removeTooltip () {
    //   document.body.removeChild(this.$refs.content)
    },
    showTooltip (ev) {
      this.innerVisible = true
    },
    hideTooltip () {
      this.innerVisible = false
    },
  },
  mounted () {
    // console.log(this.$slots)
    this.appendTooltip()
    if (this.trigger) {
      this.$slots.default[0].elm.addEventListener(this.trigger, this.showTooltip)
    } else {
      this.$slots.default[0].elm.addEventListener('mouseover', this.showTooltip)
      this.$slots.default[0].elm.addEventListener('mouseleave', this.hideTooltip)
    }
  },
  destroyed () {
    this.removeTooltip()
    if (this.trigger) {
      this.$slots.default[0].elm.removeEventListener(this.trigger, this.showTooltip)
    } else {
      this.$slots.default[0].elm.removeEventListener('mouseover', this.showTooltip)
      this.$slots.default[0].elm.removeEventListener('mouseleave', this.hideTooltip)
    }
  }
}
</script>
<style lang="scss" scoped>
.ic__tooltip{
    position: relative;
}
.ic__tooltip-content{
    left:50%;
    // top:-15px;
    transform: translate(-50%,-100%);
    position: absolute;
    padding:7px 8px;
    @extend %f-extra-small;
    color:$color-white;
    position: absolute;
    &:before{
        content:'';
        border:solid 8px transparent;
    }
}
.ic__tooltip-black{
    background-color: $color-bg-normal;
    box-shadow: 0 4px 9px 0 rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    min-width: 60px;
    &:before{
        border-top: solid 9px $color-bg-normal;
        position: absolute;
        left:50%;
        transform: translate(-50%,-100%)
    }
}
.ic__tooltip-top{
    top:-100%;
    &:before{
        top:100%;
        transform: translate(-50%,0)
    }
}
</style>
