<template lang="pug">
    div.ic__dropdown(@click="handleClick" :class="positioning ? 'ic__dropdown--positioning' : 'ic__dropdown--non-positioning'"  v-clickoutside='handleClose')
        slot
        slot(name="dropdown")
</template>

<script>
import clickoutside from '../directives/clickoutside'

export default {
  name: 'IcDropdown',
  componentName: 'IcDropdown',
  directives: {
    clickoutside
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    clickByOutside: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      positioning: true,
      InnerVisible: false
    }
  },
  watch: {
    visible: {
      handler (after, before) {
        if (before === undefined) {
          this.InnerVisible = after
        } else {
          this.InnerVisible = !this.InnerVisible
        }
      },
      immediate: true
    }
  },
  methods: {
    handleClick (e) {
      this.$emit('visiableChange', !this.InnerVisible)
      this.$emit('click', e)
    },
    handleMenuItemClick (item) {
      this.$emit('change', item)
    },
    handleClose (e) {
      if (this.clickByOutside) {
        this.InnerVisible && this.$emit('handleClose')
        this.InnerVisible = false
      }
    }
  },
  created () {
    this.$on('handleMenuItemClick', this.handleMenuItemClick)
    if (!this.$slots.default) {
      this.positioning = false
    }
  }
}
</script>

<style lang='scss' scoped>
.ic__dropdown {
  &.ic__dropdown--positioning {
    position: relative;
  }
  &.ic__dropdown--non-positioning {
    position: unset;
  }
}
</style>
