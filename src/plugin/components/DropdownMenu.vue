<template lang="pug">
    transition(name="fade")
        ul.ic__dropdown__menu(ref="menu" v-show="$parent.InnerVisible" :class="[type ? `ic__dropdown__menu--${type}` : '', `ic__dropdown__menu--${theme}`]")
            .ic__dropwdown-solt
                slot
</template>

<script>
export default {
  name: 'IcDropdownMenu',
  componentName: 'IcDropdownMenu',
  props: {
    type: {
      type: String,
      default: 'horizontal'
    },
    theme: {
      type: String,
      default: 'white'
    },
    isNailed: {
      type: Boolean,
      default: true
    },
    positionX: {
      type: Number,
    }
  },
  mounted () {
    setTimeout(() => {
      if (this.positionX) {
        this.$refs.menu.style.left = `${this.positionX}px`
      } else {
        let triggerDom = this.$parent.$slots.default[0].elm.getBoundingClientRect()
        this.$refs.menu.style.left = this.isNailed ? `${triggerDom.width / 2}px` : '50%'
      }
    }, 0)
  },
}
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.ic__dropdown__menu {
  z-index: 1000;
  @include flex(column);
  position: absolute;
  border-radius: 10px;
  &:before {
    content: '';
    position:absolute;
    border: solid 9px transparent;
    border-bottom-width: 12px;
    left: 50%;
    transform: translate( -50%, -100%);
  };
  &::after {
    content: '';
    position: absolute;
    border: solid 8px transparent;
    border-bottom-width: 11px;
    left: 50%;
    transform: translate( -50%, -100%);
  }
  &.ic__dropdown__menu--horizontal {
    // left: 50%;
    top: 100%;
    transform: translate( -50%, 10px);
  };
  &.ic__dropdown__menu--white {
    @extend %bg-pre-white;
    border: solid 1px $color-bd-extra-light;
    box-shadow: 0 4px 9px 0 rgba(0, 0, 0, 0.1);
        &:before {
            border-bottom-color: $color-bd-extra-light;
        };
        &::after{
            border-bottom-color: $color-white;
        }
    }
  &.ic__dropdown__menu--black {
    background-color: $color-bg-normal;
    box-shadow: 0 4px 9px 0 rgba(0, 0, 0, 0.1);
    &:before {
        border-bottom-color: $color-bg-normal
    };
    &::after{
        border-bottom-color: $color-bg-normal
    }
  }
}
.ic__dropwdown-solt{
  padding:10px 0 5px;
}

</style>
