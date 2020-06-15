<template lang="pug">
.calendar__day-view-layer.pointer(:style="{top:`${layerY}px`,height:`${innerTheme==='theme-create'?22:layerH}px`}" ref="layer" v-show="layerH" @click="click" :class="[innerTheme]")
    .ibass-add(v-if="innerTheme==='theme-create'")
    .calendar__day-view-layer__active-label(v-html="label")
</template>
<script>
import Util from '../mixins/index'

/**
 * 日历中的鼠标滑动新建任务组件
 * 给父容器增加draggable属性，支持拖拽，注册开始拖拽、拖拽中、拖拽结束事件
 */
export default {
  mixins: [Util],
  props: {
    iLayerY: {
      type: Number,
      default: 0
    },
    iLayerH: {
      type: Number,
      default: 0
    },
    iLabel: {
      type: String
    },
    theme: {
      type: String,
    }
  },
  data () {
    return {
      layerH: 0,
      layerY: 0,
      label: '',
      startDragging: false,
      innerTheme: ''
    }
  },
  methods: {
    dragStart (ev) {
      this.startDragging = true
      this.innerTheme = 'theme-icourt'
      let __layerY = this.transformDate(ev.layerY)
      this.layerH = 0
      this.layerY = __layerY
      this.originY = __layerY
      ev.dataTransfer.setDragImage(document.querySelector('#dragImage'), 0, 0)
    },
    dragHandler (ev) {
      if (ev.screenX === 0 && ev.screenY === 0) return
      let __layerY = this.transformDate(ev.layerY)
      this.layerH = Math.abs(__layerY - this.originY)
      this.layerY = __layerY < this.originY ? __layerY : this.originY
      this._updateScrollView(this.layerY, this.layerH)
      this.setAreaLabel()
      ev.preventDefault()
    },
    dragEnd (ev) {
      const params = {
        startTime: this.layerY,
        height: this.layerH,
      }
      if (this.layerH === 0 || !this.startDragging) return
      this.$analysis.track('TaskActionsSupplement', {
        action_type: 'create_task_by_drag'
      })
      this.startDragging = false
      this.$emit('dragEnd', params)
    },
    // 显示选中区域的时间范围
    setAreaLabel () {
      let originDate = moment().startOf('day')
      const label = `${originDate.add(this.layerY, 'minute').format('HH:mm')}-${originDate.add(this.layerH, 'minute').format('HH:mm')}`
      this.label = this.layerH === 30 ? label : label + ` <br/> 新建任务`
    },
    // 拖拽区域的增减最小单位为30分钟
    transformDate (y) {
      y = Math.min(y, 24 * 60)
      y = Math.max(0, y)
      return Math.floor(y / 30) * 30
    },
    click (event) {
      event.stopPropagation()
      this.$emit('click', event)
    },
    addEventListener () {
      // 此处未兼容日视图边缘也能拖动新建任务
      this.parentNode = this.$refs.layer.parentNode.parentNode.parentNode
      this.parentNode.setAttribute('draggable', true)
      this.parentNode.addEventListener('dragstart', this.dragStart)
      this.parentNode.addEventListener('drag', this.dragHandler)
      this.parentNode.addEventListener('dragend', this.dragEnd)
    },
    removeEventListener () {
      this.parentNode.setAttribute('draggable', false)
      this.parentNode.removeEventListener('dragstart', this.dragStart)
      this.parentNode.removeEventListener('drag', this.dragHandler)
      this.parentNode.removeEventListener('dragend', this.dragEnd)
    }
  },
  watch: {
    iLayerH (newValue, oldValue) {
      this.label = this.iLabel
      this.layerY = this.iLayerY
      this.layerH = Math.max(newValue, 0)
    },
    iLayerY (newer, older) {
      this.label = this.iLabel
      this.layerY = newer
      this.layerH = this.iLayerH
    },
    theme (after, before) {
      this.innerTheme = after || 'theme-icourt'
    },
    '$store.state.calendar.dragDropStatus': {
      handler: function (after, before) {
        this.layerH = 0
      },
      deep: true
    }
  },
  mounted () {
    this.addEventListener()
    this.scrollParent = this._getScrollParent(this.$refs.layer)
  },
  beforeDestroy () {
    this.removeEventListener()
  }
}
</script>
<style lang="scss" scoped>
.calendar__day-view-layer{
  z-index: 30;
  @include flex(row,center,center);
  position: absolute;
  width:100%;
  left: 0;
  &.theme-create{
    left:5px;
    width: calc(100% - 18px);
    border-radius: 6px;
    background-color: $color-white;
    border: solid 4px rgba(6, 6, 6, 0.2);
    .calendar__day-view-layer__active-label{
      color: $color-text-primary;
    }
    [class*=ibass-]{
      line-height: 10px;
      color: $color-text-regular
    }
  }
  &.theme-icourt{
    @include flex();
    background-color: $theme-color-light;
    opacity: .8;
    @extend %f-half;
    .calendar__day-view-layer__active-label{
      padding-left: 10px;
    }
  }

  .calendar__day-view-layer__active-label {
    width: 100%;
    color: $color-white;
    @extend %f-small;
  }
  [class*=ibass-]{
    @extend %f-mini;
    margin-right: 2px;
  }

}

</style>
