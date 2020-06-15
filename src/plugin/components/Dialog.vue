<template lang="pug">
    transition(name="dialog-fade")
        .ic-dialog__wrapper(v-show="show" :style="{'left': left}" :class="[{'ic-dialog__wrapper--fullscreen': fullscreen}, customClass]" @click.self="handleWrapperClick")
            .ic-dialog(:style="{width: ( width || 640 ) + 'px'}")
                .ic-dialog__header
                    .ic-dialog__title
                        slot(name="title")
                    i.ibass-close.ibass--default.ic-dialog__close(@click="closeDialog()" v-if="showCloseIcon")
                .ic-dialog__body
                    slot(name="body")
                .ic-dialog__footer
                    slot(name="footer")
</template>
<script>
import ModelManager from '../helper/modalManager'
export default {
  name: 'ic-dialog',
  props: {
    width: Number,
    show: Boolean,
    customClass: String,
    fullscreen: {
      type: Boolean,
      default: true
    },
    closeByEsc: {
      type: Boolean,
      default: true
    },
    closeByClickDocument: {
      type: Boolean,
      default: false
    },
    showCloseIcon: {
      type: Boolean,
      default: true
    },
    lockScroll: {
      type: Boolean,
      default: true,
    }
  },
  computed: {
    id () {
      return Math.random()
    },
    left () {
      return this.fullscreen ? 0 : `calc(50% - ${this.width / 2 || 320}px)`
    }
  },
  watch: {
    show (val, oldVal) {
      if (val !== oldVal) {
        if (val) {
          this.$emit('open')
          if (this.lockScroll || this.fullscreen) {
            document.body.style.overflow = 'hidden'
          }
          ModelManager.add(this.id, this)
        } else {
          this.$emit('close')
          if (this.lockScroll || this.fullscreen) {
            document.body.style.overflow = 'auto'
          }
          ModelManager.remove(this.id)
        }
      }
    }
  },
  methods: {
    closeDialog () {
      this.$emit('update:show', false)
    },
    handleWrapperClick () {
      if (!this.closeByClickDocument) return
      this.closeDialog()
    }
  }
}
</script>
<style lang="scss" scoped>
    .dialog-fade-enter-active {
        animation: dialog-fade-in .3s;
    }

    .dialog-fade-leave-active {
        animation: dialog-fade-out .3s;
    }

    @keyframes dialog-fade-in {
        0% {
            transform: translate3d(0, -20px, 0);
            opacity: 0;
        }
        100% {
            transform: translate3d(0, 0, 0);
            opacity: 1;
        }
    }

    @keyframes dialog-fade-out {
        0% {
            transform: translate3d(0, 0, 0);
            opacity: 1;
        }
        100% {
            transform: translate3d(0, -20px, 0);
            opacity: 0;
        }
    }

    .ic-dialog__wrapper {
        position: absolute;
        top: 8rem;
        padding: 1rem;
        overflow: auto;
        z-index: 1000;
        @at-root #{&}--fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            padding: 8rem 0;
            background: rgba(0, 0, 0, 0.4);
        }
        .ic-dialog {
            position: relative;
            background: #fff;
            padding: 0 2rem;
            border-radius: 1rem;
            margin: auto;
            box-shadow: 0 4px 9px 0 rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
            @at-root #{&}__header {
                display: flex;
                min-height: 2rem;
                line-height: 2rem;
                padding: 1rem 0;
            }
            @at-root #{&}__title {
                @extend %f-giant;
                flex-grow: 1;
            }
            @at-root #{&}__close {
            }
            @at-root #{&}__body {
            }
            @at-root #{&}__footer{
                padding: 1rem 0;
            }
        }
    }
</style>
