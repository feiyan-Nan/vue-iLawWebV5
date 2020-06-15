<template lang="pug">
    .ic-draggable(:id="id" :draggable="draggable" @dragstart="handleDragStart" @drag="handleDrag" @dragend="handleDragEnd")
        slot
</template>

<script>
export default {
  name: 'ic-draggable',
  props: {
    draggable: {
      type: Boolean,
      default: true
    },
    allowEvent: {
      type: String,
      default: 'move'
    }
  },
  computed: {
    id () {
      return `dragable-${Math.floor(Math.random() * 10000)}`
    }
  },
  methods: {
    handleDragStart (ev) {
      // 拖拽开始对时候，将当前元素自身作为拖拽
      ev.dataTransfer.setData('text', this.id)
      // 由于默认都是使用移动对方式，所以所以设置allowEffect为move
      ev.dataTransfer.allowEvent = this.allowEvent
      this.$emit('dragstart')
    },
    handleDrag (ev) {
      this.$emit('drag')
    },
    handleDragEnd (ev) {
      this.$emit('dragend')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>