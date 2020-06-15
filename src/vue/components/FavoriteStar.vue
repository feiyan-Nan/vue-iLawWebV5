<template lang="pug">
  .ib__star.pointer(@click="toggle")
    .icon.ibass-star(:class="{'animation': animation, 'visible': !choosed, 'invisible': choosed}" )
    .icon.ibass-star-fill(:class="{'animation':animation, 'visible': choosed, 'invisible': !choosed}")
</template>
<script>
export default {
  props: {
    choosed: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      animation: false
    }
  },
  methods: {
    toggle () {
      this.animation = true
      this.$emit('toggle', !this.choosed)
    }
  }
}
</script>
<style lang="scss" scoped>
  @keyframes shining {
    from {transform: scale(0); opacity: 0}
    to {transform: scale(1); opacity: 1}
  }
  @keyframes shining-down {
    from {transform: scale(1); opacity: 1}
    to {transform: scale(2); opacity: 0}
  }
  .ib__star {
    position: relative;
    @extend %f-normal;
    width: 0.875rem;
    margin-left: 0.875rem;
    .icon {
      position: absolute;
      opacity: 0;
      &.visible {
        opacity: 1;
      }
      &:before {
        vertical-align: -0.1875rem;
      }
    }
    .ibass-star {
      color: $color-text-placeholder;
    }
    .ibass-star-fill {
      position: absolute;
      color: $theme-color-lighter;
      opacity: 0;
      &.animation {
        &.visible {
          animation: shining 0.2s;
        }
        &.invisible {
          animation: shining-down 0.2s;
        }
      }
    }
    &:hover {
      .ibass-star {
        color: $theme-color;
      }
      .ibass-star-fill {
        color: $theme-color;
      }
    }
  }
</style>