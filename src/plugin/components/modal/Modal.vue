<template lang="pug">
 transition(name="modal-fade")
  .ic-modal__wrap(v-if="visible" @click.self="handleClose")
    .ic-modal.bounceIn(:class="[customClass]" :style="{width:`${width-36}px`}")
      .ic-modal__header
        .ibass-close(@click="close")
      .ic-modal__body
        slot
          component(:is="component" v-if="component" @cb="callback")
</template>
<script>
export default {
  name: 'ic-modal',
  componentName: 'IcModal',
  data () {
    return {
      visible: false,
      width: 640,
      cb: Function,
      closeByOutside: false,
      customClass: '',
      // ESC: false esc 关闭暂时不支持
    }
  },
  methods: {
    handleClose () {
      if (this.closeByOutside) this.close()
    },
    close () {
      this.visible = false
    },
    open () {
      this.visible = true
    },
    callback (event) {
      if (typeof this.cb === 'function') this.cb(event)
    },
  },
  watch: {
    visible (after, before) {
      // this.$emit('input', after)
      document.children[0].style['overflow-y'] = this.visible ? 'hidden' : 'auto'
    },
  }
}
</script>
<style lang="scss" scoped>
.ic-modal__wrap{
  position: fixed;
  overflow: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, .6);
  z-index: 1001;
}
.ic-modal{
  position: relative;
  background-color: $color-white;
  border: solid 1px $color-bd-extra-light;
  box-shadow: 0 4px 9px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin: 0 auto;
  padding: 17px;
  top: 100px;
  #{&}__header{
    @include flex(row, flex-end)
  }
}
</style>