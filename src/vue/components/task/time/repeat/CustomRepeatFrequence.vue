<template lang="pug">
  .ib__custom-repeat-frequence
    ic-popover(position="bottom" :triangle="false" :appendToBody="false" :positionY="positionY" :scrollable="true" v-model="visible")
      .items
        .item.pointer(v-for="item in 6" @click="changeFrequnece(item)" :class="{'active': frequence === item}")
          .ibass-checkmark
          span {{item}}
      .ib__custom-repeat-frequence__trigger(slot="trigger")
        span 每
        span.underline {{frequence}}
        .ibass-arrow-down
        span {{unitText}}
</template>
<script>
import {CUSTOM_RULE_UNIT} from '@/utils/constants'
export default {
  props: {
    frequence: {
      type: Number,
      default: 1
    },
    unit: {
      type: String,
      default: CUSTOM_RULE_UNIT.D.value
    }
  },
  data () {
    return {
      visible: false,
      positionY: 0
    }
  },
  methods: {
    changeFrequnece (val) {
      this.visible = false
      this.$emit('changeFrequnece', val)
    }
  },
  computed: {
    unitText () {
      return CUSTOM_RULE_UNIT[this.unit].label
    }
  },
  watch: {
    visible (newVal, oldVal) {
      if (newVal) {
        this.positionY = -this.frequence * 32 - 8
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .ib__custom-repeat-frequence {
    .items {
      width: 5rem;
      padding: 0.5rem 0;
      .item {
        display: flex;
        height: 2rem;
        line-height: 2rem;
        padding: 0 1rem;
        transition: all .2s;
        &:hover {
          background: $color-bg-light;
        }
        &.active {
          background: $color-bg-light;
          .ibass-checkmark {
            opacity: 1;
          }
        }
        .ibass-checkmark {
          opacity: 0;
          color: $theme-color-light;
        }
        span {
          margin-left: 1rem;
        }
      }
    }
    .ib__custom-repeat-frequence__trigger {
      display: flex;
      padding: 0 0.3125rem;
      transition: all .2s;
      color: $color-text-primary;
      &:hover {
        background: $color-bg-light;
      }
      .ibass-arrow-down {
        transform: scale(0.5);
      }
      .underline {
        text-decoration: underline;
        margin-left: 0.125rem;
      }
    }
  }
</style>
