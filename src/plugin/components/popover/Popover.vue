<template lang="pug">
.ic__popover(ref="popover" v-if="hover" @mouseenter="show" @mouseleave="hide")
    transition(name="fade")
        .ic__popover-content(ref="content" v-show="visible"  :style="style" :class="[`ic__popover-content__theme-${theme}`,`ic__popover-content__position-${innerPosition}`, hasTriangle]" )
            div.wrap(v-if="visible" )
                slot
    .ic__popover-trigger.pointer(@dblclick="dbClick")
        slot(name="trigger")
.ic__popover(ref="popover" v-else v-clickoutside='close')
    transition(name="fade")
        .ic__popover-content(ref="content" v-show="visible"  :style="style" :class="[`ic__popover-content__theme-${theme}`,`ic__popover-content__position-${innerPosition}`, hasTriangle]" )
            div.wrap(v-if="visible" )
                slot
    .ic__popover-trigger.pointer(@click="toggleVisible" @dblclick="dbClick")
        slot(name="trigger")
</template>
<script>
import clickoutside from '../../directives/clickoutside'
import Popper from './Popper'
export default {
  name: 'IcPopover',
  componentName: 'IcPopover',
  directives: {
    clickoutside
  },
  mixins: [Popper],
  props: {
    hover: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: 'right',
      // no表示不要箭头
      validator: value => ['bottom', 'top', 'left', 'right', 'no'].indexOf(value) > -1
    },
    theme: {
      type: String,
      default: 'white',
      validator: value => ['white', 'black'].indexOf(value) > -1
    },
    // 是否根据鼠标位置定位
    mouseRealtive: {
      type: Boolean,
      default: true,
    },
    triangle: {
      type: Boolean,
      default: true,
    },
    value: {
      type: Boolean,
      default: false
    },
    // html是否可滚动
    scrollable: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    positionX: {
      type: Number,
      default: 0
    },
    positionY: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      visible: this.value,
      style: {},
      ev: {},
      size: {},
      innerPosition: this.position,
    }
  },
  computed: {
    hasTriangle () {
      return this.triangle ? '' : 'ic__popover_no-trangle'
    }
  },
  mounted () {
    document.addEventListener('dragstart', (event) => { this.visible = false })
  },
  methods: {
    show (_ev) {
      this.ev = _ev
      this.visible = true
      this.$nextTick(() => {
        this.size.width = this.size.width || this.$slots.default[0].elm.getBoundingClientRect().width
        this.size.height = this.size.height || this.$slots.default[0].elm.getBoundingClientRect().height
        this.setStyle()
      })
    },
    hide (_ev) {
      this.ev = _ev
      this.visible = false
      this.$nextTick(() => {
        this.size.width = this.size.width || this.$slots.default[0].elm.getBoundingClientRect().width
        this.size.height = this.size.height || this.$slots.default[0].elm.getBoundingClientRect().height
      })
    },
    toggleVisible (_ev) {
      // 先让在main.js中window.parent的click方法先执行，然后再调用，
      // setTimeout(() => {
      //   this.ev = _ev
      //   this.visible = !this.visible
      //   this.$emit('afterChangeVisible', { type: 'toggle', visible: this.visible })
      //   this.$nextTick(() => {
      //     this.size.width = this.size.width || this.$slots.default[0].elm.getBoundingClientRect().width
      //     this.size.height = this.size.height || this.$slots.default[0].elm.getBoundingClientRect().height
      //     this.visible && this.setStyle()
      //   })
      // }, 0)
      this.ev = _ev
      this.visible = !this.visible
      this.$emit('afterChangeVisible', { type: 'toggle', visible: this.visible })
      this.$nextTick(() => {
        this.size.width = this.size.width || this.$slots.default[0].elm.getBoundingClientRect().width
        this.size.height = this.size.height || this.$slots.default[0].elm.getBoundingClientRect().height
        this.visible && this.setStyle()
      })
    },
    dbClick (event) {
      // clearTimeout(this.clickFlag)
      this.$emit('dbClick', event)
    },
    setStyle () {
      const docWidth = document.documentElement.clientWidth
      this.innerPosition = this.position
      if (this.mouseRealtive && this.appendToBody) {
        let left = 0
        let top = 0
        if (this.innerPosition === 'right') {
          this.innerPosition = (docWidth < this.ev.clientX + this.size.width + 10) ? 'left' : this.innerPosition
          left = this.innerPosition !== 'right' ? (this.ev.clientX - this.size.width - 14) : (this.ev.clientX + 14)
          left += 5
          top = this.ev.pageY - this.size.height / 2
        }
        if (this.innerPosition === 'left') {
          left = (this.ev.clientX < this.size.width + 15) ? (this.ev.clientX + 15) : (this.ev.clientX - this.size.width - 15)
          left += 5
          top = this.ev.pageY - this.size.height / 2
        }
        if (this.innerPosition === 'bottom') {
          const rect = this.$slots.trigger[0].elm.getBoundingClientRect()
          left = rect.left - this.size.width / 2 + rect.width / 2
          top = rect.top + rect.height + 10
        }
        if (this.innerPosition === 'top') {
          const rect = this.$slots.trigger[0].elm.getBoundingClientRect()
          left = rect.left - this.size.width / 2 + rect.width / 2
          top = rect.top - this.size.height - 10
        }
        this.style = {left: `${left + window.scrollX}px`, top: `${top + window.scrollY}px`}
      } else {
        this.style = {left: `${this.positionX}px`, top: `${this.positionY}px`}
      }
    },
    close (event) {
      if ((!this.visible) || (this.$refs.content && this.$refs.content.contains(event.target))) return
      this.visible = false
      this.$emit('afterChangeVisible', { type: 'close', visible: this.visible })
    },
    scrollListener (event) {
    },
  },
  beforeDestroy () {
    Array.prototype.some.call(document.body.children, node => node === this.$refs.content) && document.body.removeChild(this.$refs.content)
  },
  watch: {
    visible (after, befor) {
      if (after) {
        if (this.appendToBody) {
          document.body.appendChild(this.$refs.content)
        }
        this.$slots.trigger[0].elm && this.$slots.trigger[0].elm.classList.add('triggered')
      } else {
        setTimeout(() => {
          if (this.appendToBody) {
            document.body.removeChild(this.$refs.content)
          }
          this.$slots.trigger[0].elm && this.$slots.trigger[0].elm.classList.remove('triggered')
        }, 0)
      }
      // 弹窗出现时禁止滚动页面
      if (!this.scrollable) {
        this.scrollDom.style['overflow-y'] = this.visible ? 'hidden' : 'auto'
      }
      this.$emit('input', after)
    },
    value (after, before) {
      setTimeout(() => {
        this.visible = after
      }, 0)
    },
    positionX () {
      this.setStyle()
    },
    positionY () {
      this.setStyle()
    }
  }
}
</script>
<style lang="scss" scoped>
@mixin position($top:0, $left:0, $translateX:0,$translateY:0){
    top:$top;
    left:$left;
    transform: translate($translateX,$translateY)
}
@mixin _position($direction){
  .wrap:before, .wrap::after{
    @if $direction == 'right'{
      @include position(50%,0,-100%,-50%);
    }
    @if $direction == 'left'{
      @include position(50%,100%,0,-50%);
    }
    @if $direction == 'bottom'{
      @include position(0,50%,-50%,-100%);
    }
    @if $direction == 'top'{
      @include position(100%,50%,-50%,0);
    }
  }
  .wrap:before{
    border-#{direction}-width: 13px;
  }
  .wrap::after {
    border-#{direction}-width: 12px;
  }

}
@mixin _borderColor($direction){
    .wrap:before {
        border-#{$direction}-color: $color-bd-extra-light;
    };
    .wrap::after{
        border-#{$direction}-color: $color-white;
    }
}
.ic__popover{
    position: relative;
    height: 100%;
    width: 100%;

}
.ic__popover-content{
    position: absolute;
    z-index: 2001;
    border-radius: 10px;
    color: $color-text-primary;
    &.rect{
      border-radius: 2px;
    }
    .wrap:before {
        content: '';
        position:absolute;
        border: solid 12px transparent;
        pointer-events: none;
    };
    .wrap::after {
        content: '';
        position: absolute;
        border: solid 11px transparent;
        pointer-events: none;
    }
}
.ic__popover-trigger{
     height: 100%;
     width: 100%;
 }
@mixin ic__popover-content__theme() {
  border: solid 1px $color-bd-extra-light;
  box-shadow: 0 4px 9px 0 rgba(0, 0, 0, 0.1);
  &.ic__popover-content__position-right{
      @include _borderColor('right')
  }
  &.ic__popover-content__position-left{
      @include _borderColor('left')
  }
  &.ic__popover-content__position-bottom{
      @include _borderColor('bottom')
  }
  &.ic__popover-content__position-top{
      @include _borderColor('top')
  }
  &.ic__popover_no-trangle{
    .wrap:before {
      border: none;
    }
    .wrap::after{
      border: none;
    }
  }
}
.ic__popover-content__theme-black{
  @include ic__popover-content__theme;
  background-color: $color-bg-normal;
}
.ic__popover-content__theme-white{
  @include ic__popover-content__theme;
    background-color: $color-white;
 }
 .ic__popover-content__position-right{
    @include _position('right')
 }
 .ic__popover-content__position-left{
   @include _position('left')
 }
 .ic__popover-content__position-bottom{
  @include _position('bottom')
 }
 .ic__popover-content__position-top{
  @include _position('top')
 }
.fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>
