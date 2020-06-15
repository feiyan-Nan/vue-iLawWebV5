<template lang="pug">
    li.ic__dropdown__item.pointer(:class="[`ic__dropdown__item__${active?'active':'normal'}`]" @click="clickHandle")
        slot
</template>

<script>
import emitter from '../mixin/emitter'

export default {
  name: 'IcDropdownItem',
  componentName: 'IcDropdownItem',
  mixins: [ emitter ],
  props: {
    active: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    clickHandle (e) {
      this.dispatch('IcDropdown', 'handleMenuItemClick', [ this ])
      this.$emit('click', e)
    }
  }
}
</script>
<style lang="scss" scoped>
.ic__dropdown__item__active{
    background-color: $color-text-almost-black;
}
</style>
