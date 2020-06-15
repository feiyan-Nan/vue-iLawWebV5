<template lang="pug">
  .ic-sort(
    :class="{'ic-droppable--hover': isDragover && !isDragging, 'ic-dragging': isDragging}"
    :draggable="draggable"
    @dragstart.stop="onDragStart"
    @drag="onDrag"
    @dragend="onDragEnd"
    @dragover.prevent.stop="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent.stop="onDrop"
  )
    slot
</template>
<script>
// link move copy
const EFFECT_MOVE = 'copy'
export default {
  name: 'sort',
  componentName: 'sort',
  props: {
    draggable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isDragging: false,
      isDragover: false
    }
  },
  methods: {
    onDragStart (ev) {
      ev.dataTransfer.effectAllowed = EFFECT_MOVE
      this.isDragging = true
      this.$emit('start', ev)
    },
    onDrag (ev) {
      this.$emit('drag', ev)
    },
    onDragEnd (ev) {
      this.isDragging = false
      this.$emit('end', ev)
    },
    onDragOver (ev) {
      ev.dataTransfer.dropEffect = EFFECT_MOVE
      this.isDragover = true
      this.$emit('over', ev)
    },
    onDragLeave (ev) {
      this.isDragover = false
      this.$emit('leave', ev)
    },
    onDrop (ev) {
      // console.log('sort-drop')
      this.isDragover = false
      if (!this.isDragging) {
        this.$emit('drop', ev)
      }
    }
  }
}
</script>
