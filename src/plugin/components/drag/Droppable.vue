<template lang="pug">
    .ic-droppable(:class="[{'ic-droppable--hover': hover}, customClass]" @drop="handleDrop" @dragover="handleDragOver" @dragenter="handleDragEnter" @dragleave="handleDragLeave")
        slot
</template>

<script>
export default {
  name: 'ic-droppable',
  data () {
    return {
      hover: false
    }
  },
  props: {
    droppable: {
      type: Boolean,
      default: true
    },
    customClass: {
      type: String,
      default: ''
    },
    dropEffect: {
      type: String,
      default: 'move'
    },
    type: { // 拖拽drop的类型，根据类型来判断是dom的移动，还是需要进行文件处理，默认进行dom处理，可以支持file拖拽获取文件路径做上传准备
      type: String,
      default: 'dom'
    },
    needBase64: { // 读取文件内容是否为base64的文件流，如果是文件流，需要使用fileReader来读取
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleDrop (ev) {
      ev.preventDefault()
      if (this.droppable) {
        this.hover = false
        if (this.type === 'file') {
          this.handleFile(ev)
        } else {
          this.handleDom(ev)
        }
      }
    },
    handleDragOver (ev) {
      ev.preventDefault()
      if (this.droppable) {
        ev.dataTransfer.dropEffect = this.dropEffect
        this.hover = true
        this.$emit('dragover')
      }
    },
    handleDragEnter (ev) {
      if (this.droppable) {
        this.$emit('dragenter')
      }
    },
    handleDragLeave (ev) {
      if (this.droppable) {
        this.hover = false
        this.$emit('dragleave')
      }
    },
    handleFile (ev) {
      if (this.needBase64) {
        // 获取到拖拽的文件
        let files = ev.dataTransfer.files
        // 多文件拖拽，每次结束都会调用drop的回调方法
        for (let file of files) {
          let reader = new FileReader()
          reader.onload = event => {
            this.$emit('drop', file)
          }
          reader.readAsDataURL(file)
        }
      } else {
        this.$emit('drop', ev.dataTransfer.items)
      }
    },
    handleDom (ev) {
      // drop的时候需要将draggable对数据对节点添加到当前对节点中
      let id = ev.dataTransfer.getData('text')
      this.$el.appendChild(document.querySelector(`#${id}`))
      this.$emit('drop')
    }
  }
}
</script>

<style lang="scss" scoped>
.ic-droppable--hover {
    box-shadow: 0px 0px 5px $theme-color
}
</style>