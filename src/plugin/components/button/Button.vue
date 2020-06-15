<template lang="pug">
    .ic__button.pointer(:class="[ innerType ? `ic__button--type__${innerType}` : '', size ? `ic__button--size__${size}` : '' ]" @click="handleClick")
        slot 确定
</template>

<script>
export default {
  name: 'ic-button',
  componentName: 'IcButton',
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'normal'
    }
  },
  data () {
    return {
      innerType: this.type
    }
  },
  methods: {
    handleClick () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.ic__button {
  border-radius: 20px;
  @extend %f-small;
  @include flex(row,center,center);
  transition: all .2s;
  &:hover{
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
  }
}
.ic__button--type__primary {
  color: $color-white;
  background-color: $theme-color-light;
}
.ic__button--type__dangerous {
  color: $color-white;
  background-color: $dangerous-color;
}
.ic__button--type__gray {
  background-color: $color-bg-light;
}
.ic__button--type__normal {
  border: 1px solid $color-bd-regular;
}
.ic__button--size__normal {
  padding: 7px 0;
}
</style>
